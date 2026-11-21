# ClassTracker - Backend

Backend API for the ClassTracker application, built using Python and FastAPI.

## Tech Stack
- Python
- FastAPI
- PostgreSQL
- SQLAlchemy (if used)
- Uvicorn

## Features
- REST API endpoints
- Student and class management
- Database integration
- Backend business logic
- API validation

## Installation

Clone the repository:

```bash
git clone YOUR_REPOSITORY_URL
```

Navigate to the backend folder:

```bash
cd ClassTracker-backend
```

Create virtual environment:

```bash
python -m venv venv
```

Activate on Windows:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run the application:

```bash
uvicorn main:app --reload
```

API documentation:

```text
http://127.0.0.1:8000/docs
```

## Environment Variables

Create a `.env` file containing the required database connection and application configuration.

Never commit secrets or credentials to GitHub.
