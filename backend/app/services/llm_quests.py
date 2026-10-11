import httpx
import json
from typing import Dict, Any, Optional
from app.core.config import settings

class QuestGeneratorService:
    def __init__(self):
        self.ollama_url = settings.OLLAMA_BASE_URL
        self.model = "qwen2.5:1.5b"

    async def generate_quest(self, category: str, difficulty: str = "easy") -> Dict[str, Any]:
        """
        Prompts Ollama open-weight LLM (Qwen 2.5: 1.5B, Apache 2.0 license).
        If offline or timed out, gracefully falls back to curated catalog with transparency.
        """
        prompt = (
            f"Return a JSON object for an outdoor nature quest for category '{category}' and difficulty '{difficulty}'. "
            f"Fields required: "
            f"title (string), description (string), instructions (list of strings)."
        )
        try:
            async with httpx.AsyncClient(timeout=45.0) as client:
                res = await client.post(
                    f"{self.ollama_url}/api/generate",
                    json={
                        "model": self.model,
                        "prompt": prompt,
                        "stream": False,
                        "format": "json"
                    }
                )
                if res.status_code == 200:
                    data = res.json()
                    response_text = data.get("response", "{}")
                    parsed = json.loads(response_text)
                    if "title" in parsed and "instructions" in parsed:
                        # Enforce server-controlled XP, safety, and source type
                        parsed["category"] = category
                        parsed["difficulty"] = difficulty
                        parsed["duration_minutes"] = parsed.get("duration_minutes", 15)
                        parsed["xp_reward"] = 20 if difficulty == "easy" else (35 if difficulty == "medium" else 50)
                        parsed["source_type"] = f"ai_generated_{self.model}"
                        parsed["evidence_type"] = "photo"
                        parsed["completion_criteria"] = parsed.get("completion_criteria", [
                            "Submit one clear photograph matching the mission instructions",
                            "Record one natural observation note"
                        ])
                        parsed["safety_notes"] = parsed.get("safety_notes", [
                            "Stay on designated trails and respect private property",
                            "Do not pick rare living plants or disturb active wildlife nests"
                        ])
                        return parsed
        except Exception as e:
            print(f"Ollama generation fallback note: {e}")

        # Clean fallback to curated catalog
        return self._get_fallback_quest(category, difficulty)

    def _get_fallback_quest(self, category: str, difficulty: str) -> Dict[str, Any]:
        xp = 20 if difficulty == "easy" else (35 if difficulty == "medium" else 50)
        fallbacks = {
            "plants": {
                "title": "Vein Architecture Explorer",
                "category": "plants",
                "difficulty": difficulty,
                "duration_minutes": 15,
                "description": "Find three fallen leaves with contrasting vein structures and capture an extreme close-up.",
                "instructions": [
                    "Walk into a park, garden, or quiet wooded spot.",
                    "Look for fallen leaves showing parallel vs reticulate venation.",
                    "Photograph one leaf backlit by daylight."
                ],
                "completion_criteria": [
                    "Photograph must clearly display leaf vein network",
                    "Do not strip living leaves off rare plants"
                ],
                "safety_notes": [
                    "Avoid handling poison ivy or stinging nettles.",
                    "Stay on public trails."
                ],
                "evidence_type": "photo",
                "xp_reward": xp,
                "source_type": "curated"
            },
            "birds": {
                "title": "Canopy Song Tracker",
                "category": "birds",
                "difficulty": difficulty,
                "duration_minutes": 20,
                "description": "Listen for bird vocalizations in local treetops and document perched wildlife.",
                "instructions": [
                    "Find a quiet bench or clearing near trees.",
                    "Sit motionless for 5 minutes and listen attentively.",
                    "Take a photo of a perched bird or nesting cavity."
                ],
                "completion_criteria": [
                    "Photograph of a wild bird without disturbing its nest",
                    "Maintain at least 15 feet distance"
                ],
                "safety_notes": [
                    "Never throw objects to provoke flight.",
                    "Keep noise to a minimum."
                ],
                "evidence_type": "photo",
                "xp_reward": xp,
                "source_type": "curated"
            },
            "trees": {
                "title": "Bark Texture Cartographer",
                "category": "trees",
                "difficulty": difficulty,
                "duration_minutes": 15,
                "description": "Examine tree bark patterns (furrowed, scaly, or smooth) and capture natural moss or lichen growing upon it.",
                "instructions": [
                    "Find two mature trees of different species.",
                    "Gently feel the bark ridges with your hand.",
                    "Photograph a patch of symbiotic lichen or bark texture."
                ],
                "completion_criteria": [
                    "High-contrast texture photo of mature tree bark",
                    "Visible bark ridges or lichen colony"
                ],
                "safety_notes": [
                    "Watch out for clinging insects or thorns.",
                    "Do not carve or damage the tree trunk."
                ],
                "evidence_type": "photo",
                "xp_reward": xp,
                "source_type": "curated"
            }
        }
        return fallbacks.get(category, fallbacks["plants"])

quest_generator = QuestGeneratorService()
