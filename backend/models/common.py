from pydantic import BaseModel

class OpenRouterRequest(BaseModel):
    model: str
    message: str 