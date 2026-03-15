import asyncio
from datetime import datetime
from .base_agent import BaseAgent
from ..schemas.agent_output import AgentOutput
from ..schemas.finding_schema import Finding
from ..schemas.evidence_schema import Evidence
from ..schemas.artifact_schema import Artifact
from ..tools.hiring_tools import search_hiring_signals

class HiringSignalAgent(BaseAgent):
    def __init__(self):
        super().__init__("HiringSignalAgent")

    async def run(self, query_context) -> AgentOutput:
        # 1. Collect sources
        hiring_results = await search_hiring_signals(query_context.company_name or query_context.query)
        
        # 2. Extract signals & 3. Generate findings
        findings = []
        evidence = []
        
        for i, f in enumerate(raw_findings):
            findings.append(
                Finding(
                    id=f"hiring-{i}",
                    statement=f.get("statement", ""),
                    type=f.get("type", "signal"),
                    confidence=f.get("confidence", "low"),
                    rationale=f.get("rationale", ""),
                    domain="Hiring",
                    evidence_ids=[f"ev-hiring-{i}"]
                )
            )
            
            j_source = jobs[0] if jobs else {"title": "Jobs Search", "company": "Various"}
            evidence.append(
                Evidence(
                    id=f"ev-hiring-{i}",
                    source_type="hiring_search",
                    url="#",
                    title=f"Hiring Signal: {j_source.get('title')}",
                    snippet=f"Posted by {j_source.get('company')}",
                    collected_at=datetime.now(),
                    entity=query_context.company_name or "Target Industry",
                    tags=["hiring", "growth"]
                )
            )
        
        artifacts = [
            Artifact(
                artifact_type="hiring_velocity",
                title="Hiring Velocity Index",
                payload={"postings_found": len(jobs)}
            )
        ]
        
        return AgentOutput(
            agent_name=self.name,
            status="success",
            findings=findings,
            evidence=evidence,
            artifacts=artifacts
        )
