from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float, Date
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    full_name = Column(String)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(Date)
    updated_at = Column(Date)
    
    # Gardening preferences
    gardening_zone = Column(String)
    zipcode = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    last_frost_date = Column(String)  # MM-DD format
    first_frost_date = Column(String)  # MM-DD format

    # Relationships
    seeds = relationship("Seed", back_populates="user")
    tasks = relationship("Task", back_populates="user") 