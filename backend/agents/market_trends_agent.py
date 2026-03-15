import asyncio
from datetime import datetime
from .base_agent import BaseAgent
from ..schemas.agent_output import AgentOutput
from ..schemas.finding_schema import Finding
from ..schemas.evidence_schema import Evidence
from ..schemas.artifact_schema import Artifact
from ..tools.search_tools import search_web
from ..tools.news_tools import search_news

class MarketTrendsAgent(BaseAgent):
    def __init__(self):
        super().__init__("MarketTrendsAgent")

    async def run(self, query_context) -> AgentOutput:
        # 1. Collect sources (Web + News)
        search_query = f"market trends for {query_context.company_name or query_context.query}"
        results = await asyncio.gather(
            search_web(search_query),
            search_news(search_query)
        )
        web_results, news_results = results
        
        # 2. Extract signals & 3. Generate findings using LLM
        all_raw_data = {"web": web_results, "news": news_results}
        llm_analysis = await self.analyze_with_llm(
            data=all_raw_data, 
            query=search_query, 
            context_type="Market Trend"
        )
        
        raw_findings = llm_analysis.get("findings", [])
        findings = []
        evidence = []
        
        for i, f in enumerate(raw_findings):
            fid = f"trend-{i}"
            findings.append(
                Finding(
                    id=fid,
                    statement=f.get("statement", "No statement"),
                    type=f.get("type", "fact"),
                    confidence=f.get("confidence", "low"),
                    rationale=f.get("rationale", "No rationale"),
                    domain="Market",
                    evidence_ids=[f"ev-market-{i}"]
                )
            )
            # Link to the first relevant result for evidence
            source_list = web_results + news_results
            source = source_list[0] if source_list else {"url": "N/A", "title": "N/A", "snippet": "N/A"}
            
            evidence.append(
                Evidence(
                    id=f"ev-market-{i}",
                    source_type="web/news",
                    url=source.get("url", "N/A"),
                    title=source.get("title", "N/A"),
                    snippet=source.get("snippet", "N/A"),
                    collected_at=datetime.now(),
                    entity=query_context.company_name or "Market",
                    tags=["growth", "signals"]
                )
            )
        
        # 4. Build artifacts
        artifacts = [
            Artifact(
                artifact_type="trend_timeline",
                title="Market Signal Timeline",
                payload={"2024-Q1": "Expansion Phase", "2024-Q2": "Growth Tracking"}
            )
        ]
        
        return AgentOutput(
            agent_name=self.name,
            status="success",
            findings=findings,
            evidence=evidence,
            artifacts=artifacts
        )
