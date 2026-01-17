# ISAVS - Intelligent Student Attendance Verification System

A secure, tamper-resistant student attendance system using **Three-Factor Verification**:
- 🔐 **Face Recognition** (with liveness detection)
- 🆔 **Student ID Validation**
- 📱 **Time-bound OTP** (60-second TTL, per-student unique codes)

## Features

- **Privacy-First**: Only stores 128-d facial embeddings, never raw images
- **Anti-Proxy Detection**: Detects when face doesn't match claimed ID
- **Identity Mismatch Alerts**: Logs when OTP is correct but face similarity < 0.6
- **Three-Strike Policy**: Locks session after 3 failed attempts
- **Real-time Dashboard**: Faculty can monitor attendance and anomalies
- **Supabase Ready**: Configured for Supabase PostgreSQL

## Tech Stack

**Backend**: FastAPI, SQLAlchemy, asyncpg, OpenCV, MediaPipe  
**Frontend**: React, TypeScript, Tailwind CSS, Vite  
**Database**: Supabase (PostgreSQL)  
**Cache**: In-memory (Redis optional)

---

## Quick Start

### 1. Set Up Supabase Database

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the schema from `backend/app/db/schema.sql`
3. Get your connection string from **Settings > Database > Connection string** (use Transaction pooler)

### 2. Configure Backend

```bash
cd backend

# Copy and edit environment file
copy .env.example .env

# Edit .env with your Supabase connection string:
# DATABASE_URL=postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

### 3. Install Dependencies

**Backend:**
```bash
cd backend
pip install fastapi uvicorn python-multipart sqlalchemy asyncpg aiosqlite pydantic pydantic-settings numpy Pillow redis pytest pytest-asyncio hypothesis httpx python-dotenv opencv-python
```

**Frontend:**
```bash
cd frontend
npm install
```

### 4. Run the Application

**Start Backend (Terminal 1):**
```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Start Frontend (Terminal 2):**
```bash
cd frontend
npm run dev
```

### 5. Access the Application

- **Frontend**: http://localhost:5173 (or http://localhost:3000)
- **Backend API Docs**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

---

## Usage Flow

### For Faculty:
1. Open **Faculty Dashboard** at `/dashboard`
2. Enter a Class ID and click **Start Session & Generate OTPs**
3. Share the Session ID with students
4. Monitor real-time attendance and anomalies

### For Students:
1. Open **Student Kiosk** at `/kiosk?session={SESSION_ID}`
2. Enter your Student ID
3. Enter the 4-digit OTP (30-second countdown)
4. Look at the camera for face verification
5. Click **Verify Attendance**

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/enroll` | Enroll new student with face |
| POST | `/api/v1/session/start/{class_id}` | Start attendance session |
| POST | `/api/v1/verify` | Three-factor verification |
| POST | `/api/v1/otp/resend` | Resend OTP (max 2 times) |
| GET | `/api/v1/reports` | Get attendance reports |
| GET | `/api/v1/students` | List enrolled students |

---

## Project Structure

```
├── backend/
│   ├── app/
│   │   ├── api/endpoints.py      # REST API routes
│   │   ├── services/             # Business logic
│   │   │   ├── face_recognition_service.py
│   │   │   ├── liveness_service.py
│   │   │   ├── otp_service.py
│   │   │   ├── anomaly_service.py
│   │   │   ├── verification_pipeline.py
│   │   │   └── report_service.py
│   │   ├── db/                   # Database models & schema
│   │   └── models/               # Pydantic schemas
│   ├── tests/                    # Property-based tests
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/           # React components
│   │   │   ├── KioskView.tsx
│   │   │   ├── FacultyDashboard.tsx
│   │   │   ├── WebcamCapture.tsx
│   │   │   ├── CountdownTimer.tsx
│   │   │   └── OTPInput.tsx
│   │   └── services/api.ts       # API client
│   └── package.json
└── README.md
```

---

## Configuration

Key settings in `backend/.env`:

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | - | Supabase PostgreSQL connection string |
| `OTP_TTL_SECONDS` | 60 | OTP expiration time |
| `OTP_MAX_RESEND_ATTEMPTS` | 2 | Max OTP resends per session |
| `FACE_SIMILARITY_THRESHOLD` | 0.6 | Face match threshold |
| `MAX_CONSECUTIVE_FAILURES` | 3 | Strikes before session lock |

---

## License

MIT
