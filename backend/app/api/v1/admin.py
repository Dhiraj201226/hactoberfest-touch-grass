from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.db.session import get_db
from app.models.models import User, Submission, QuestAttempt
from app.core.security import get_current_admin
from app.services.gamification import award_xp

router = APIRouter(prefix="/admin", tags=["Admin & Moderation"])

@router.get("/submissions")
def get_moderation_queue(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    """
    Returns submissions pending review or flagged by verification pipelines.
    """
    submissions = db.query(Submission).order_by(desc(Submission.created_at)).limit(50).all()
    output = []
    for s in submissions:
        output.append({
            "id": s.id,
            "user_id": s.user_id,
            "username": s.user.username if s.user else "Unknown",
            "quest_title": s.attempt.quest.title if s.attempt and s.attempt.quest else "Quest",
            "media_storage_key": s.media_storage_key,
            "status": s.status,
            "sha256_hash": s.sha256_hash,
            "created_at": s.created_at,
            "verification": {
                "predicted_class": s.verification.predicted_class if s.verification else "N/A",
                "raw_confidence": s.verification.raw_confidence if s.verification else None,
                "result_status": s.verification.result_status if s.verification else "N/A",
                "error_code": s.verification.error_code if s.verification else None
            } if s.verification else None
        })
    return output

@router.post("/submissions/{submission_id}/approve")
def admin_approve_submission(
    submission_id: str,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    submission = db.query(Submission).filter(Submission.id == submission_id).first()
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")

    submission.status = "APPROVED"
    if submission.attempt:
        submission.attempt.status = "APPROVED"
        reward = submission.attempt.quest.xp_reward if submission.attempt.quest else 20
        award_xp(
            db=db,
            user=submission.user,
            amount=reward,
            reason=f"Admin Approved: {submission.attempt.quest.title if submission.attempt.quest else 'Quest'}",
            source_type="submission",
            source_id=submission.id
        )
    db.commit()
    return {"message": "Submission approved and XP awarded."}

@router.post("/submissions/{submission_id}/reject")
def admin_reject_submission(
    submission_id: str,
    reason: str = Body(..., embed=True),
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    submission = db.query(Submission).filter(Submission.id == submission_id).first()
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")

    submission.status = "REJECTED"
    submission.review_reason = reason
    if submission.attempt:
        submission.attempt.status = "REJECTED"
    db.commit()
    return {"message": "Submission rejected."}
