import json
from typing import List, Dict, Any
from models.database import File
from internal.common import open_router_api

async def generate_essay_instructions(learning_space_id: str, files: List[File]) -> Dict[str, Any]:
    """
    Generate essay topic, guidelines, and helping material based on uploaded files
    """
    
    # Extract text content from files
    file_contents = []
    for file in files:
        if file.extractedText:
            file_contents.append(f"File: {file.name}\nContent: {file.extractedText[:2000]}...")  # Limit content length
    
    combined_content = "\n\n".join(file_contents)
    
    # Create prompt for OpenRouter
    prompt = f"""
    Based on the following uploaded educational materials, generate an essay assignment that would test the student's understanding and critical thinking skills.

    Educational Materials:
    {combined_content}

    Please provide:
    1. A specific, focused essay topic (one clear question or prompt)
    2. 5 clear guidelines for writing the essay
    3. 5 helping material points or suggestions

    The essay should be 300-400 words and should demonstrate understanding of the key concepts from the materials.
    """
    
    # Define JSON Schema for structured output
    response_format = {
        "type": "json_schema",
        "json_schema": {
            "name": "essay_instructions",
            "strict": True,
            "schema": {
                "type": "object",
                "properties": {
                    "topic": {
                        "type": "string",
                        "description": "A specific, focused essay topic or question"
                    },
                    "guidelines": {
                        "type": "array",
                        "items": {"type": "string"},
                        "minItems": 5,
                        "maxItems": 5,
                        "description": "5 clear guidelines for writing the essay"
                    },
                    "helpingMaterial": {
                        "type": "array",
                        "items": {"type": "string"},
                        "minItems": 5,
                        "maxItems": 5,
                        "description": "5 helping material points or suggestions"
                    }
                },
                "required": ["topic", "guidelines", "helpingMaterial"],
                "additionalProperties": False
            }
        }
    }
    
    # Use the common open_router_api function with structured output
    response = await open_router_api(model="gpt-4o", prompt=prompt, response_format=response_format)
    
    if "error" in response:
        raise Exception(f"OpenRouter API error: {response['error']}")
    
    try:
        # Parse the structured JSON response
        content = response["choices"][0]["message"]["content"]
        result = json.loads(content)
        
        return {
            "topic": result.get("topic", "Essay Topic"),
            "guidelines": result.get("guidelines", []),
            "helpingMaterial": result.get("helpingMaterial", [])
        }
        
    except (json.JSONDecodeError, KeyError, IndexError) as e:
        raise Exception(f"Failed to parse OpenRouter structured response: {e}")

async def generate_essay_feedback(student_essay: str, essay_instructions: Dict[str, Any]) -> Dict[str, Any]:
    """
    Generate comprehensive feedback for a student's essay
    """
    
    prompt = f"""
    Please evaluate the following student essay based on the given assignment instructions and provide comprehensive feedback.

    Assignment Topic: {essay_instructions.get('topic', 'N/A')}
    
    Assignment Guidelines:
    {chr(10).join(['- ' + guideline for guideline in essay_instructions.get('guidelines', [])])}

    Student Essay:
    {student_essay}

    Please provide a comprehensive evaluation with:
    1. Overall score (0-100)
    2. 3-4 specific strengths
    3. 3-4 specific areas for improvement
    4. Detailed paragraph feedback
    5. Rubric scores for 4 criteria (each out of 25 points):
       - Understanding & Accuracy
       - Clarity, Organization & Style  
       - Critical Thinking & Evidence
       - Language & Grammar
    """
    
    # Define JSON Schema for structured feedback output
    response_format = {
        "type": "json_schema",
        "json_schema": {
            "name": "essay_feedback",
            "strict": True,
            "schema": {
                "type": "object",
                "properties": {
                    "score": {
                        "type": "integer",
                        "minimum": 0,
                        "maximum": 100,
                        "description": "Overall score from 0-100"
                    },
                    "strengths": {
                        "type": "array",
                        "items": {"type": "string"},
                        "minItems": 3,
                        "maxItems": 4,
                        "description": "3-4 specific strengths of the essay"
                    },
                    "improvements": {
                        "type": "array",
                        "items": {"type": "string"},
                        "minItems": 3,
                        "maxItems": 4,
                        "description": "3-4 specific areas for improvement"
                    },
                    "detailedFeedback": {
                        "type": "string",
                        "description": "Detailed paragraph feedback"
                    },
                    "rubric": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "name": {"type": "string"},
                                "score": {"type": "integer", "minimum": 0, "maximum": 25},
                                "maxScore": {"type": "integer", "enum": [25]},
                                "feedback": {"type": "string"}
                            },
                            "required": ["name", "score", "maxScore", "feedback"],
                            "additionalProperties": False
                        },
                        "minItems": 4,
                        "maxItems": 4,
                        "description": "Rubric scores for 4 criteria"
                    }
                },
                "required": ["score", "strengths", "improvements", "detailedFeedback", "rubric"],
                "additionalProperties": False
            }
        }
    }
    
    # Use the common open_router_api function with structured output
    response = await open_router_api(model="gpt-4o", prompt=prompt, response_format=response_format)
    
    if "error" in response:
        raise Exception(f"OpenRouter API error: {response['error']}")
    
    try:
        # Parse the structured JSON response
        content = response["choices"][0]["message"]["content"]
        result = json.loads(content)
        
        return {
            "score": result["score"],
            "strengths": result["strengths"],
            "improvements": result["improvements"],
            "detailedFeedback": result["detailedFeedback"],
            "rubric": result["rubric"]
        }
        
    except (json.JSONDecodeError, KeyError, IndexError) as e:
        raise Exception(f"Failed to parse OpenRouter structured response: {e}")
