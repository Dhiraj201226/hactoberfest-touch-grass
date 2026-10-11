import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.core.config import settings
from app.db.session import engine, Base, SessionLocal
from app.db.seed import seed_database
from app.api.v1 import auth, quests, submissions, gamification, users, admin
from app.services.neuraleye import preload_neuraleye

# Initialize database tables
Base.metadata.create_all(bind=engine)

# Seed initial quests and achievements
with SessionLocal() as db:
    seed_database(db)

# Create upload directory
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

# Pre-warm NeuralEye vision transformer in background so first user submission never hangs
preload_neuraleye()

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount uploaded media static files safely
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Include API v1 Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(quests.router, prefix=settings.API_V1_STR)
app.include_router(submissions.router, prefix=settings.API_V1_STR)
app.include_router(gamification.router, prefix=settings.API_V1_STR)
app.include_router(users.router, prefix=settings.API_V1_STR)
app.include_router(admin.router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "app": settings.PROJECT_NAME,
        "tagline": "Explore More, Scroll Less",
        "version": "1.0.0",
        "docs": f"{settings.API_V1_STR}/docs"
    }
