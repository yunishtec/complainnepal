import sys
import os
from sqlalchemy import create_engine
# Add the current directory to path so we can import backend
sys.path.append(os.getcwd())

from backend.database import engine, Base
from backend import models

def reset_db():
    print("Connecting to Neon...")
    try:
        # Drop and recreate tables to ensure schema matches perfectly
        Base.metadata.drop_all(bind=engine)
        Base.metadata.create_all(bind=engine)
        print("Success! Database schema has been synced with Neon.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    reset_db()
