from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers.code_routers import router as code_router



app = FastAPI(title="Code Execution API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(code_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)