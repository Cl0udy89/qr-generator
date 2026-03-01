from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class QRCodeModel(Base):
    __tablename__ = "qr_codes"

    id = Column(String(50), primary_key=True, index=True)
    campaign_name = Column(String(255), nullable=False)
    target_url = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    scans = relationship("ScanModel", back_populates="qr_code", cascade="all, delete-orphan")

class ScanModel(Base):
    __tablename__ = "scans"

    id = Column(Integer, primary_key=True, index=True)
    qr_code_id = Column(String(50), ForeignKey("qr_codes.id", ondelete="CASCADE"))
    scanned_at = Column(DateTime(timezone=True), server_default=func.now())
    ip_address = Column(String(50))
    user_agent = Column(Text)
    device_type = Column(String(50))
    os = Column(String(50))
    browser = Column(String(50))
    country = Column(String(100))
    city = Column(String(100))

    qr_code = relationship("QRCodeModel", back_populates="scans")
