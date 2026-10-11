import uuid
from datetime import datetime
from sqlalchemy import (
    Column, String, Integer, Float, Boolean, DateTime, ForeignKey, Text, JSON
)
from sqlalchemy.orm import relationship
from app.db.session import Base

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(120), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    display_name = Column(String(100), nullable=False)
    avatar_url = Column(String(255), nullable=True)
    bio = Column(Text, nullable=True)
    role = Column(String(20), default="user", nullable=False) # "user" | "admin"
    level = Column(Integer, default=1, nullable=False)
    total_xp_cache = Column(Integer, default=0, nullable=False)
    current_streak = Column(Integer, default=0, nullable=False)
    longest_streak = Column(Integer, default=0, nullable=False)
    last_active_date = Column(String(10), nullable=True) # YYYY-MM-DD
    profile_visibility = Column(String(20), default="public", nullable=False)
    onboarding_completed = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    attempts = relationship("QuestAttempt", back_populates="user", cascade="all, delete-orphan")
    submissions = relationship("Submission", back_populates="user", cascade="all, delete-orphan")
    xp_transactions = relationship("XPTransaction", back_populates="user", cascade="all, delete-orphan")
    achievements = relationship("UserAchievement", back_populates="user", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
    challenges = relationship("ChallengeParticipant", back_populates="user", cascade="all, delete-orphan")

class Quest(Base):
    __tablename__ = "quests"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    title = Column(String(150), nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String(50), index=True, nullable=False) # plants, birds, trees, weather, etc.
    difficulty = Column(String(20), default="easy", nullable=False) # easy, medium, hard
    duration_minutes = Column(Integer, default=15, nullable=False)
    instructions = Column(JSON, nullable=False) # list of string steps
    completion_criteria = Column(JSON, nullable=False) # list of criteria
    safety_notes = Column(JSON, nullable=False) # list of safety tips
    evidence_type = Column(String(20), default="photo", nullable=False) # photo, video
    xp_reward = Column(Integer, default=20, nullable=False)
    source_type = Column(String(30), default="curated", nullable=False) # curated | ai_generated
    image_url = Column(String(255), nullable=True)
    active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    attempts = relationship("QuestAttempt", back_populates="quest", cascade="all, delete-orphan")

class QuestAttempt(Base):
    __tablename__ = "quest_attempts"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    quest_id = Column(String(36), ForeignKey("quests.id"), nullable=False, index=True)
    status = Column(String(30), default="AVAILABLE", nullable=False) # IN_PROGRESS, SUBMITTED, APPROVED, REJECTED, NEEDS_REVIEW
    started_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    submitted_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="attempts")
    quest = relationship("Quest", back_populates="attempts")
    submissions = relationship("Submission", back_populates="attempt", cascade="all, delete-orphan")

class Submission(Base):
    __tablename__ = "submissions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    quest_attempt_id = Column(String(36), ForeignKey("quest_attempts.id"), nullable=False, index=True)
    media_storage_key = Column(String(255), nullable=False)
    media_type = Column(String(50), nullable=False)
    sha256_hash = Column(String(64), index=True, nullable=False)
    perceptual_hash = Column(String(64), index=True, nullable=True)
    description = Column(Text, nullable=True)
    status = Column(String(30), default="PENDING", nullable=False) # PENDING, APPROVED, REJECTED, NEEDS_REVIEW
    review_reason = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="submissions")
    attempt = relationship("QuestAttempt", back_populates="submissions")
    verification = relationship("VerificationResult", back_populates="submission", uselist=False, cascade="all, delete-orphan")

class VerificationResult(Base):
    __tablename__ = "verification_results"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    submission_id = Column(String(36), ForeignKey("submissions.id"), unique=True, nullable=False, index=True)
    detector_provider = Column(String(50), nullable=False) # neuraleye_local, neuraleye_api, mock
    model_version = Column(String(50), nullable=False)
    predicted_class = Column(String(50), nullable=False) # genuine, synthetic_ai, uncertain
    raw_confidence = Column(Float, nullable=True)
    result_status = Column(String(30), nullable=False) # APPROVED, REJECTED, NEEDS_REVIEW
    relevance_result = Column(String(50), default="relevant", nullable=True)
    duplicate_result = Column(String(50), default="unique", nullable=True)
    error_code = Column(String(50), nullable=True)
    metadata_json = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    submission = relationship("Submission", back_populates="verification")

class XPTransaction(Base):
    __tablename__ = "xp_transactions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    amount = Column(Integer, nullable=False)
    reason = Column(String(100), nullable=False)
    source_type = Column(String(50), nullable=False) # submission, achievement, challenge, streak
    source_id = Column(String(36), nullable=False, index=True)
    idempotency_key = Column(String(100), unique=True, index=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="xp_transactions")

class Achievement(Base):
    __tablename__ = "achievements"

    id = Column(String(50), primary_key=True) # e.g. "first_discovery", "streak_7"
    name = Column(String(100), nullable=False)
    description = Column(String(255), nullable=False)
    icon = Column(String(50), default="award", nullable=False)
    requirement_type = Column(String(50), nullable=False) # quests_completed, streak_days, plant_quests
    requirement_value = Column(Integer, nullable=False)
    xp_reward = Column(Integer, default=50, nullable=False)
    active = Column(Boolean, default=True, nullable=False)

    user_achievements = relationship("UserAchievement", back_populates="achievement")

class UserAchievement(Base):
    __tablename__ = "user_achievements"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    achievement_id = Column(String(50), ForeignKey("achievements.id"), nullable=False, index=True)
    unlocked_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="achievements")
    achievement = relationship("Achievement", back_populates="user_achievements")

class Challenge(Base):
    __tablename__ = "challenges"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    title = Column(String(150), nullable=False)
    description = Column(Text, nullable=False)
    challenge_type = Column(String(30), default="weekly", nullable=False) # daily, weekly, community
    target_quests_count = Column(Integer, default=3, nullable=False)
    xp_bonus = Column(Integer, default=100, nullable=False)
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=False)
    active = Column(Boolean, default=True, nullable=False)

    participants = relationship("ChallengeParticipant", back_populates="challenge")

class ChallengeParticipant(Base):
    __tablename__ = "challenge_participants"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    challenge_id = Column(String(36), ForeignKey("challenges.id"), nullable=False, index=True)
    progress_count = Column(Integer, default=0, nullable=False)
    completed = Column(Boolean, default=False, nullable=False)
    completed_at = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="challenges")
    challenge = relationship("Challenge", back_populates="participants")

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    title = Column(String(150), nullable=False)
    message = Column(Text, nullable=False)
    notification_type = Column(String(50), default="system", nullable=False)
    is_read = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="notifications")
