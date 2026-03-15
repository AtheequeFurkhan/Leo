import httpx
import random
from typing import List, Dict
from ..config import settings

async def search_hiring_signals(query: str) -> List[Dict]:
    """
    Deep search for hiring signals (job postings) using Adzuna API.
    """
    if not settings.ADZUNA_APP_ID or not settings.ADZUNA_APP_KEY:
        return [{"error": "Missing Adzuna API Credentials"}]

    # Adzuna job search endpoint (typically for a specific country, e.g., 'gb' or 'us')
    country = "us"
    url = f"https://api.adzuna.com/v1/api/jobs/{country}/search/1"
    
    params = {
        "app_id": settings.ADZUNA_APP_ID,
        "app_key": settings.ADZUNA_APP_KEY,
        "results_per_page": 5,
        "what": query,
        "content-type": "application/json"
    }

    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url, params=params, timeout=10.0)
            response.raise_for_status()
            data = response.json()
            
            results = data.get("results", [])
            return [
                {
                    "title": r.get("title"),
                    "company": r.get("company", {}).get("display_name"),
                    "location": r.get("location", {}).get("display_name"),
                    "description": r.get("description"),
                    "posted_at": r.get("created")
                }
                for r in results
            ]
        except Exception as e:
            return [{"error": str(e)}]
