from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.models.models import Quest, Achievement, Challenge, User
from app.core.security import get_password_hash

def seed_database(db: Session):
    # Seed default demo/admin user accounts if empty
    if db.query(User).filter(User.email == "demo@naturequest.app").first() is None:
        demo_user = User(
            email="demo@naturequest.app",
            username="NatureExplorer",
            display_name="Demo Naturalist",
            password_hash=get_password_hash("NaturePass123!"),
            role="user",
            total_xp_cache=120,
            level=2,
            current_streak=3,
            longest_streak=5,
            onboarding_completed=True
        )
        db.add(demo_user)

    if db.query(User).filter(User.email == "admin@naturequest.app").first() is None:
        admin_user = User(
            email="admin@naturequest.app",
            username="RangerAdmin",
            display_name="Ranger Lead",
            password_hash=get_password_hash("AdminPass123!"),
            role="admin",
            total_xp_cache=500,
            level=5,
            current_streak=7,
            longest_streak=14,
            onboarding_completed=True
        )
        db.add(admin_user)

    # Seed Achievements if empty
    if db.query(Achievement).count() == 0:
        achievements = [
            Achievement(
                id="first_discovery",
                name="First Discovery",
                description="Complete and verify your very first real-world nature quest.",
                icon="compass",
                requirement_type="quests_completed",
                requirement_value=1,
                xp_reward=50
            ),
            Achievement(
                id="flora_explorer",
                name="Flora Explorer",
                description="Complete 3 verified plant or leaf observation quests.",
                icon="leaf",
                requirement_type="quests_completed",
                requirement_value=3,
                xp_reward=75
            ),
            Achievement(
                id="nature_streak_3",
                name="3-Day Nature Habit",
                description="Step outside and record nature discoveries 3 days in a row.",
                icon="flame",
                requirement_type="streak_days",
                requirement_value=3,
                xp_reward=100
            ),
            Achievement(
                id="master_naturalist",
                name="Master Naturalist",
                description="Complete 10 verified outdoor missions across any category.",
                icon="award",
                requirement_type="quests_completed",
                requirement_value=10,
                xp_reward=250
            ),
        ]
        db.add_all(achievements)

    # Seed Curated Quests if empty
    if db.query(Quest).count() == 0:
        quests = [
            Quest(
                title="Leaf Pattern Detective",
                category="plants",
                difficulty="easy",
                duration_minutes=15,
                description="Explore a park or garden to discover three distinct leaf vein architectures.",
                instructions=[
                    "Walk into a safe natural green space.",
                    "Look for fallen leaves showing netted vs parallel venation.",
                    "Take a well-lit photo of the intricate vein network."
                ],
                completion_criteria=[
                    "Submit one clear photograph of leaf venation",
                    "No damage caused to living flora"
                ],
                safety_notes=[
                    "Stay on public trails",
                    "Do not handle unfamiliar poisonous plants"
                ],
                evidence_type="photo",
                xp_reward=25,
                source_type="curated",
                image_url="https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80"
            ),
            Quest(
                title="Ancient Canopy & Bark Cartography",
                category="trees",
                difficulty="medium",
                duration_minutes=20,
                description="Identify a mature deciduous or coniferous tree and photograph its bark ridges and symbiotic lichen.",
                instructions=[
                    "Locate a mature tree with rough or furrowed bark.",
                    "Inspect the trunk surface for patches of green/gray lichen.",
                    "Photograph the texture up close with natural lighting."
                ],
                completion_criteria=[
                    "Close-up photo of natural bark texture or lichen",
                    "Clear focus showing organic details"
                ],
                safety_notes=[
                    "Do not climb unstable branches",
                    "Respect nesting wildlife"
                ],
                xp_reward=35,
                source_type="curated",
                image_url="https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80"
            ),
            Quest(
                title="Atmospheric Cloud Sculptures",
                category="weather",
                difficulty="easy",
                duration_minutes=10,
                description="Observe the sky and capture an interesting cloud formation (Cumulus, Cirrus, or Stratus).",
                instructions=[
                    "Step outdoors into an unobstructed view of the open sky.",
                    "Observe wind motion and cloud formation for 5 minutes.",
                    "Photograph the most dramatic cloud texture."
                ],
                completion_criteria=[
                    "Clear photograph of sky and cloud patterns"
                ],
                safety_notes=[
                    "Never look directly into the sun",
                    "Seek shelter if severe thunderstorms develop"
                ],
                xp_reward=20,
                source_type="curated",
                image_url="https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=800&q=80"
            ),
            Quest(
                title="Avian Observer & Perch Spotter",
                category="birds",
                difficulty="hard",
                duration_minutes=30,
                description="Patience is key. Spot a wild bird perched in foliage and record its presence from a respectful distance.",
                instructions=[
                    "Find a quiet wooded area or waterside spot.",
                    "Wait quietly for 10 minutes observing movement in tree branches.",
                    "Capture a photo of a bird perched naturally."
                ],
                completion_criteria=[
                    "Visible photo of a wild bird species",
                    "Taken from at least 15 feet away"
                ],
                safety_notes=[
                    "Do not approach or distress active nests",
                    "Do not bait wild animals"
                ],
                xp_reward=50,
                source_type="curated",
                image_url="https://images.unsplash.com/photo-1444464666168-49d633b86797?auto=format&fit=crop&w=800&q=80"
            ),
        ]
        db.add_all(quests)

    # Seed Challenges if empty
    if db.query(Challenge).count() == 0:
        challenges = [
            Challenge(
                title="Spring Awakening: 3-Quest Explorer",
                description="Complete any 3 outdoor nature quests this week to earn the weekly botanical bonus.",
                challenge_type="weekly",
                target_quests_count=3,
                xp_bonus=100,
                start_date=datetime.utcnow() - timedelta(days=1),
                end_date=datetime.utcnow() + timedelta(days=6)
            ),
            Challenge(
                title="Daily 10-Minute Green Break",
                description="Disconnect from all digital screens for at least 10 minutes and complete 1 quick outdoor quest today.",
                challenge_type="daily",
                target_quests_count=1,
                xp_bonus=30,
                start_date=datetime.utcnow(),
                end_date=datetime.utcnow() + timedelta(days=1)
            ),
        ]
        db.add_all(challenges)

    db.commit()
