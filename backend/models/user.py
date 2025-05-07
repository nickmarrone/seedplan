from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    full_name = Column(String)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Gardening preferences
    gardening_zone = Column(String)
    zipcode = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    last_frost_date = Column(String)  # MM-DD format
    first_frost_date = Column(String)  # MM-DD format 