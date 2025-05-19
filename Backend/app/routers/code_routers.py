from fastapi import APIRouter, HTTPException, Request
from app.schemas.code_schema import CodeRequest
from app.services.code_services import execute_code
import json
import re

router = APIRouter()

async def robust_json_parser(body: str) -> CodeRequest:
    """Improved JSON parser that handles unescaped quotes in code field"""
    try:
        # First attempt standard JSON parsing
        return CodeRequest(**json.loads(body))
    except json.JSONDecodeError:
        # Fallback: Advanced pattern matching for code field
        code_pattern = r'"code"\s*:\s*"((?:\\"|.)*?)"(?=\s*[,}])'
        filename_pattern = r'"filename"\s*:\s*"([^"]*)"'
        
        code_match = re.search(code_pattern, body, re.DOTALL)
        filename_match = re.search(filename_pattern, body)
        
        if code_match and filename_match:
            # Unescape any escaped quotes and preserve formatting
            clean_code = code_match.group(1).replace('\\"', '"')
            return CodeRequest(
                code=clean_code,
                filename=filename_match.group(1)
            )
        raise ValueError("Invalid request format")

@router.post("/execute")
async def execute_code_route(request: Request):
    try:
        body_bytes = await request.body()
        body_str = body_bytes.decode("utf-8")
        request_data = await robust_json_parser(body_str)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    try:
        print(f"Received code: {request_data.code}")
        result = execute_code(request_data.code, request_data.filename)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Code execution error: {str(e)}")
    
    return result