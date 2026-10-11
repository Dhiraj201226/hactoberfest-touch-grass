from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.models import User, QuestAttempt, Submission, Challenge
from app.schemas.schemas import UserResponse
from app.core.security import get_current_user

router = APIRouter(prefix="/users", tags=["Users & Dashboard"])

@router.get("/me/stats")
def get_user_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    approved_submissions = db.query(Submission).filter(
        Submission.user_id == current_user.id,
        Submission.status == "APPROVED"
    ).count()

    total_attempts = db.query(QuestAttempt).filter(
        QuestAttempt.user_id == current_user.id
    ).count()

    unlocked_achievements = len(current_user.achievements)

    return {
        "user_id": current_user.id,
        "username": current_user.username,
        "display_name": current_user.display_name,
        "level": current_user.level,
        "total_xp": current_user.total_xp_cache,
        "current_streak": current_user.current_streak,
        "longest_streak": current_user.longest_streak,
        "verified_quests": approved_submissions,
        "total_attempts": total_attempts,
        "achievements_count": unlocked_achievements,
        "onboarding_completed": current_user.onboarding_completed
    }

@router.post("/me/onboarding")
def complete_onboarding(
    payload: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    current_user.onboarding_completed = True
    db.commit()
    return {"status": "success", "onboarding_completed": True}

@router.get("/{username}")
def get_user_profile(username: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == username).first()
    if not user:
        return {"error": "User not found"}
    
    approved_submissions = [s for s in user.submissions if s.status == "APPROVED"]
    return {
        "id": user.id,
        "username": user.username,
        "display_name": user.display_name,
        "avatar_url": user.avatar_url,
        "bio": user.bio,
        "level": user.level,
        "total_xp": user.total_xp_cache,
        "current_streak": user.current_streak,
        "verified_quests": len(approved_submissions),
        "achievements": [{"id": ua.achievement_id, "unlocked_at": ua.unlocked_at} for ua in user.achievements]
    }
