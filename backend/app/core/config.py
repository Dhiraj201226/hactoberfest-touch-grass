import os
from typing import Optional

class Settings:
    PROJECT_NAME: str = os.getenv("PROJECT_NAME", "NatureQuest AI")
    API_V1_STR: str = os.getenv("API_V1_STR", "/api/v1")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "dev-secret-key-change-in-production-naturequest-ai-hacktoberfest-2026")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", str(60 * 24 * 7)))
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./naturequest.db")
    
    # File storage
    UPLOAD_DIR: str = os.getenv("UPLOAD_DIR", "./uploads")
    MAX_UPLOAD_SIZE_MB: int = int(os.getenv("MAX_UPLOAD_SIZE_MB", "15"))
    ALLOWED_IMAGE_TYPES: list[str] = ["image/jpeg", "image/png", "image/webp"]
    
    # NeuralEye Configuration
    NEURALEYE_PROVIDER: str = os.getenv("NEURALEYE_PROVIDER", "local")
    NEURALEYE_BASE_URL: Optional[str] = os.getenv("NEURALEYE_BASE_URL")
    NEURALEYE_MODEL_PATH: Optional[str] = os.getenv("NEURALEYE_MODEL_PATH")
    
    # LLM Quest Generator (Ollama)
    OLLAMA_BASE_URL: str = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    OLLAMA_MODEL: str = os.getenv("OLLAMA_MODEL", "qwen2.5:3b")

settings = Settings()
