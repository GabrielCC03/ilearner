from fastapi import APIRouter
from internal import common
import json

router = APIRouter(prefix="/common", tags=["common"])

@router.post("/openrouter")
async def openrouter(model: str, message: str):

    responseJson = common.open_router_api(model, message)
    response = responseJson['choices'][0]['message']['content']

    return response