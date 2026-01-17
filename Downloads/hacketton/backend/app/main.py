"""
ISAVS FastAPI Application Entry Point
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from app.api import endpoints
from app.db.database import init_db, close_db
from app.core.config import settings
from app.services.websocket_manager import get_connection_manager


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager."""
    # Startup
    await init_db()
    yield
    # Shutdown
    await close_db()


app = FastAPI(
    title="ISAVS - Intelligent Student Attendance Verification System",
    description="Secure attendance verification using Face Recognition, ID Validation, and OTP",
    version="1.0.0",
    lifespan=lifespan
)

# Parse CORS origins from config
cors_origins = [origin.strip() for origin in settings.CORS_ORIGINS.split(",")]

# CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(endpoints.router)


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "service": "ISAVS"}


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "service": "ISAVS - Intelligent Student Attendance Verification System",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health"
    }


@app.websocket("/ws/dashboard")
async def websocket_dashboard(websocket: WebSocket):
    """
    WebSocket endpoint for real-time dashboard updates.
    
    Pushes attendance_update and anomaly_alert messages to connected clients.
    
    Message format:
    {
        "type": "attendance_update" | "anomaly_alert",
        "data": {...},
        "timestamp": "ISO8601"
    }
    """
    manager = get_connection_manager()
    await manager.connect(websocket)
    
    try:
        # Keep connection alive and listen for client messages
        while True:
            # Wait for any message from client (ping/pong for keep-alive)
            data = await websocket.receive_text()
            
            # Echo back for keep-alive
            if data == "ping":
                await websocket.send_text("pong")
            
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        print("WebSocket client disconnected")
    except Exception as e:
        print(f"WebSocket error: {e}")
        manager.disconnect(websocket)
