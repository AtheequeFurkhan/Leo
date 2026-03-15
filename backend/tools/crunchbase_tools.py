import httpx
from typing import Dict, Any
from ..config import settings

async def get_company_intel(company_name: str) -> Dict[str, Any]:
    """
    Retrieve financial and structural intelligence for a company from Crunchbase.
    """
    if not settings.CRUNCHBASE_API_KEY:
        return {"error": "Missing Crunchbase API Key"}

    # Crunchbase API v4 endpoint for organizations
    url = f"https://api.crunchbase.com/api/v4/entities/organizations/{company_name.lower().replace(' ', '-')}"
    params = {
        "user_key": settings.CRUNCHBASE_API_KEY,
        "field_ids": "name,funding_total,last_funding_at,num_employees_enum,short_description"
    }

    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url, params=params, timeout=10.0)
            if response.status_code == 404:
                return {"error": f"Company {company_name} not found in Crunchbase"}
            
            response.raise_for_status()
            data = response.json()
            props = data.get("properties", {})
            
            return {
                "name": props.get("name"),
                "funding_total": props.get("funding_total", {}).get("value_usd"),
                "last_funding_round": props.get("last_funding_at"),
                "employee_count": props.get("num_employees_enum"),
                "description": props.get("short_description")
            }
        except Exception as e:
            return {"error": str(e)}
