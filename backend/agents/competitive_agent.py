import asyncio
from datetime import datetime
from .base_agent import BaseAgent
from ..schemas.agent_output import AgentOutput
from ..schemas.finding_schema import Finding
from ..schemas.evidence_schema import Evidence
from ..schemas.artifact_schema import Artifact
from ..tools.search_tools import search_web
from ..tools.crunchbase_tools import get_company_intel

class CompetitiveLandscapeAgent(BaseAgent):
    def __init__(self):
        super().__init__("CompetitiveLandscapeAgent")

    async def run(self, query_context) -> AgentOutput:
        # Collect Web + Crunchbase data
        search_query = f"competitors of {query_context.company_name or query_context.query}"
        results = await asyncio.gather(
            search_web(search_query),
            get_company_intel(query_context.company_name or query_context.query)
        )
        raw_results, cb_data = results
        
        # LLM Analysis
        all_raw_data = {"search": raw_results, "crunchbase": cb_data}
        llm_analysis = await self.analyze_with_llm(
            data=all_raw_data, 
            query=search_query, 
            context_type="Competitive Landscape"
        )
        
        raw_findings = llm_analysis.get("findings", [])
        findings = []
        evidence = []
        
        for i, f in enumerate(raw_findings):
            findings.append(
                Finding(
                    id=f"comp-{i}",
                    statement=f.get("statement", ""),
                    type=f.get("type", "fact"),
                    confidence=f.get("confidence", "low"),
                    rationale=f.get("rationale", ""),
                    domain="Competition",
                    evidence_ids=[f"ev-comp-{i}"]
                )
            )
            
            # Use search result or placeholder
            source = raw_results[0] if raw_results else {"url": "#", "title": "Crunchbase Intel", "snippet": str(cb_data)}
            evidence.append(
                Evidence(
                    id=f"ev-comp-{i}",
                    source_type="web/crunchbase",
                    url=source.get("url", "#"),
                    title=source.get("title", "Competitive Signal"),
                    snippet=source.get("snippet", ""),
                    collected_at=datetime.now(),
                    entity=query_context.company_name or "Competitor",
                    tags=["feature", "threat"]
                )
            )
        
        artifacts = [
            Artifact(
                artifact_type="competitor_matrix",
                title="Feature Comparison Matrix",
                payload=[{"feature": "AI Strategy", "Status": "Extracted via LLM"}]
            )
        ]
        
        return AgentOutput(
            agent_name=self.name,
            status="success",
            findings=findings,
            evidence=evidence,
            artifacts=artifacts
        )
