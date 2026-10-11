from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from app.db.session import get_db
from app.models.models import Quest, QuestAttempt, User
from app.schemas.schemas import QuestResponse, QuestAttemptResponse
from app.core.security import get_current_user
from app.services.llm_quests import quest_generator

router = APIRouter(prefix="/quests", tags=["Quests"])

@router.get("", response_model=List[QuestResponse])
def get_quests(
    category: Optional[str] = None,
    difficulty: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Quest).filter(Quest.active == True)
    if category:
        query = query.filter(Quest.category == category)
    if difficulty:
        query = query.filter(Quest.difficulty == difficulty)
    return query.all()

@router.get("/{quest_id}", response_model=QuestResponse)
def get_quest(quest_id: str, db: Session = Depends(get_db)):
    quest = db.query(Quest).filter(Quest.id == quest_id).first()
    if not quest:
        raise HTTPException(status_code=404, detail="Quest not found")
    return quest

@router.post("/generate", response_model=QuestResponse)
async def generate_ai_quest(
    category: str = "plants",
    difficulty: str = "easy",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    quest_data = await quest_generator.generate_quest(category, difficulty)
    new_quest = Quest(
        title=quest_data["title"],
        description=quest_data["description"],
        category=quest_data["category"],
        difficulty=quest_data["difficulty"],
        duration_minutes=quest_data.get("duration_minutes", 15),
        instructions=quest_data["instructions"],
        completion_criteria=quest_data["completion_criteria"],
        safety_notes=quest_data["safety_notes"],
        evidence_type=quest_data.get("evidence_type", "photo"),
        xp_reward=quest_data["xp_reward"],
        source_type=quest_data.get("source_type", "ai_generated"),
        image_url="https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=800&q=80"
    )
    db.add(new_quest)
    db.commit()
    db.refresh(new_quest)
    return new_quest

@router.post("/{quest_id}/start", response_model=QuestAttemptResponse)
def start_quest(
    quest_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    quest = db.query(Quest).filter(Quest.id == quest_id).first()
    if not quest:
        raise HTTPException(status_code=404, detail="Quest not found")

    # Check if there is already an active attempt
    attempt = db.query(QuestAttempt).filter(
        QuestAttempt.user_id == current_user.id,
        QuestAttempt.quest_id == quest_id,
        QuestAttempt.status == "IN_PROGRESS"
    ).first()

    if not attempt:
        attempt = QuestAttempt(
            user_id=current_user.id,
            quest_id=quest_id,
            status="IN_PROGRESS",
            started_at=datetime.utcnow()
        )
        db.add(attempt)
        db.commit()
        db.refresh(attempt)

    return attempt

@router.get("/attempts/active", response_model=Optional[QuestAttemptResponse])
def get_active_attempt(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    attempt = db.query(QuestAttempt).filter(
        QuestAttempt.user_id == current_user.id,
        QuestAttempt.status == "IN_PROGRESS"
    ).order_by(QuestAttempt.started_at.desc()).first()
    return attempt
