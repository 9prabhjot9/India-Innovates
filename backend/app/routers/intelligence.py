"""Intelligence Feed API endpoints."""

from typing import Optional
from fastapi import APIRouter, Query
from app.data.mock_data import FEED_ITEMS, RISK_REGIONS

router = APIRouter()


@router.get("/feed", summary="Get intelligence feed")
async def get_feed(
    domain: Optional[str] = Query(None),
    severity: Optional[str] = Query(None),
    verified_only: bool = Query(False),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
):
    """Returns filtered intelligence feed items."""
    items = FEED_ITEMS.copy()

    if domain:
        items = [i for i in items if i["domain"] == domain]
    if severity:
        items = [i for i in items if i["severity"] == severity]
    if verified_only:
        items = [i for i in items if i["verified"]]

    return {
        "items": items[offset:offset + limit],
        "total": len(items),
        "filtered_by": {
            "domain": domain,
            "severity": severity,
            "verified_only": verified_only,
        },
    }


@router.get("/risk", summary="Get global risk assessment")
async def get_risk_assessment():
    """Returns comprehensive global risk assessment by region."""
    avg_risk = sum(r["risk_score"] for r in RISK_REGIONS) / len(RISK_REGIONS)
    return {
        "regions": RISK_REGIONS,
        "global_average": round(avg_risk, 1),
        "critical_count": sum(1 for r in RISK_REGIONS if r["risk_score"] >= 80),
        "escalating_count": sum(1 for r in RISK_REGIONS if r["trend"] == "escalating"),
        "last_updated": "2025-06-03T12:00:00Z",
    }


@router.get("/risk/{region}", summary="Get region-specific risk")
async def get_region_risk(region: str):
    """Returns detailed risk profile for a specific region."""
    region_data = next(
        (r for r in RISK_REGIONS if r["region"].lower().replace(" ", "-") == region.lower()),
        None
    )
    if not region_data:
        return {"error": f"Region '{region}' not found", "available": [r["region"] for r in RISK_REGIONS]}
    return region_data
