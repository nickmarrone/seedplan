from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from database import Base
import enum

class PlantingType(str, enum.Enum):
    DIRECT_SEED = "direct_seed"
    TRANSPLANT = "transplant"

class Seed(Base):
    __tablename__ = "seeds"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String, nullable=False)
    plant_type = Column(String, nullable=False)
    days_to_maturity = Column(Integer, nullable=False)
    company = Column(String)
    planting_type = Column(String, nullable=False)
    weeks_before_frost = Column(Integer)
    weeks_after_frost = Column(Integer)
    seed_spacing = Column(String)
    seed_notes = Column(String)
    color = Column(String)
    created_at = Column(DateTime)
    updated_at = Column(DateTime)

    user = relationship("User", back_populates="seeds")
    tasks = relationship("Task", back_populates="seed") 