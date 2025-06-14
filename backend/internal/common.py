import requests
import json
import os
from typing import Optional, List
import pymupdf

MODELS = {
    # Selected models for this API
    "gpt-4o": "openai/gpt-4o",
    "gemini-2.0-flash-001": "google/gemini-2.0-flash-001",
    "claude-sonnet-4": "anthropic/claude-sonnet-4",
    "claude-3-5-sonnet": "anthropic/claude-3-5-sonnet",
    "deepseek-r1-0528": "deepseek/deepseek-r1-0528",
    "o1": "openai/o1",
    
}

async def open_router_api(model: str = "openai/gpt-4o", prompt: str = "", files: Optional[List] = None) -> dict:

    '''
    OpenRouter API wrapper
    Returns: response from OpenRouter API
    '''
    try:
        # Build the complete prompt with file context
        prompt = prompt_with_files_context(prompt, files)

        response = requests.post(
            url="https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {os.getenv('OPENROUTER_API_KEY')}",
            },
            data=json.dumps({
                "model": MODELS[model], # optional
                "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
                ]
            })
        )
    except Exception as e:
        return {"error": f"Failed to get response from OpenRouter API {e}"}

    return response.json()

async def open_router_api_streaming(model: str = "openai/gpt-4o", prompt: str = "", files: Optional[List] = None):
    '''
    OpenRouter API wrapper for streaming. https://openrouter.ai/docs/api-reference/streaming
    Yields: content chunks from OpenRouter API stream
    '''
    try:
        # Build the complete prompt with file context
        prompt = prompt_with_files_context(prompt, files)
        
        response = requests.post(
            url="https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {os.getenv('OPENROUTER_API_KEY')}",
                "Content-Type": "application/json"
            },
            json={
                "model": MODELS[model],
                "messages": [
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                "stream": True
            },
            stream=True
        )
        
        buffer = ""
        for chunk in response.iter_content(chunk_size=1024, decode_unicode=True):
            buffer += chunk
            while True:
                try:
                    # Find the next complete SSE line
                    line_end = buffer.find('\n')
                    if line_end == -1:
                        break
                    
                    line = buffer[:line_end].strip()
                    buffer = buffer[line_end + 1:]
                    
                    if line.startswith('data: '):
                        data = line[6:]
                        if data == '[DONE]':
                            return
                        
                        try:
                            data_obj = json.loads(data)
                            content = data_obj["choices"][0]["delta"].get("content")
                            if content:
                                yield content
                        except json.JSONDecodeError:
                            # Skip non-JSON payloads (like comments)
                            pass
                except Exception:
                    break
                    
    except Exception as e:
        yield f"Error: Failed to get streaming response from OpenRouter API - {str(e)}"

def prompt_with_files_context(prompt: str, files: Optional[List] = None) -> str:
    """
    Build a complete prompt with file context appended
    
    Args:
        prompt: The user's prompt
        files: List of File objects (Pydantic models) with extractedText
    
    Returns:
        Complete prompt with context appended
    """
    if not files:
        return prompt
    
    # Filter files that have extractedText
    files_with_text = []
    for file in files:
        # Handle both dict and Pydantic model objects
        if hasattr(file, 'extractedText'):
            extracted_text = getattr(file, 'extractedText', None)
            name = getattr(file, 'name', 'Unknown File')
        else:
            extracted_text = file.get('extractedText') if isinstance(file, dict) else None
            name = file.get('name', 'Unknown File') if isinstance(file, dict) else 'Unknown File'
        
        if extracted_text and extracted_text.strip():
            files_with_text.append({
                'name': name,
                'extractedText': extracted_text
            })
    
    if not files_with_text:
        return prompt
    
    # Build context section
    context_parts = []
    for file in files_with_text:
        filename = file['name']
        extracted_text = file['extractedText'].strip()
        
        context_parts.append(f"{filename}:\n{extracted_text}")
    
    # Combine prompt with context
    context_section = '\n\n'.join(context_parts)
    prompt = f"{prompt}\n\nContext:\n{context_section}"
    
    return prompt

def parse_file(content: bytes, file_type: str, mime_type: str) -> Optional[str]:
    """
    Parse and extract text content from different file types
    
    Args:
        content: Raw file content as bytes
        file_type: File type ('pdf', 'txt')
        mime_type: MIME type of the file
    
    Returns:
        Extracted text content or None if extraction fails
    """
    try:
        # Handle text files
        if file_type == 'txt' or 'text' in mime_type:
            return parse_text_file(content)
        
        # Handle PDF files
        elif file_type == 'pdf' or 'pdf' in mime_type:
            return parse_pdf_file(content)
        
        else:
            return None
            
    except Exception:
        return None

def parse_text_file(content: bytes) -> Optional[str]:
    """
    Parse text from text files (.txt, .md, etc.)
    
    Args:
        content: Raw file content as bytes
    
    Returns:
        Extracted text content or None if extraction fails
    """
    try:
        # Try UTF-8 first
        return content.decode('utf-8')
    except UnicodeDecodeError:
        try:
            # Fallback to latin-1 for other encodings
            return content.decode('latin-1')
        except Exception:
            return None

def parse_pdf_file(content: bytes) -> Optional[str]:
    """
    Parse text from PDF files using PyMuPDF
    Based on: https://pymupdf.readthedocs.io/en/latest/the-basics.html
    
    Args:
        content: Raw file content as bytes
    
    Returns:
        Extracted text content or None if extraction fails
    """
    try:
        
        # Open document from bytes stream
        doc = pymupdf.open(stream=content, filetype="pdf")
        
        # Extract text from each page
        text_content = []
        for page in doc:  # iterate the document pages
            text = page.get_text()  # get plain text (is in UTF-8)
            if text.strip():  # only add non-empty pages
                text_content.append(text)
        
        # Close the document
        doc.close()
        
        # Join all pages with double newlines
        extracted_text = '\n\n'.join(text_content)
        
        # Clean up extra whitespace
        extracted_text = '\n'.join(line.strip() for line in extracted_text.split('\n') if line.strip())
        
        return extracted_text if extracted_text.strip() else None
        
    except Exception as e:
        return f"Error: {str(e)}"
