from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from database import get_db
import models
from user_agents import parse
import asyncio

router = APIRouter()

def process_scan_data(db: Session, qr_id: str, ip: str, ua_string: str):
    ua = parse(ua_string) if ua_string else None
    
    os_name = ua.os.family if ua else "Unknown"
    browser = ua.browser.family if ua else "Unknown"
    device_type = "Mobile" if ua and ua.is_mobile else "Tablet" if ua and ua.is_tablet else "PC" if ua and ua.is_pc else "Unknown"
    
    # For MVP, simple mock geoip based on headers or empty (real implementation would use an API or local db)
    country = "Unknown"
    city = "Unknown"

    scan = models.ScanModel(
        qr_code_id=qr_id,
        ip_address=ip,
        user_agent=ua_string,
        device_type=device_type,
        os=os_name,
        browser=browser,
        country=country,
        city=city
    )
    db.add(scan)
    db.commit()

@router.get("/r/{qr_id}")
def handle_redirect(qr_id: str, request: Request, db: Session = Depends(get_db)):
    # 1. Look up qr target
    qr_code = db.query(models.QRCodeModel).filter(models.QRCodeModel.id == qr_id).first()
    if not qr_code:
        raise HTTPException(status_code=404, detail="QR Code not found")

    # 2. Extract request info
    ip = request.client.host if request.client else "Unknown"
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        ip = forwarded.split(",")[0]
        
    ua_string = request.headers.get("user-agent", "")

    # 3. Save scan data (synchronously for MVP, but ideally in background)
    process_scan_data(db, qr_id, ip, ua_string)

    # 4. Redirect
    return RedirectResponse(url=qr_code.target_url, status_code=302)
