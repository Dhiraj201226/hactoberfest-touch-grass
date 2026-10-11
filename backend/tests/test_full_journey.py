import pytest
import io
from fastapi.testclient import TestClient
from PIL import Image
from app.main import app

client = TestClient(app)

def create_test_image_bytes():
    import random
    file = io.BytesIO()
    # Random color to ensure unique sha256 across test runs
    color = (random.randint(10, 50), random.randint(100, 200), random.randint(10, 50))
    image = Image.new("RGB", (300, 300), color=color)
    image.save(file, "JPEG")
    file.seek(0)
    return file

def test_full_user_journey_and_verification():
    import uuid
    uid = str(uuid.uuid4())[:8]
    # 1. Register new user
    reg_res = client.post("/api/v1/auth/register", json={
        "username": f"ranger_{uid}",
        "email": f"sam_{uid}@naturequest.app",
        "password": "strongPassword123",
        "display_name": "Ranger Sam"
    })
    assert reg_res.status_code == 200
    token = reg_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Complete onboarding
    onboard_res = client.post("/api/v1/users/me/onboarding", json={"categories": ["plants"]}, headers=headers)
    assert onboard_res.status_code == 200

    # 3. Retrieve available quests
    quests_res = client.get("/api/v1/quests", headers=headers)
    assert quests_res.status_code == 200
    quests = quests_res.json()
    assert len(quests) > 0
    quest_id = quests[0]["id"]
    expected_xp = quests[0]["xp_reward"]

    # 4. Start quest attempt
    start_res = client.post(f"/api/v1/quests/{quest_id}/start", headers=headers)
    assert start_res.status_code == 200
    attempt_id = start_res.json()["id"]

    # 5. Submit photographic evidence
    img_bytes = create_test_image_bytes()
    submit_res = client.post(
        "/api/v1/submissions",
        data={
            "quest_attempt_id": attempt_id,
            "description": "Found a crisp green leaf with deep veining in our neighborhood grove."
        },
        files={"file": ("leaf.jpg", img_bytes, "image/jpeg")},
        headers=headers
    )
    assert submit_res.status_code == 200
    submission = submit_res.json()
    assert submission["status"] == "APPROVED"
    assert submission["verification"]["result_status"] == "APPROVED"

    # 6. Verify XP transaction exactly once & no duplicate awards
    stats_res = client.get("/api/v1/users/me/stats", headers=headers)
    assert stats_res.status_code == 200
    stats = stats_res.json()
    assert stats["total_xp"] >= expected_xp
    assert stats["verified_quests"] == 1

    # 7. Test Anti-Abuse: Duplicate upload protection
    img_bytes.seek(0)
    dup_res = client.post(
        "/api/v1/submissions",
        data={
            "quest_attempt_id": attempt_id,
            "description": "Attempting to submit identical image again."
        },
        files={"file": ("duplicate_leaf.jpg", img_bytes, "image/jpeg")},
        headers=headers
    )
    # Must reject duplicate file hash
    assert dup_res.status_code == 400
    assert "Duplicate evidence detected" in dup_res.json()["detail"]

    # 8. Check Leaderboard
    leader_res = client.get("/api/v1/leaderboard")
    assert leader_res.status_code == 200
    leaders = leader_res.json()
    assert any(u["username"] == "ranger_sam" for u in leaders)
