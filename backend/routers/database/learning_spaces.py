from fastapi import APIRouter, HTTPException, status
from typing import List
from models.database import LearningSpace
from internal.database.learning_spaces import (
    create_learning_space,
    get_learning_space,
    get_all_learning_spaces,
    update_learning_space,
    delete_learning_space
)

router = APIRouter(prefix="/database/learning-spaces", tags=["learning-spaces"])

@router.post("/", response_model=LearningSpace, status_code=status.HTTP_201_CREATED)
async def create_learning_space_endpoint(name: str):
    '''
    Create a new learning space
    '''
    try:
        learning_space = await create_learning_space(name)
        return learning_space
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create learning space: {str(e)}"
        )

@router.get("/", response_model=List[LearningSpace])
async def get_all_learning_spaces_endpoint():
    '''
    Get all learning spaces
    '''
    try:
        learning_spaces = await get_all_learning_spaces()
        return learning_spaces
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve learning spaces: {str(e)}"
        )

@router.get("/{learning_space_id}", response_model=LearningSpace)
async def get_learning_space_endpoint(learning_space_id: str):
    '''
    Get a learning space by ID
    '''
    try:
        learning_space = await get_learning_space(learning_space_id)
        if not learning_space:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Learning space not found"
            )
        return learning_space
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve learning space: {str(e)}"
        )

@router.patch("/{learning_space_id}", response_model=LearningSpace)
async def update_learning_space_endpoint(learning_space_id: str, name: str = None):
    '''
    Update a learning space
    '''
    try:
        # Build update data
        update_data = {}
        if name is not None:
            update_data["name"] = name
        
        if not update_data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No update data provided"
            )
        
        learning_space = await update_learning_space(learning_space_id, update_data)
        if not learning_space:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Learning space not found"
            )
        return learning_space
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update learning space: {str(e)}"
        )

@router.delete("/{learning_space_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_learning_space_endpoint(learning_space_id: str):
    '''
    Delete a learning space
    '''
    try:
        deleted = await delete_learning_space(learning_space_id)
        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Learning space not found"
            )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete learning space: {str(e)}"
        ) 