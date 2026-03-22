# AccessGrid Backend Setup

## Prerequisites
1.  **Python** (3.8 or higher) must be installed and added to PATH.
2.  **PostgreSQL** should be running.
3.  **Tesseract OCR** must be installed for License Plate Recognition to work.
    -   Download from: https://github.com/UB-Mannheim/tesseract/wiki
    -   Update the path in `backend/app/utils/ocr.py` if it's not in `C:\Program Files\Tesseract-OCR\tesseract.exe`.

## Configuration
1.  Creates a `.env` file in the `backend` folder if you want to configure specific settings:
    ```
    DATABASE_URL=postgresql://postgres:password@localhost/accessgrid
    SECRET_KEY=your-secret-key
    ```
    *If no .env is provided, it defaults to a local SQLite database for easy testing (`accessgrid.db`).*

## Running
1.  Run `setup_backend.bat` first (once) to install dependencies and set up the database.
    -   Note: This will perform database migrations.
2.  Run `run_server.bat` to start the Flask API.
    -   The server will run at `http://localhost:5000`.

## API Endpoints
-   Auth: `POST /api/auth/login`
-   Vehicles: `GET /api/vehicles`
-   Gate: `POST /api/gate/scan` (Upload image key 'image')
