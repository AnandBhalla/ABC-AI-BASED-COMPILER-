import os
import subprocess
import uuid
import shutil
import tempfile
import re

def get_language_from_filename(filename: str) -> str:
    extension_map = {
        '.py': 'python',
        '.c': 'c',
        '.cpp': 'cpp',
        '.java': 'java'
    }
    _, ext = os.path.splitext(filename.lower())
    if ext not in extension_map:
        raise ValueError(f"Unsupported file extension: {ext}")
    return extension_map[ext]

def execute_code(code: str, filename: str) -> dict:
    language = get_language_from_filename(filename)
    
    execution_id = str(uuid.uuid4())
    execution_dir = os.path.join(tempfile.gettempdir(), f"code_execution_{execution_id}")
    os.makedirs(execution_dir, exist_ok=True)
    
    try:
        if language == "python":
            result = execute_python(code, execution_dir)
        elif language == "c":
            result = execute_c(code, execution_dir)
        elif language == "cpp":
            result = execute_cpp(code, execution_dir)
        elif language == "java":
            result = execute_java(code, execution_dir)
        
        result["language"] = language
        return result
    finally:
        try:
            shutil.rmtree(execution_dir)
        except Exception as e:
            print(f"Error cleaning up directory: {e}")

def execute_python(code: str, execution_dir: str) -> dict:
    code_file = os.path.join(execution_dir, "script.py")
    with open(code_file, "w") as f:
        f.write(code)
    
    try:
        process = subprocess.run(
            ["python", code_file],
            capture_output=True,
            text=True,
            timeout=10
        )
        return {
            "output": process.stdout,
            "error": process.stderr,
            "success": process.returncode == 0,
            "execution_time": 0
        }
    except subprocess.TimeoutExpired:
        return {
            "output": "",
            "error": "Execution timed out (exceeded 10 seconds)",
            "success": False,
            "execution_time": 10
        }

def execute_c(code: str, execution_dir: str) -> dict:
    source_file = os.path.join(execution_dir, "program.c")
    executable = os.path.join(execution_dir, "program")
    
    with open(source_file, "w") as f:
        f.write(code)
    
    try:
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
        
        run_process = subprocess.run(
            [executable],
            capture_output=True,
            text=True,
            timeout=10
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

def execute_cpp(code: str, execution_dir: str) -> dict:
    source_file = os.path.join(execution_dir, "program.cpp")
    executable = os.path.join(execution_dir, "program")
    
    with open(source_file, "w") as f:
        f.write(code)
    
    try:
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
        
        run_process = subprocess.run(
            [executable],
            capture_output=True,
            text=True,
            timeout=10
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

def execute_java(code: str, execution_dir: str) -> dict:
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
    
    with open(source_file, "w") as f:
        f.write(code)
    
    try:
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
        
        run_process = subprocess.run(
            ["java", "-cp", execution_dir, class_name],
            capture_output=True,
            text=True,
            timeout=10
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