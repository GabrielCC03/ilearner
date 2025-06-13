from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import asyncio
import os
from dotenv import load_dotenv
from routers import template, common
from routers.database import files, learning_spaces


app = FastAPI()

# Setup CORS to allow calls from React server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(template.router)
app.include_router(common.router)
app.include_router(learning_spaces.router)
app.include_router(files.router)

if __name__ == "__main__":

    # Load environment variables from .env file
    load_dotenv()

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        factory=False,
    )
