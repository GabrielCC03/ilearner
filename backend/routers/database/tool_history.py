from fastapi import APIRouter, HTTPException, status
from typing import List, Dict, Any, Optional
from models.database import ToolHistory
from internal.database.tool_history import (
    create_tool_history,
    get_tool_history,
    update_tool_history,
    update_tool_data,
    get_tool_history_by_learning_space
)

router = APIRouter(prefix="/database/tool-history", tags=["tool-history"])

@router.post("/", response_model=ToolHistory, status_code=status.HTTP_201_CREATED)
async def create_tool_history_endpoint(learning_space_id: str, tool_type: str, tool_data: Optional[Dict[str, Any]] = None):
    """
    Create a new tool history entry
    """
    try:
        tool_history = await create_tool_history(learning_space_id, tool_type, tool_data)
        return tool_history
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create tool history: {str(e)}"
        )

@router.get("/{tool_history_id}", response_model=ToolHistory)
async def get_tool_history_endpoint(tool_history_id: str):
    """
    Get a tool history entry by ID
    """
    try:
        tool_history = await get_tool_history(tool_history_id)
        if not tool_history:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Tool history not found"
            )
        return tool_history
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve tool history: {str(e)}"
        )

@router.patch("/{tool_history_id}", response_model=ToolHistory)
async def update_tool_history_endpoint(tool_history_id: str, update_data: Dict[str, Any]):
    """
    Update a tool history entry
    """
    try:
        tool_history = await update_tool_history(tool_history_id, update_data)
        if not tool_history:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Tool history not found"
            )
        return tool_history
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update tool history: {str(e)}"
        )

@router.patch("/{tool_history_id}/tool-data", response_model=ToolHistory)
async def update_tool_data_endpoint(tool_history_id: str, tool_data_updates: Dict[str, Any]):
    """
    Update specific fields in toolData
    """
    try:
        tool_history = await update_tool_data(tool_history_id, tool_data_updates)
        if not tool_history:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Tool history not found"
            )
        return tool_history
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update tool data: {str(e)}"
        )

@router.get("/learning-space/{learning_space_id}", response_model=List[ToolHistory])
async def get_tool_history_by_learning_space_endpoint(learning_space_id: str):
    """
    Get all tool history entries for a learning space
    """
    try:
        tool_histories = await get_tool_history_by_learning_space(learning_space_id)
        return tool_histories
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve tool histories: {str(e)}"
        )
