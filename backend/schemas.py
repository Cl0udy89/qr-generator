from pydantic import BaseModel, HttpUrl
from datetime import datetime
from typing import List, Dict, Any, Optional

class QRCodeCreate(BaseModel):
    campaign_name: str
    target_url: HttpUrl
    base_url: Optional[str] = "http://localhost:3000"

class QRCodeResponse(BaseModel):
    id: str
    campaign_name: str
    target_url: str
    created_at: datetime
    qr_image_url: str

    class Config:
        from_attributes = True

class ScanData(BaseModel):
    scanned_at: datetime
    os: Optional[str]
    browser: Optional[str]
    device_type: Optional[str]
    country: Optional[str]
    city: Optional[str]

    class Config:
        from_attributes = True

class AnalyticsResponse(BaseModel):
    qr_code: QRCodeResponse
    total_scans: int
    scans_over_time: List[Dict[str, Any]] # e.g. {"date": "...", "count": ...}
    os_stats: List[Dict[str, Any]]
    browser_stats: List[Dict[str, Any]]
    location_stats: List[Dict[str, Any]]
    device_stats: Optional[List[Dict[str, Any]]] = None
