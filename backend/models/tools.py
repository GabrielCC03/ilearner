from pydantic import BaseModel
from typing import Optional, List

class RubricCriteria(BaseModel):
    name: str
    score: int
    maxScore: int
    feedback: str

class EssayFeedback(BaseModel):
    score: int  # 0-100
    strengths: List[str]
    improvements: List[str]
    detailedFeedback: str

class EssayToolData(BaseModel):
    """Essay-specific tool data"""
    prompt: Optional[str] = None
    topic: Optional[str] = None
    guidelines: Optional[List[str]] = None
    helpingMaterial: Optional[List[str]] = None
    response: Optional[str] = None  # Student's essay
    feedback: Optional[EssayFeedback] = None
    rubric: Optional[List[RubricCriteria]] = None