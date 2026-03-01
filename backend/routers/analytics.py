from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db
import models, schemas
from collections import Counter
from datetime import datetime, timedelta
from typing import List

router = APIRouter()

@router.get("/{qr_id}", response_model=schemas.AnalyticsResponse)
def get_analytics(
    qr_id: str, 
    timeframe: str = Query("all", description="today, week, month, 6months, year, all"),
    db: Session = Depends(get_db)
):
    qr = db.query(models.QRCodeModel).filter(models.QRCodeModel.id == qr_id).first()
    if not qr:
        raise HTTPException(status_code=404, detail="QR Code not found")

    query = db.query(models.ScanModel).filter(models.ScanModel.qr_code_id == qr_id)
    
    # Time filtering
    now = datetime.utcnow()
    if timeframe == "today":
        query = query.filter(models.ScanModel.scanned_at >= now - timedelta(days=1))
    elif timeframe == "week":
        query = query.filter(models.ScanModel.scanned_at >= now - timedelta(days=7))
    elif timeframe == "month":
        query = query.filter(models.ScanModel.scanned_at >= now - timedelta(days=30))
    elif timeframe == "6months":
        query = query.filter(models.ScanModel.scanned_at >= now - timedelta(days=180))
    elif timeframe == "year":
        query = query.filter(models.ScanModel.scanned_at >= now - timedelta(days=365))

    scans = query.all()
    total_scans = len(scans)
    
    os_counts = Counter([s.os for s in scans])
    os_stats = [{"name": os_name, "value": count} for os_name, count in os_counts.items() if count > 0]
    
    browser_counts = Counter([s.browser for s in scans])
    browser_stats = [{"name": b_name, "value": count} for b_name, count in browser_counts.items() if count > 0]
    
    device_counts = Counter([s.device_type for s in scans])
    device_stats = [{"name": d_name, "value": count} for d_name, count in device_counts.items() if count > 0]
    
    location_counts = Counter([f"{s.country} - {s.city}" for s in scans if s.country != "Unknown"])
    location_stats = [{"name": loc, "value": count} for loc, count in location_counts.items() if count > 0]
    if not location_stats and total_scans > 0:
        location_stats = [{"name": "Unknown", "value": total_scans}]

    # Timeline formatting logic
    dates = []
    for s in scans:
        if s.scanned_at:
            if timeframe == "today":
                dates.append(s.scanned_at.strftime("%H:00")) # Group by hour
            else:
                dates.append(s.scanned_at.strftime("%Y-%m-%d"))

    date_counts = Counter(dates)
    scans_over_time = [{"date": d, "count": c} for d, c in sorted(date_counts.items())]

    return {
        "qr_code": {
            "id": qr.id,
            "campaign_name": qr.campaign_name,
            "target_url": qr.target_url,
            "created_at": qr.created_at,
            "qr_image_url": f"/static/qr_codes/{qr.id}.png"
        },
        "total_scans": total_scans,
        "scans_over_time": scans_over_time,
        "os_stats": os_stats,
        "browser_stats": browser_stats,
        "location_stats": location_stats,
        "device_stats": device_stats
    }

@router.get("/{qr_id}/logs", response_model=List[schemas.ScanLogResponse])
def get_analytics_logs(qr_id: str, db: Session = Depends(get_db)):
    qr = db.query(models.QRCodeModel).filter(models.QRCodeModel.id == qr_id).first()
    if not qr:
        raise HTTPException(status_code=404, detail="QR Code not found")
        
    scans = db.query(models.ScanModel).filter(models.ScanModel.qr_code_id == qr_id).order_by(models.ScanModel.scanned_at.desc()).all()
    return scans
