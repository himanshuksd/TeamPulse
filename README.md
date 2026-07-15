# TeamPulse 🚀

AI-powered team collaboration and productivity platform with real-time insights, task tracking, and risk detection.

## Overview

TeamPulse helps teams manage projects and tasks while surfacing performance insights automatically — tracking completion rates, flagging at-risk projects, and predicting task delays using a lightweight ML layer.

## Features

- **Authentication** — Email/password (Argon2 hashing) and Google OAuth login, JWT-based sessions
- **Teams & Roles** — Create teams, invite members via shareable links, admin/member role-based access control (RBAC)
- **Project & Task Management** — Create projects, assign tasks, track status (To Do / In Progress / Done), deadlines
- **Real-Time Team Chat** — WebSocket-based live messaging per team, with typing indicators and persisted history
- **Gamification** — Points, levels, and streaks for completed tasks to drive engagement
- **Analytics Dashboard** — Team completion rate, overdue rate, and a computed Team Performance Index (TPI)
- **Risk Detection** — Automatic risk-level classification (Low / Moderate / High) based on team task performance
- **ML-Powered Insights** — Task delay prediction, productivity forecasting, and assignee recommendation engine
- **Notifications** — Real-time alerts for task assignments and completions

## Tech Stack

- **Frontend:** React.js (Vite), Tailwind CSS
- **Backend:** FastAPI (Python)
- **Database:** MySQL, SQLAlchemy ORM
- **Auth:** JWT, Argon2 password hashing, Google OAuth2
- **Real-Time:** WebSockets (chat, live updates)
- **Deployment:** Vercel (frontend), Render (backend), GitHub Actions (CI/CD)

## Live Demo

- **Frontend:** https://vitefrontend.vercel.app/
- **Backend API:** https://himanshuksd-teampulse.onrender.com

## Project Structure

\`\`\`
TeamPulse/
├── backend/              # FastAPI app entry, routes
├── vitefrontend/          # React + Vite frontend
├── services/              # Analytics engine, ML models
├── models.py               # SQLAlchemy models
├── schemas.py               # Pydantic request/response schemas
├── database.py               # DB connection setup
├── websocket_manager.py       # WebSocket connection manager
\`\`\`

## Getting Started

### Backend
\`\`\`bash
pip install -r requirements.txt

# create a .env file with:
# DATABASE_URL=mysql+pymysql://user:password@host/dbname
# SECRET_KEY=your-secret-key

uvicorn main:app --reload
\`\`\`

### Frontend
\`\`\`bash
cd vitefrontend
npm install
npm run dev
\`\`\`

## API Highlights

- \`POST /register\`, \`POST /login\`, \`POST /auth/google\` — auth
- \`POST /teams\`, \`POST /teams/{id}/invite\`, \`POST /teams/join/{token}\` — team management
- \`POST /projects\`, \`POST /tasks\`, \`PUT /tasks/{id}/complete\` — project/task workflow
- \`GET /dashboard/{team_id}\` — aggregated team analytics, risk level, leaderboard
- \`WS /ws/chat/{team_id}\` — real-time team chat
