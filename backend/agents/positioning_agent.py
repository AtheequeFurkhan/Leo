from .base_agent import BaseAgent
from ..schemas.agent_output import AgentOutput
from ..schemas.finding_schema import Finding
from ..schemas.evidence_schema import Evidence
from ..schemas.artifact_schema import Artifact
from ..tools.search_tools import search_web, search_reddit

class PositioningAgent(BaseAgent):
    def __init__(self):
        super().__init__("PositioningAgent")

    async def run(self, query_context) -> AgentOutput:
        # Collect Positioning data
        search_query = f"{query_context.company_name or query_context.query} ads messaging"
        results = await asyncio.gather(
            search_web(search_query),
            search_reddit(f"{query_context.company_name or query_context.query} reviews")
        )
        web_results, reddit_results = results
        
        # LLM Analysis
        all_raw_data = {"web": web_results, "social": reddit_results}
        llm_analysis = await self.analyze_with_llm(
            data=all_raw_data, 
            query=search_query, 
            context_type="Brand Positioning & Messaging"
        )
        
        raw_findings = llm_analysis.get("findings", [])
        findings = []
        evidence = []
        
        for i, f in enumerate(raw_findings):
            findings.append(
                Finding(
                    id=f"pos-{i}",
                    statement=f.get("statement", ""),
                    type=f.get("type", "interpretation"),
                    confidence=f.get("confidence", "medium"),
                    rationale=f.get("rationale", ""),
                    domain="Positioning",
                    evidence_ids=[f"ev-pos-{i}"]
                )
            )
            
            source = web_results[0] if web_results else reddit_results[0] if reddit_results else {"url": "#", "title": "N/A"}
            evidence.append(
                Evidence(
                    id=f"ev-pos-{i}",
                    source_type="ad_library/social",
                    url=source.get("url", "#"),
                    title=source.get("title", "Positioning Signal"),
                    snippet=source.get("snippet", ""),
                    collected_at=datetime.now(),
                    entity=query_context.company_name or "Brand",
                    tags=["messaging", "angle"]
                )
            )
        
        artifacts = [
            Artifact(
                artifact_type="positioning_map",
                title="Positioning & Messaging Map",
                payload={"core_messages": [f.get('statement') for f in raw_findings]}
            )
        ]
        
        return AgentOutput(
            agent_name=self.name,
            status="success",
            findings=findings,
            evidence=evidence,
            artifacts=artifacts
        )
