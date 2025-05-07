# SeedPlan

SeedPlan is a garden planning application that helps users manage their seed starting and garden tasks.

## Features

- User authentication
- Dashboard with garden planning tools
- Calendar for tracking planting dates
- Plant management system

## Tech Stack

### Backend
- Python 3.11
- FastAPI
- PostgreSQL
- SQLAlchemy
- JWT Authentication

### Frontend
- React with TypeScript
- Material-UI
- React Router
- Axios

## Setup Instructions

### Backend Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up PostgreSQL database:
```bash
createdb seedplan
```

4. Create a `.env` file in the backend directory with the following content:
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/seedplan
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

5. Run the backend server:
```bash
cd backend
uvicorn main:app --reload
```

### Frontend Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Start the development server:
```bash
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

## Development

- Backend API documentation is available at `/docs` when running the server
- The frontend uses Material-UI for styling and components
- Authentication is handled using JWT tokens
- The database schema is managed using SQLAlchemy models 