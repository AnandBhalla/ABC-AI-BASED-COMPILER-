from fastapi import FastAPI, HTTPException, Body
from pydantic import BaseModel
import tempfile
import os
import subprocess
import uuid
import shutil

class CodeRequest(BaseModel):
    code: str
    language: str

app = FastAPI(title="Code Execution API")

@app.post("/execute")
async def execute_code(request: CodeRequest = Body(...)):
    """
    Execute code in various programming languages and return the output.
    
    Supported languages:
    - python
    - c
    - cpp (C++)
    - java
    """
    language = request.language.lower()
    code = request.code
    
    if language not in ["python", "c", "cpp", "java"]:
        raise HTTPException(
            status_code=400, 
            detail=f"Unsupported language: {language}. Supported languages are: python, c, cpp, java"
        )
    
    try:
        # Create a unique execution directory
        execution_id = str(uuid.uuid4())
        execution_dir = os.path.join(tempfile.gettempdir(), f"code_execution_{execution_id}")
        os.makedirs(execution_dir, exist_ok=True)
        
        # Execute the code based on the language
        if language == "python":
            result = execute_python(code, execution_dir)
        elif language == "c":
            result = execute_c(code, execution_dir)
        elif language == "cpp":
            result = execute_cpp(code, execution_dir)
        elif language == "java":
            result = execute_java(code, execution_dir)
        
        # Clean up the temporary directory
        try:
            shutil.rmtree(execution_dir)
        except Exception as e:
            print(f"Error cleaning up directory: {e}")
        
        return {
            "language": language,
            "output": result.get("output", ""),
            "error": result.get("error", ""),
            "execution_time": result.get("execution_time", 0),
            "success": result.get("success", False)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Code execution error: {str(e)}")

def execute_python(code, execution_dir):
    """Execute Python code and return the results."""
    
    code_file = os.path.join(execution_dir, "script.py")
    
    with open(code_file, "w") as f:
        f.write(code)
    
    try:
        # Run the Python code with a timeout
        process = subprocess.run(
            ["python", code_file],
            capture_output=True,
            text=True,
            timeout=10  # 10 seconds timeout
        )
        
        return {
            "output": process.stdout,
            "error": process.stderr,
            "success": process.returncode == 0,
            "execution_time": 0  # We could add more precise timing
        }
    
    except subprocess.TimeoutExpired:
        return {
            "output": "",
            "error": "Execution timed out (exceeded 10 seconds)",
            "success": False,
            "execution_time": 10
        }

def execute_c(code, execution_dir):
    """Compile and execute C code, returning the results."""
    
    source_file = os.path.join(execution_dir, "program.c")
    executable = os.path.join(execution_dir, "program")
    
    # Write code to file
    with open(source_file, "w") as f:
        f.write(code)
    
    try:
        # Compile the C code
        compile_process = subprocess.run(
            ["gcc", source_file, "-o", executable],
            capture_output=True,
            text=True
        )
        
        if compile_process.returncode != 0:
            return {
                "output": "",
                "error": f"Compilation error: {compile_process.stderr}",
                "success": False,
                "execution_time": 0
            }
        
        # Execute the compiled program
        run_process = subprocess.run(
            [executable],
            capture_output=True,
            text=True,
            timeout=10  # 10 seconds timeout
        )
        
        return {
            "output": run_process.stdout,
            "error": run_process.stderr,
            "success": run_process.returncode == 0,
            "execution_time": 0
        }
    
    except subprocess.TimeoutExpired:
        return {
            "output": "",
            "error": "Execution timed out (exceeded 10 seconds)",
            "success": False,
            "execution_time": 10
        }

def execute_cpp(code, execution_dir):
    """Compile and execute C++ code, returning the results."""
    
    source_file = os.path.join(execution_dir, "program.cpp")
    executable = os.path.join(execution_dir, "program")
    
    # Write code to file
    with open(source_file, "w") as f:
        f.write(code)
    
    try:
        # Compile the C++ code
        compile_process = subprocess.run(
            ["g++", source_file, "-o", executable],
            capture_output=True,
            text=True
        )
        
        if compile_process.returncode != 0:
            return {
                "output": "",
                "error": f"Compilation error: {compile_process.stderr}",
                "success": False,
                "execution_time": 0
            }
        
        # Execute the compiled program
        run_process = subprocess.run(
            [executable],
            capture_output=True,
            text=True,
            timeout=10  # 10 seconds timeout
        )
        
        return {
            "output": run_process.stdout,
            "error": run_process.stderr,
            "success": run_process.returncode == 0,
            "execution_time": 0
        }
    
    except subprocess.TimeoutExpired:
        return {
            "output": "",
            "error": "Execution timed out (exceeded 10 seconds)",
            "success": False,
            "execution_time": 10
        }

def execute_java(code, execution_dir):
    """Compile and execute Java code, returning the results."""
    
    # Extract the class name from the code
    import re
    class_name_match = re.search(r"public\s+class\s+(\w+)", code)
    
    if not class_name_match:
        return {
            "output": "",
            "error": "Could not find public class name in Java code",
            "success": False,
            "execution_time": 0
        }
    
    class_name = class_name_match.group(1)
    source_file = os.path.join(execution_dir, f"{class_name}.java")
    
    # Write code to file
    with open(source_file, "w") as f:
        f.write(code)
    
    try:
        # Compile the Java code
        compile_process = subprocess.run(
            ["javac", source_file],
            capture_output=True,
            text=True
        )
        
        if compile_process.returncode != 0:
            return {
                "output": "",
                "error": f"Compilation error: {compile_process.stderr}",
                "success": False,
                "execution_time": 0
            }
        
        # Execute the compiled program
        run_process = subprocess.run(
            ["java", "-cp", execution_dir, class_name],
            capture_output=True,
            text=True,
            timeout=10  # 10 seconds timeout
        )
        
        return {
            "output": run_process.stdout,
            "error": run_process.stderr,
            "success": run_process.returncode == 0,
            "execution_time": 0
        }
    
    except subprocess.TimeoutExpired:
        return {
            "output": "",
            "error": "Execution timed out (exceeded 10 seconds)",
            "success": False,
            "execution_time": 10
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)