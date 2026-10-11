from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

# --- Auth Schemas ---
class UserRegister(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=6)
    display_name: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Dict[str, Any]

class UserResponse(BaseModel):
    id: str
    username: str
    email: str
    display_name: str
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    role: str
    level: int
    total_xp: int
    current_streak: int
    longest_streak: int
    profile_visibility: str
    onboarding_completed: bool
    created_at: datetime

    class Config:
        from_attributes = True

# --- Quest Schemas ---
class QuestBase(BaseModel):
    title: str
    description: str
    category: str
    difficulty: str
    duration_minutes: int
    instructions: List[str]
    completion_criteria: List[str]
    safety_notes: List[str]
    evidence_type: str = "photo"
    xp_reward: int
    image_url: Optional[str] = None

class QuestCreate(QuestBase):
    source_type: str = "curated"

class QuestResponse(QuestBase):
    id: str
    source_type: str
    active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class QuestAttemptResponse(BaseModel):
    id: str
    user_id: str
    quest_id: str
    status: str
    started_at: datetime
    submitted_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    quest: Optional[QuestResponse] = None

    class Config:
        from_attributes = True

# --- Submission Schemas ---
class VerificationResultResponse(BaseModel):
    id: str
    detector_provider: str
    model_version: str
    predicted_class: str
    raw_confidence: Optional[float] = None
    result_status: str
    relevance_result: Optional[str] = None
    duplicate_result: Optional[str] = None
    error_code: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class SubmissionResponse(BaseModel):
    id: str
    user_id: str
    quest_attempt_id: str
    media_storage_key: str
    media_url: Optional[str] = None
    media_type: str
    sha256_hash: str
    description: Optional[str] = None
    status: str
    review_reason: Optional[str] = None
    created_at: datetime
    verification: Optional[VerificationResultResponse] = None

    class Config:
        from_attributes = True

# --- Gamification Schemas ---
class XPTransactionResponse(BaseModel):
    id: str
    amount: int
    reason: str
    source_type: str
    source_id: str
    created_at: datetime

    class Config:
        from_attributes = True

class LeaderboardUser(BaseModel):
    rank: int
    user_id: str
    username: str
    display_name: str
    avatar_url: Optional[str] = None
    level: int
    total_xp: int
    verified_quests_count: int
    current_streak: int

class AchievementResponse(BaseModel):
    id: str
    name: str
    description: str
    icon: str
    requirement_type: str
    requirement_value: int
    xp_reward: int
    unlocked: bool = False
    unlocked_at: Optional[datetime] = None

    class Config:
        from_attributes = True
