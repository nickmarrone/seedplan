from sqlalchemy import Column, Integer, String, ForeignKey, Date, Boolean, Text, Enum
from sqlalchemy.orm import relationship
from database import Base
import enum

class PlantingType(str, enum.Enum):
    DIRECT_SEED = "direct_seed"
    TRANSPLANT = "transplant"

class Seed(Base):
    __tablename__ = "seeds"

    id = Column(Integer, primary_key=True, index=True)
    plant_type = Column(String, nullable=False)
    name = Column(String, nullable=False)
    days_to_maturity = Column(Integer, nullable=False)
    company = Column(String)
    planting_type = Column(Enum(PlantingType), nullable=False)
    weeks_before_frost = Column(Integer)  # For transplants
    weeks_after_frost = Column(Integer)   # For direct seed
    seed_spacing = Column(Text)
    seed_notes = Column(Text)
    color = Column(String)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)  # Null for system varieties
    created_at = Column(Date, nullable=False)
    updated_at = Column(Date)

    # Relationships
    user = relationship("User", back_populates="seeds")
    tasks = relationship("Task", back_populates="seed")

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    seed_id = Column(Integer, ForeignKey("seeds.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    task_type = Column(String, nullable=False)  # e.g., "bed_prep", "seed", "harvest"
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    notes = Column(Text)
    created_at = Column(Date, nullable=False)
    updated_at = Column(Date)

    # Relationships
    seed = relationship("Seed", back_populates="tasks")
    user = relationship("User", back_populates="tasks")

# Update User model to include relationships
User.seeds = relationship("Seed", back_populates="user")
User.tasks = relationship("Task", back_populates="user") 