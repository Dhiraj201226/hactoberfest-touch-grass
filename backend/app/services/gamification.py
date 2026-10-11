from datetime import datetime, date
from sqlalchemy.orm import Session
from app.models.models import User, XPTransaction, UserAchievement, Achievement, Notification

def award_xp(db: Session, user: User, amount: int, reason: str, source_type: str, source_id: str) -> bool:
    """
    Enforces server-authoritative, exactly-once XP award transactions.
    Uses idempotency keys to guarantee no double-counting or repeated exploits.
    """
    idempotency_key = f"{user.id}:{source_type}:{source_id}"
    
    # Check if transaction already exists
    existing = db.query(XPTransaction).filter(XPTransaction.idempotency_key == idempotency_key).first()
    if existing:
        return False # Already awarded!

    # Create immutable transaction record
    tx = XPTransaction(
        user_id=user.id,
        amount=amount,
        reason=reason,
        source_type=source_type,
        source_id=source_id,
        idempotency_key=idempotency_key
    )
    db.add(tx)

    # Increment authoritative user XP cache
    user.total_xp_cache += amount
    user.level = max(1, (user.total_xp_cache // 100) + 1)

    # Check streak updates
    today_str = date.today().isoformat()
    if user.last_active_date != today_str:
        user.current_streak += 1
        if user.current_streak > user.longest_streak:
            user.longest_streak = user.current_streak
        user.last_active_date = today_str

    # Create in-app notification
    notification = Notification(
        user_id=user.id,
        title=f"+{amount} XP Earned!",
        message=f"You earned {amount} XP for '{reason}'. Keep up the outdoor discovery!",
        notification_type="xp"
    )
    db.add(notification)

    # Check and trigger achievements
    check_achievements(db, user)

    db.commit()
    return True

def check_achievements(db: Session, user: User):
    """
    Evaluates achievement criteria and unlocks badges if qualified.
    """
    # Count approved submissions
    approved_count = len([s for s in user.submissions if s.status == "APPROVED"])
    
    achievements = db.query(Achievement).filter(Achievement.active == True).all()
    for ach in achievements:
        already_has = db.query(UserAchievement).filter(
            UserAchievement.user_id == user.id,
            UserAchievement.achievement_id == ach.id
        ).first()

        if already_has:
            continue

        unlocked = False
        if ach.requirement_type == "quests_completed" and approved_count >= ach.requirement_value:
            unlocked = True
        elif ach.requirement_type == "streak_days" and user.current_streak >= ach.requirement_value:
            unlocked = True

        if unlocked:
            user_ach = UserAchievement(
                user_id=user.id,
                achievement_id=ach.id
            )
            db.add(user_ach)
            # Notify user
            db.add(Notification(
                user_id=user.id,
                title=f"Badge Unlocked: {ach.name}!",
                message=f"Congratulations! You unlocked the '{ach.name}' achievement badge.",
                notification_type="badge"
            ))
            # Award bonus XP for achievement
            user.total_xp_cache += ach.xp_reward
