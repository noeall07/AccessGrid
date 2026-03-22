<p align="center">
  <h1 align="center">🚗 AccessGrid</h1>
  <p align="center"><strong>Intelligent Campus Vehicle Entry-Exit Management System with ANPR</strong></p>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Flask-3.x-000000?logo=flask&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/YOLOv8-Ultralytics-FF6F00?logo=darkreader&logoColor=white" />
  <img src="https://img.shields.io/badge/Tesseract-OCR-3DDC84?logo=google&logoColor=white" />
</p>

---

## 📖 About

**AccessGrid** is a full-stack campus vehicle management system that automates gate entry and exit using **Automatic Number Plate Recognition (ANPR)**. It combines a custom-trained YOLOv8 object detection model with Tesseract OCR to detect and read license plates from vehicle images in real time.

The system features role-based dashboards for **Admins**, **Security personnel**, and **Students**, giving each user a tailored experience for managing vehicles, monitoring gate activity, and viewing parking analytics.

---

## ✨ Features

### 🔍 ANPR — Automatic Number Plate Recognition
- **YOLOv8-based plate detection** — custom-trained on a dedicated license plate dataset
- **Tesseract OCR** — extracts text from detected plate regions
- **Smart post-processing** — position-aware character correction for Indian-format plates (e.g., `KA01AB1234`)
- **Image pre-processing pipeline** — resize, grayscale, bilateral filter, binary threshold, morphological closing
- **Integrated into backend** — exposed as a REST API endpoint for the security dashboard

### 🛡️ Role-Based Dashboards
| Role | Capabilities |
|------|-------------|
| **Admin** | Register vehicles, manage parking zones, view analytics & statistics, dark/light theme |
| **Security** | Scan plates via ANPR or manual entry, allow/deny entry/exit, real-time gate logs |
| **Student** | View personal vehicle status, entry/exit history, campus parking map |

### 🏗️ System Highlights
- JWT-based authentication with role-based access control
- Real-time activity feed for gate events
- Parking zone management with capacity tracking
- Dark / Light theme toggle
- One-click setup & launch scripts (`.bat` files)
- PWA support via Vite PWA plugin

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite 7, Axios |
| **Backend** | Python, Flask, Flask-SQLAlchemy, Flask-Login |
| **Database** | PostgreSQL |
| **ANPR Model** | YOLOv8 (Ultralytics), OpenCV, Tesseract OCR |
| **Auth** | JWT (PyJWT), Werkzeug password hashing |

---

## 📂 Project Structure

```
AccessGrid/
├── frontend/               # React + Vite frontend
│   └── src/
│       ├── components/     # Dashboard, Login, Sidebar, VehicleTable, etc.
│       └── api/            # Axios API service
├── backend/                # Flask REST API
│   ├── app/
│   │   ├── routes/         # auth, gate, vehicles, parking, stats, anpr_routes
│   │   ├── anpr/           # ANPR detector module + trained YOLOv8 weights (best.pt)
│   │   ├── models.py       # SQLAlchemy models (User, Vehicle, ParkingZone, EntryLog)
│   │   └── utils/          # Helper utilities
│   ├── seed.py             # Database seeder with demo data
│   └── config.py           # App configuration
├── anpr/                   # Standalone ANPR pipeline (training & testing)
│   ├── anpr_pipeline.py    # Detection + OCR pipeline script
│   ├── dataset/            # Training & test images
│   └── runs/               # YOLOv8 training runs & weights
├── setup.bat               # One-click project setup
└── start.bat               # One-click project launch
```

---

## 📋 Prerequisites

| Requirement | Version |
|------------|---------|
| **Python** | 3.9+ |
| **Node.js** | 18+ |
| **PostgreSQL** | Installed & running |
| **Tesseract OCR** | Installed at `C:\Program Files\Tesseract-OCR\` |

---

## 🚀 Quick Setup

### Option 1 — One-Click Setup

1. Open `backend/.env` and set your PostgreSQL password:
   ```
   DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost/accessgrid
   ```
2. Double-click **`setup.bat`** — it will:
   - Create the `accessgrid` database
   - Set up the Python virtual environment & install dependencies
   - Seed the database with demo data
   - Install frontend dependencies

### Option 2 — Manual Setup

1. **Create the database** in pgAdmin:
   - Right-click Databases → Create → name it `accessgrid`

2. **Update database credentials** in `backend/.env`:
   ```
   DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost/accessgrid
   ```

3. **Backend**:
   ```bash
   cd backend
   python -m venv venv
   venv\Scripts\activate
   pip install -r requirements.txt
   python seed.py
   ```

4. **Frontend**:
   ```bash
   cd frontend
   npm install
   ```

---

## ▶️ Running the App

### Option 1 — Double-click `start.bat`

### Option 2 — Manual

**Terminal 1 — Backend:**
```bash
cd backend
venv\Scripts\activate
python run.py
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## 🔐 Demo Credentials

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `admin123` |
| Security | `security` | `security123` |
| Student | `student` | `student123` |

---

## 🧠 ANPR Pipeline — How It Works

```
Vehicle Image
      │
      ▼
┌─────────────┐
│  YOLOv8     │  ← Custom-trained on license plate dataset
│  Detection  │
└──────┬──────┘
       │  Bounding box coordinates
       ▼
┌─────────────┐
│  Crop &     │  ← Resize (4×), grayscale, bilateral filter
│  Preprocess │     threshold, morphological closing
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Tesseract  │  ← PSM 7, whitelisted A-Z 0-9
│  OCR        │
└──────┬──────┘
       │  Raw text
       ▼
┌─────────────┐
│  Smart      │  ← Position-aware corrections
│  Cleanup    │     (state code, district, series, number)
└──────┬──────┘
       │
       ▼
   Plate Number  →  e.g. "KA01AB1234"
```

### Training

The YOLOv8 model was trained on a custom license plate dataset. The dataset and trained weights are available:

- **Dataset**: [Kaggle — Number Plates](https://www.kaggle.com/datasets/nooeell07/number-plates)
- **Trained weights**: `anpr/runs/detect/train/weights/best.pt` (standalone) and `backend/app/anpr/best.pt` (backend-integrated)

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/login` | User login |
| `GET` | `/api/auth/me` | Get current user |
| `GET` | `/api/vehicles/` | List all vehicles |
| `POST` | `/api/vehicles/` | Register a new vehicle |
| `POST` | `/api/gate/entry` | Record vehicle entry |
| `POST` | `/api/gate/exit` | Record vehicle exit |
| `GET` | `/api/gate/logs` | Get entry/exit logs |
| `GET` | `/api/parking/zones` | Get parking zone data |
| `GET` | `/api/stats/` | Dashboard statistics |
| `POST` | `/api/anpr/detect` | Detect plate from uploaded image |

---

## 📊 Database Schema

```mermaid
erDiagram
    User ||--o{ Vehicle : owns
    Vehicle ||--o{ EntryLog : has

    User {
        int id PK
        string username
        string password_hash
        string role
        string name
        string department
        string student_id
    }

    Vehicle {
        int id PK
        string plate_number
        string type
        string owner_name
        int owner_id FK
        string department
        string status
        boolean is_inside
    }

    ParkingZone {
        string id PK
        string name
        string label
        int capacity
        int occupied_count
        boolean is_restricted
        string color
    }

    EntryLog {
        int id PK
        int vehicle_id FK
        datetime timestamp
        string action
        string gate_name
        string image_path
        boolean manual_entry
    }
```