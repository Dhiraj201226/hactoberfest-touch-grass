# NatureQuest AI — Explore More, Scroll Less

> **A production-grade, gamified outdoor exploration platform that rewards users for spending time in nature and documenting authentic discoveries while combating screen addiction.**

---

## 🌟 Core Product Vision & Philosophy

In an era saturated with endless algorithmic feeds and generative AI deepfakes, **NatureQuest AI** shifts focus from the virtual world to the living, physical world. 

**The Golden Rule:**
> *Inspect your mission, put your phone in your pocket, and explore the living outdoors.*

Users select real-world quests, step outside, record authentic photographs of their discoveries, and submit them to **NeuralEye™**—a multimodal media forensics pipeline that verifies camera sensor optical capture, detects diffusion artifacts, and enforces strict cryptographic duplicate protections.

---

## 🛠️ Tech Stack & Architecture

### Frontend
- **Framework:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS with custom editorial nature design tokens (`forest-800`, `forest-900`, `lime`, `ivory`)
- **Icons & Motion:** Lucide Icons, clean CSS micro-interactions
- **Routing & State:** React Router DOM v7, TanStack Query

### Backend
- **Framework:** Python FastAPI (REST API prefix `/api/v1`)
- **Database & Persistence:** SQLAlchemy ORM, SQLite for zero-config local development, Alembic/PostgreSQL-ready
- **Security:** JWT authentication (`python-jose`) with bcrypt password hashing (`passlib`)
- **Gamification Engine:** Server-authoritative, exactly-once transactional XP ledger with idempotency keys
- **Media Forensics:** NeuralEye Adapter (`Pillow`, `ImageHash`, perceptual dHash, and SHA-256 duplicate guards)
- **Local AI Quest Generation:** Ollama integration for local open-weight models (e.g. Qwen 2.5 / Gemma) with curated fallback catalogs

---

## 🚀 Quickstart Guide

### 1. Prerequisites
- **Node.js** (v18+) and **npm**
- **Python** (v3.10+)

### 2. Backend Setup
```bash
cd backend
# Create virtual environment if not already active
python -m venv venv
.\venv\Scripts\activate  # On Windows

# Install dependencies
pip install fastapi uvicorn sqlalchemy passlib[bcrypt] python-jose pillow imagehash email-validator requests httpx pytest "bcrypt<4.1"

# Start FastAPI server
$env:PYTHONPATH="."
uvicorn app.main:app --port 8000 --reload
```
The backend API docs will be live at `http://127.0.0.1:8000/api/v1/docs`.

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` (or the configured Vite port) in your browser.

---

## 🧪 Automated Testing

NatureQuest AI includes an automated end-to-end backend test suite testing registration, onboarding, quest starting, photographic evidence submission, NeuralEye forensics verification, server-authoritative XP transactions, and anti-abuse duplicate upload rejection:

```bash
cd backend
$env:PYTHONPATH="."
pytest tests/test_full_journey.py -v
```

---

## 🛡️ Privacy & Safety Guidelines
- **Zero continuous GPS tracking:** Quests are designed for any outdoor green space and do not log user coordinates.
- **Ethical Wildlife Observation:** Quests strictly enforce a minimum distance from wildlife and prohibit trespassing or harming flora.
