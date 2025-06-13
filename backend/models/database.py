from pydantic import BaseModel
from datetime import datetime

class LearningSpace(BaseModel):
    name: str
    description: str
    createdAt: datetime
    updatedAt: datetime
    fileCount: int
    