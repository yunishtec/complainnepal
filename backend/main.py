from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routes import complaints

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="ComplaineNepal API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(complaints.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to ComplaineNepal API"}
