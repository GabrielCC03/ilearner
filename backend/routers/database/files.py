from fastapi import APIRouter, HTTPException, status, UploadFile, File as FastAPIFile
from fastapi.responses import StreamingResponse
from typing import List
import io
from models.database import File
from internal.database.files import (
    create_file,
    get_file,
    get_file_content,
    get_files_by_learning_space,
    delete_file
)

router = APIRouter(prefix="/database/files", tags=["files"])

@router.post("/upload/{learning_space_id}", response_model=File, status_code=status.HTTP_201_CREATED)
async def upload_file_endpoint(learning_space_id: str, file: UploadFile = FastAPIFile(...)):
    '''
    Upload a file to a learning space
    '''
    try:
        # Read file content
        content = await file.read()
        
        # Determine file type based on extension or mime type
        file_type = "text"  # default
        if file.content_type:
            if "pdf" in file.content_type:
                file_type = "pdf"
            elif "text" in file.content_type:
                file_type = "txt"
        elif file.filename:
            # Check file extension
            if file.filename.lower().endswith('.pdf'):
                file_type = "pdf"
            elif file.filename.lower().endswith(('.txt', '.md')):
                file_type = "txt"
        
        # Create file record with content
        new_file = await create_file(
            learning_space_id=learning_space_id,
            name=file.filename or "untitled",
            file_type=file_type,
            size=len(content),
            mime_type=file.content_type or "application/octet-stream",
            content=content
        )
        
        return new_file
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to upload file: {str(e)}"
        )

@router.get("/learning-space/{learning_space_id}", response_model=List[File])
async def get_files_for_learning_space_endpoint(learning_space_id: str):
    '''
    Get all files for a specific learning space (metadata only, no content)
    '''
    try:
        files = await get_files_by_learning_space(learning_space_id)
        return files
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve files: {str(e)}"
        )

@router.get("/{file_id}", response_model=File)
async def get_file_by_id_endpoint(file_id: str):
    '''
    Get file metadata by ID (no content)
    '''
    try:
        file = await get_file(file_id, include_content=False)
        if not file:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="File not found"
            )
        return file
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve file: {str(e)}"
        )

@router.get("/{file_id}/download")
async def download_file_endpoint(file_id: str):
    '''
    Download file content
    '''
    try:
        # Get file metadata
        file_metadata = await get_file(file_id, include_content=False)
        if not file_metadata:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="File not found"
            )
        
        # Get file content
        content = await get_file_content(file_id)
        if content is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="File content not found"
            )
        
        # Create streaming response
        file_stream = io.BytesIO(content)
        
        return StreamingResponse(
            io.BytesIO(content),
            media_type=file_metadata.mimeType,
            headers={
                "Content-Disposition": f"attachment; filename=\"{file_metadata.name}\""
            }
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to download file: {str(e)}"
        )

@router.get("/{file_id}/content")
async def get_file_content_text_endpoint(file_id: str):
    '''
    Get file content as text (for text files)
    '''
    try:
        # Get file metadata
        file_metadata = await get_file(file_id, include_content=False)
        if not file_metadata:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="File not found"
            )
        
        # Only allow text files
        if file_metadata.type not in ['txt', 'text']:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Content endpoint only supports text files"
            )
        
        # Get file content
        content = await get_file_content(file_id)
        if content is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="File content not found"
            )
        
        # Return as text
        try:
            text_content = content.decode('utf-8')
            return {"content": text_content}
        except UnicodeDecodeError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="File is not valid UTF-8 text"
            )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve file content: {str(e)}"
        )

@router.delete("/{file_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_file_by_id_endpoint(file_id: str):
    '''
    Delete a file and its content
    '''
    try:
        deleted = await delete_file(file_id)
        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="File not found"
            )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete file: {str(e)}"
        )
