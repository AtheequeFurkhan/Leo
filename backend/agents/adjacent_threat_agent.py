import asyncio
from datetime import datetime
from .base_agent import BaseAgent
from ..schemas.agent_output import AgentOutput
from ..schemas.finding_schema import Finding
from ..schemas.evidence_schema import Evidence
from ..schemas.artifact_schema import Artifact

from ..tools.patent_tools import search_patents

class AdjacentThreatAgent(BaseAgent):
    def __init__(self):
        super().__init__("AdjacentThreatAgent")

    async def run(self, query_context) -> AgentOutput:
        # Collect Patent data
        search_query = query_context.company_name or query_context.query
        patents = await search_patents(search_query)
        
        # LLM Analysis
        llm_analysis = await self.analyze_with_llm(
            data={"patents": patents}, 
            query=search_query, 
            context_type="Adjacent Market Threats / Patents"
        )
        
        raw_findings = llm_analysis.get("findings", [])
        findings = []
        evidence = []
        
        for i, f in enumerate(raw_findings):
            findings.append(
                Finding(
                    id=f"threat-{i}",
                    statement=f.get("statement", ""),
                    type=f.get("type", "interpretation"),
                    confidence=f.get("confidence", "low"),
                    rationale=f.get("rationale", ""),
                    domain="Threats",
                    evidence_ids=[f"ev-patent-{i}"]
                )
            )
            
            p_source = patents[0] if patents else {"patent_number": "N/A", "title": "N/A", "abstract": "N/A"}
            evidence.append(
                Evidence(
                    id=f"ev-patent-{i}",
                    source_type="patent",
                    url=f"https://patents.google.com/patent/{p_source.get('patent_number')}",
                    title=p_source.get("title", "Patent Signal"),
                    snippet=p_source.get("abstract", ""),
                    collected_at=datetime.now(),
                    entity="Adjacent Player",
                    tags=["platform", "expansion"]
                )
            )
        
        artifacts = [
            Artifact(
                artifact_type="threat_map",
                title="Strategic Threat Map",
                payload={"tech_signals": [p.get('title') for p in patents]}
            )
        ]
        
        return AgentOutput(
            agent_name=self.name,
            status="success",
            findings=findings,
            evidence=evidence,
            artifacts=artifacts
        )
