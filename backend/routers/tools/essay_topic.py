from fastapi import APIRouter, HTTPException, status
from typing import Dict, Any
from models.database import ToolHistory
from internal.database.tool_history import create_tool_history, update_tool_data, get_tool_history
from internal.database.files import get_files_by_learning_space
from internal.tools.essay_topic import generate_essay_instructions, generate_essay_feedback

router = APIRouter(prefix="/tools/essay-topic", tags=["essay-topic-tool"])

@router.post("/generate/{learning_space_id}")
async def generate_essay_topic(learning_space_id: str) -> Dict[str, Any]:
    """
    Step 1: Generate essay instructions when tool is clicked from learning space
    Creates a new tool history entry and generates topic, guidelines, and helping material
    """
    try:
        # Get files from learning space
        files = await get_files_by_learning_space(learning_space_id)
        
        if not files:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No files found in learning space. Please upload files before using the essay tool."
            )
        
        # Generate essay instructions using AI
        instructions = await generate_essay_instructions(learning_space_id, files)
        
        # Create tool history entry with initial data
        initial_tool_data = {
            "topic": instructions.get("topic", ""),
            "guidelines": instructions.get("guidelines", []),
            "helpingMaterial": instructions.get("helpingMaterial", []),
            "status": "instructions_generated"
        }
        
        tool_history = await create_tool_history(
            learning_space_id=learning_space_id,
            tool_type="essay",
            tool_data=initial_tool_data
        )
        
        return {
            "toolHistoryId": tool_history.id,
            "topic": instructions.get("topic", ""),
            "guidelines": instructions.get("guidelines", []),
            "helpingMaterial": instructions.get("helpingMaterial", [])
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate essay topic: {str(e)}"
        )

@router.post("/submit/{tool_history_id}")
async def submit_essay(tool_history_id: str, submission: str) -> Dict[str, Any]:
    """
    Step 2: Submit student essay and generate feedback
    Updates the tool history with the essay and generates comprehensive feedback
    """

    try:
        # Get existing tool history
        tool_history = await get_tool_history(tool_history_id)
        if not tool_history:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Tool history not found"
            )
        
        if tool_history.type != "essay":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid tool type for essay submission"
            )
        
        # Extract essay instructions from tool data
        tool_data = tool_history.toolData or {}
        essay_instructions = {
            "topic": tool_data.get("topic", ""),
            "guidelines": tool_data.get("guidelines", []),
            "helpingMaterial": tool_data.get("helpingMaterial", [])
        }
        
        # Generate feedback using AI
        feedback_result = await generate_essay_feedback(submission, essay_instructions)
        
        # Update tool history with essay and feedback
        tool_data_updates = {
            "response": submission,
            "feedback": {
                "score": feedback_result.get("score", 0),
                "strengths": feedback_result.get("strengths", []),
                "improvements": feedback_result.get("improvements", []),
                "detailedFeedback": feedback_result.get("detailedFeedback", "")
            },
            "rubric": feedback_result.get("rubric", []),
            "status": "completed"
        }
        
        # Update the tool history status to completed
        await update_tool_data(tool_history_id, tool_data_updates)
        
        return {
            "feedback": {
                "score": feedback_result.get("score", 0),
                "overallStrengths": feedback_result.get("strengths", []),
                "overallImprovements": feedback_result.get("improvements", []),
                "detailedFeedback": feedback_result.get("detailedFeedback", ""),
                "rubricScores": {
                    "understandingAccuracy": {
                        "score": feedback_result.get("rubric", [])[0].get("score", 0),
                        "maxScore": feedback_result.get("rubric", [])[0].get("maxScore", 0),
                        "feedback": feedback_result.get("rubric", [])[0].get("feedback", "")
                    },
                    "clarityOrganization": {
                        "score": feedback_result.get("rubric", [])[1].get("score", 0),
                        "maxScore": feedback_result.get("rubric", [])[1].get("maxScore", 0),
                        "feedback": feedback_result.get("rubric", [])[1].get("feedback", "")
                    },
                    "criticalThinking": {
                        "score": feedback_result.get("rubric", [])[2].get("score", 0),
                        "maxScore": feedback_result.get("rubric", [])[2].get("maxScore", 0),
                        "feedback": feedback_result.get("rubric", [])[2].get("feedback", "")
                    },
                    "languageGrammar": {
                        "score": feedback_result.get("rubric", [])[3].get("score", 0),
                        "maxScore": feedback_result.get("rubric", [])[3].get("maxScore", 0),
                        "feedback": feedback_result.get("rubric", [])[3].get("feedback", "")
                    }
                }
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to submit essay and generate feedback: {str(e)}"
        )

@router.get("/history/{tool_history_id}")
async def get_essay_history(tool_history_id: str) -> Dict[str, Any]:
    """
    Get essay tool history for reopening completed or in progress essays
    Used when user clicks on essay tool history from learning space
    """
    try:
        tool_history = await get_tool_history(tool_history_id)
        if not tool_history:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Tool history not found"
            )
        
        if tool_history.type != "essay":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid tool type"
            )
        
        tool_data = tool_history.toolData or {}
        
        # Prepare response data
        response_data = {
            "toolHistoryId": tool_history.id,
            "topic": tool_data.get("topic", ""),
            "guidelines": tool_data.get("guidelines", []),
            "helpingMaterial": tool_data.get("helpingMaterial", []),
            "status": tool_data.get("status", "active"),
            "studentEssay": tool_data.get("response", ""),
            "createdAt": tool_history.createdAt.isoformat(),
            "updatedAt": tool_history.updatedAt.isoformat()
        }
        
        # Add feedback if essay is completed
        if tool_data.get("feedback") and tool_data.get("rubric"):
            feedback_data = tool_data["feedback"]
            rubric_data = tool_data["rubric"]
            
            response_data["feedback"] = {
                "score": feedback_data.get("score", 0),
                "overallStrengths": feedback_data.get("strengths", []),
                "overallImprovements": feedback_data.get("improvements", []), 
                "detailedFeedback": feedback_data.get("detailedFeedback", ""),
                "rubricScores": {
                    "understandingAccuracy": {
                        "score": rubric_data[0].get("score", 0),
                        "maxScore": rubric_data[0].get("maxScore", 0),
                        "feedback": rubric_data[0].get("feedback", "")
                    },
                    "clarityOrganization": {
                        "score": rubric_data[1].get("score", 0),
                        "maxScore": rubric_data[1].get("maxScore", 0),
                        "feedback": rubric_data[1].get("feedback", "")
                    },
                    "criticalThinking": {
                        "score": rubric_data[2].get("score", 0),
                        "maxScore": rubric_data[2].get("maxScore", 0),
                        "feedback": rubric_data[2].get("feedback", "")
                    },
                    "languageGrammar": {
                        "score": rubric_data[3].get("score", 0),
                        "maxScore": rubric_data[3].get("maxScore", 0),
                        "feedback": rubric_data[3].get("feedback", "")
                    }
                }
            }
        
        return response_data
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve essay history: {str(e)}"
        )
