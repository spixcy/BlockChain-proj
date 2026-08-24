from fastapi import APIRouter, Request, HTTPException
from pydantic import BaseModel, Field
import uuid
from typing import List, Optional
from datetime import datetime
import time

# Simple in-memory rate limiter logic (without requiring complex slowapi setup for MVP)
# Just tracking IP -> (count, reset_time)
rate_limits = {}

def check_rate_limit(request: Request):
    ip = request.client.host
    now = time.time()
    
    if ip not in rate_limits:
        rate_limits[ip] = {"count": 1, "reset_time": now + 60} # 60 sec window
    else:
        if now > rate_limits[ip]["reset_time"]:
            rate_limits[ip] = {"count": 1, "reset_time": now + 60}
        else:
            rate_limits[ip]["count"] += 1
            if rate_limits[ip]["count"] > 5: # Limit: 5 requests per minute
                raise HTTPException(status_code=429, detail="Mock API Rate Limit Exceeded. Try again later.")

router = APIRouter(
    prefix="/mock",
    tags=["Government & LEA Integrations (MOCK)"],
    dependencies=[]
)

class SahyogRequest(BaseModel):
    vasp_name: str = Field(..., example="Binance")
    target_address: str = Field(..., example="1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa")
    case_id: str = Field(..., example="CASE-2026-001")
    officer_id: str = Field(..., example="INV-8492")

class SahyogResponse(BaseModel):
    request_id: str
    status: str
    eta: str
    mock_notice: str

@router.post("/sahyog/data-request", response_model=SahyogResponse, summary="Submit VASP Data Request via SAHYOG")
def mock_sahyog_data_request(req: SahyogRequest, request: Request):
    """
    **[INTEGRATION CONTRACT]** 
    Simulates submitting a legal data request to a cryptocurrency exchange via the SAHYOG portal.
    In a production environment, this would bridge to the real government VASP communication layer.
    """
    check_rate_limit(request)
    return {
        "request_id": f"REQ-{uuid.uuid4().hex[:8].upper()}",
        "status": "PENDING_MOCK_APPROVAL",
        "eta": "48 hours",
        "mock_notice": "MOCK: This is a simulated response. No actual legal request was sent."
    }

class NcrpComplaintSync(BaseModel):
    ncrp_id: str = Field(..., example="NCRP-2026-991234")
    wallet_address: str = Field(..., example="TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t")
    fraud_type: str = Field(..., example="investment scam")
    reported_at: str = Field(..., example="2026-08-20T14:30:00Z")

class NcrpSyncResponse(BaseModel):
    sync_id: str
    records_processed: int
    status: str
    mock_notice: str

@router.post("/ncrp/complaint-sync", response_model=NcrpSyncResponse, summary="Sync complaints from NCRP 1930 Portal")
def mock_ncrp_sync(req: List[NcrpComplaintSync], request: Request):
    """
    **[INTEGRATION CONTRACT]**
    Simulates pulling/pushing complaint records from the citizen-facing NCRP (cybercrime.gov.in) portal.
    """
    check_rate_limit(request)
    return {
        "sync_id": f"SYNC-{uuid.uuid4().hex[:8].upper()}",
        "records_processed": len(req),
        "status": "SUCCESS",
        "mock_notice": "MOCK: Records virtually ingested. No connection to real NCRP was made."
    }
