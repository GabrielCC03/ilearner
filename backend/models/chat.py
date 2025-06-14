from pydantic import BaseModel
from typing import Optional, List
from models.database import File

class ChatRequest(BaseModel):
    content: str
    learning_space_id: str
    model: str = "gpt-4o"
    tool_history_id: Optional[str] = None
    files: Optional[List[File]] = None