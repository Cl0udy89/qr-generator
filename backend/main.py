from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
import routers.qr as qr
import routers.scan as scan
import routers.analytics as analytics
from fastapi.staticfiles import StaticFiles
import os

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="QR Code Generator API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For MVP, allow all
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure static dir exists
os.makedirs("static/qr_codes", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

app.include_router(qr.router, prefix="/api/qr", tags=["QR Codes"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics"])
app.include_router(scan.router, tags=["Scanning & Redirects"])

@app.get("/api/health")
def health_check():
    return {"status": "ok"}
