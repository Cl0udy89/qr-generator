from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db
import models, schemas
from collections import Counter

router = APIRouter()

@router.get("/{qr_id}", response_model=schemas.AnalyticsResponse)
def get_analytics(qr_id: str, db: Session = Depends(get_db)):
    qr = db.query(models.QRCodeModel).filter(models.QRCodeModel.id == qr_id).first()
    if not qr:
        raise HTTPException(status_code=404, detail="QR Code not found")

    scans = db.query(models.ScanModel).filter(models.ScanModel.qr_code_id == qr_id).all()
    
    total_scans = len(scans)
    
    # OS Stats
    os_counts = Counter([s.os for s in scans])
    os_stats = [{"name": os_name, "value": count} for os_name, count in os_counts.items()]
    
    # Browser Stats
    browser_counts = Counter([s.browser for s in scans])
    browser_stats = [{"name": b_name, "value": count} for b_name, count in browser_counts.items()]
    
    # Device Stats
    device_counts = Counter([s.device_type for s in scans])
    device_stats = [{"name": d_name, "value": count} for d_name, count in device_counts.items()]
    
    # Location Stats (For MVP, just mock or use the empty ones)
    location_counts = Counter([f"{s.country} - {s.city}" for s in scans if s.country != "Unknown"])
    location_stats = [{"name": loc, "value": count} for loc, count in location_counts.items()]
    if not location_stats:
        location_stats = [{"name": "Unknown", "value": total_scans}]

    # Timeline (Group by Date)
    dates = [s.scanned_at.strftime("%Y-%m-%d") for s in scans if s.scanned_at]
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
        "device_stats": device_stats # Optional addition
    }
