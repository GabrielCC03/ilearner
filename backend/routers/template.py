from fastapi import APIRouter

router = APIRouter(prefix="/template", tags=["template"])

@router.get("/ping")
async def ping():
    return {"ping": "TODO:\n1. Setup Backend Structure\n2. Setup dockerfiles"}

@router.get("/template", tags=["template"])
async def read_template():
    return {"template": "template"}

@router.post("/template/create", tags=["template"])
async def create_template():
    return {"template": "template"}

@router.patch("/template/update", tags=["template"])
async def update_template():
    return {"template": "template"}

@router.delete("/template/delete", tags=["template"])
async def delete_template():
    return {"template": "template"}