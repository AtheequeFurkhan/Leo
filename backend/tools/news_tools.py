import httpx
from typing import List, Dict
from ..config import settings

async def search_news(query: str) -> List[Dict]:
    """
    Search for recent news relevant to the query using NewsAPI.
    """
    if not settings.NEWSAPI_KEY:
        return [{"error": "Missing NewsAPI Key"}]

    url = "https://newsapi.org/v2/everything"
    params = {
        "q": query,
        "apiKey": settings.NEWSAPI_KEY,
        "pageSize": 5,
        "sortBy": "relevancy"
    }

    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url, params=params, timeout=10.0)
            response.raise_for_status()
            data = response.json()
            
            articles = data.get("articles", [])
            return [
                {
                    "title": a["title"],
                    "source": a["source"]["name"],
                    "url": a["url"],
                    "published_at": a["publishedAt"],
                    "snippet": a["description"]
                }
                for a in articles
            ]
        except Exception as e:
            return [{"error": str(e)}]
