import sys
import os
from sqlalchemy import create_engine, text
sys.path.append(os.getcwd())
from backend.database import SQLALCHEMY_DATABASE_URL

def force_reset():
    engine = create_engine(SQLALCHEMY_DATABASE_URL)
    with engine.connect() as conn:
        print("Dropping tables if they exist...")
        conn.execute(text("DROP TABLE IF EXISTS comments CASCADE;"))
        conn.execute(text("DROP TABLE IF EXISTS complaints CASCADE;"))
        conn.commit()
        print("Tables dropped.")
        
    # Re-run the standard sync
    from backend.database import Base
    from backend import models
    Base.metadata.create_all(bind=engine)
    print("Database recreated successfully with 'media_url' column.")

if __name__ == "__main__":
    force_reset()
