import os
import uuid
import qrcode
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from database import get_db
import models, schemas
from typing import List

router = APIRouter()

def generate_qr_image(qr_id: str, target_url: str, base_url: str = "http://localhost:3000"):
    # The URL that will be printed in the QR code (points to our backend redirect endpoint via Next.js Proxy)
    redirect_url = f"{base_url}/r/{qr_id}"

    qr = qrcode.QRCode(version=1, box_size=10, border=4)
    qr.add_data(redirect_url)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")
    
    file_path = f"static/qr_codes/{qr_id}.png"
    img.save(file_path)
    return file_path

@router.post("", response_model=schemas.QRCodeResponse)
def create_qr_code(qr_in: schemas.QRCodeCreate, db: Session = Depends(get_db)):
    qr_id = str(uuid.uuid4())[:8] # Short hash
    
    # Generate image
    generate_qr_image(qr_id, str(qr_in.target_url), qr_in.base_url)
    
    db_qr = models.QRCodeModel(
        id=qr_id,
        campaign_name=qr_in.campaign_name,
        target_url=str(qr_in.target_url)
    )
    db.add(db_qr)
    db.commit()
    db.refresh(db_qr)
    
    return {
        "id": db_qr.id,
        "campaign_name": db_qr.campaign_name,
        "target_url": db_qr.target_url,
        "created_at": db_qr.created_at,
        "qr_image_url": f"/static/qr_codes/{qr_id}.png"
    }

@router.get("", response_model=List[schemas.QRCodeResponse])
def list_qr_codes(db: Session = Depends(get_db)):
    qrs = db.query(models.QRCodeModel).order_by(models.QRCodeModel.created_at.desc()).all()
    results = []
    for qr in qrs:
        results.append({
            "id": qr.id,
            "campaign_name": qr.campaign_name,
            "target_url": qr.target_url,
            "created_at": qr.created_at,
            "qr_image_url": f"/static/qr_codes/{qr.id}.png"
        })
    return results

@router.put("/{qr_id}", response_model=schemas.QRCodeResponse)
def update_qr_code(qr_id: str, qr_in: schemas.QRCodeUpdate, db: Session = Depends(get_db)):
    qr = db.query(models.QRCodeModel).filter(models.QRCodeModel.id == qr_id).first()
    if not qr:
        raise HTTPException(status_code=404, detail="QR Code not found")
        
    if qr_in.campaign_name is not None:
        qr.campaign_name = qr_in.campaign_name
    if qr_in.target_url is not None:
        qr.target_url = str(qr_in.target_url)
        
    db.commit()
    db.refresh(qr)
    
    return {
        "id": qr.id,
        "campaign_name": qr.campaign_name,
        "target_url": qr.target_url,
        "created_at": qr.created_at,
        "qr_image_url": f"/static/qr_codes/{qr.id}.png"
    }

@router.delete("/{qr_id}")
def delete_qr_code(qr_id: str, db: Session = Depends(get_db)):
    qr = db.query(models.QRCodeModel).filter(models.QRCodeModel.id == qr_id).first()
    if not qr:
        raise HTTPException(status_code=404, detail="QR Code not found")
        
    db.delete(qr)
    db.commit()
    
    # Optionally delete the file as well
    file_path = f"static/qr_codes/{qr_id}.png"
    if os.path.exists(file_path):
        os.remove(file_path)
        
    return {"message": "QR Code deleted successfully"}
