from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List, Dict, Any
from app.db.session import get_db
from app.models.models import User, Achievement, UserAchievement, Challenge, Notification, Submission
from app.schemas.schemas import LeaderboardUser, AchievementResponse
from app.core.security import get_current_user

router = APIRouter(tags=["Gamification & Social"])

@router.get("/leaderboard", response_model=List[LeaderboardUser])
def get_leaderboard(db: Session = Depends(get_db)):
    users = db.query(User).order_by(desc(User.total_xp_cache)).limit(50).all()
    results = []
    for rank, u in enumerate(users, start=1):
        approved_count = len([s for s in u.submissions if s.status == "APPROVED"])
        results.append(LeaderboardUser(
            rank=rank,
            user_id=u.id,
            username=u.username,
            display_name=u.display_name,
            avatar_url=u.avatar_url,
            level=u.level,
            total_xp=u.total_xp_cache,
            verified_quests_count=approved_count,
            current_streak=u.current_streak
        ))
    return results

@router.get("/achievements", response_model=List[AchievementResponse])
def get_achievements(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    all_achievements = db.query(Achievement).filter(Achievement.active == True).all()
    unlocked_map = {ua.achievement_id: ua.unlocked_at for ua in current_user.achievements}

    response = []
    for ach in all_achievements:
        is_unlocked = ach.id in unlocked_map
        response.append(AchievementResponse(
            id=ach.id,
            name=ach.name,
            description=ach.description,
            icon=ach.icon,
            requirement_type=ach.requirement_type,
            requirement_value=ach.requirement_value,
            xp_reward=ach.xp_reward,
            unlocked=is_unlocked,
            unlocked_at=unlocked_map.get(ach.id)
        ))
    return response

@router.get("/notifications")
def get_notifications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    notifs = db.query(Notification).filter(
        Notification.user_id == current_user.id
    ).order_by(desc(Notification.created_at)).limit(20).all()
    return notifs

@router.get("/challenges")
def get_challenges(db: Session = Depends(get_db)):
    return db.query(Challenge).filter(Challenge.active == True).all()
