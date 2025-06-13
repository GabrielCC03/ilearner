from pydantic import BaseModel
from datetime import datetime

class LearningSpace(BaseModel):
    id: str
    name: str
    createdAt: datetime
    updatedAt: datetime
    fileCount: int
    