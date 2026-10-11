import os
import hashlib
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.orm import Session
from app.core.config import settings
from app.db.session import get_db
from app.models.models import User, QuestAttempt, Submission, VerificationResult
from app.schemas.schemas import SubmissionResponse
from app.core.security import get_current_user
from app.services.neuraleye import neuraleye_detector
from app.services.gamification import award_xp

router = APIRouter(prefix="/submissions", tags=["Submissions"])

@router.post("", response_model=SubmissionResponse)
async def create_submission(
    quest_attempt_id: str = Form(...),
    description: str = Form(""),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    attempt = db.query(QuestAttempt).filter(
        QuestAttempt.id == quest_attempt_id,
        QuestAttempt.user_id == current_user.id
    ).first()

    if not attempt:
        raise HTTPException(status_code=404, detail="Active quest attempt not found")

    # Validate file mime type
    if file.content_type not in settings.ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file format: {file.content_type}. Please upload JPEG, PNG, or WebP."
        )

    # Read content and enforce max upload size
    contents = await file.read()
    if len(contents) > settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024:
        raise HTTPException(
            status_code=400,
            detail=f"File exceeds maximum allowed size of {settings.MAX_UPLOAD_SIZE_MB}MB."
        )

    # Compute exact SHA-256 hash for duplicate detection
    sha256_hash = hashlib.sha256(contents).hexdigest()

    # Check for identical duplicate submission in database
    duplicate = db.query(Submission).filter(Submission.sha256_hash == sha256_hash).first()
    if duplicate:
        raise HTTPException(
            status_code=400,
            detail="Duplicate evidence detected. This exact image has already been submitted for a quest."
        )

    # Save to storage safely
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    extension = os.path.splitext(file.filename)[1] or ".jpg"
    storage_key = f"{current_user.id}_{datetime.utcnow().strftime('%Y%m%d%H%M%S')}_{sha256_hash[:8]}{extension}"
    file_path = os.path.join(settings.UPLOAD_DIR, storage_key)

    with open(file_path, "wb") as f:
        f.write(contents)

    # Run NeuralEye media forensics inspection
    forensic = neuraleye_detector.analyze_image(file_path)

    # Create Submission record
    submission = Submission(
        user_id=current_user.id,
        quest_attempt_id=attempt.id,
        media_storage_key=storage_key,
        media_type=file.content_type,
        sha256_hash=sha256_hash,
        perceptual_hash=forensic.get("p_hash"),
        description=description,
        status=forensic.get("result_status", "NEEDS_REVIEW")
    )
    db.add(submission)
    db.flush() # populate submission.id

    # Create VerificationResult record
    verification = VerificationResult(
        submission_id=submission.id,
        detector_provider=forensic.get("provider", "neuraleye_local"),
        model_version=forensic.get("model_version", "v2.4"),
        predicted_class=forensic.get("predicted_class", "genuine"),
        raw_confidence=forensic.get("raw_confidence"),
        result_status=forensic.get("result_status", "NEEDS_REVIEW"),
        relevance_result=forensic.get("relevance_result", "relevant"),
        duplicate_result=forensic.get("duplicate_result", "unique"),
        error_code=forensic.get("error_code")
    )
    db.add(verification)

    # Update attempt status
    attempt.status = submission.status
    attempt.submitted_at = datetime.utcnow()

    # If APPROVED, execute authoritative XP transaction immediately
    if submission.status == "APPROVED":
        attempt.completed_at = datetime.utcnow()
        reward = attempt.quest.xp_reward if attempt.quest else 20
        award_xp(
            db=db,
            user=current_user,
            amount=reward,
            reason=f"Completed quest: {attempt.quest.title if attempt.quest else 'Outdoor Quest'}",
            source_type="submission",
            source_id=submission.id
        )

    db.commit()
    db.refresh(submission)
    return submission

@router.get("/{submission_id}", response_model=SubmissionResponse)
def get_submission(
    submission_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    submission = db.query(Submission).filter(Submission.id == submission_id).first()
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
    return submission
