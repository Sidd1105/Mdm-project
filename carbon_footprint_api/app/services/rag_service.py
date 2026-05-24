"""
RAG service: FAISS retrieval + Ollama LLM generation.
Mirrors retrieve_chunks(), build_prompt(), get_advice(), and rag_chatbot()
from the original notebook.
"""

import logging
import re
from typing import Optional

import ollama

from app.core.config import settings
from app.models.loader import get_vector_db
from app.schemas.rag import PolicyChunk, RAGQueryRequest, RAGQueryResponse
from app.utils.constants import SYSTEM_CONTEXT
from app.utils.sector_map import clean_sector

logger = logging.getLogger("carbon_api.rag_service")


# ── Retrieval ─────────────────────────────────────────────────────────────────

def retrieve_chunks(query: str, k: int = 3) -> list[PolicyChunk]:
    """Similarity search against the FAISS vector store."""
    db = get_vector_db()
    results = db.similarity_search_with_score(query, k=k)
    chunks = [
        PolicyChunk(
            source=doc.metadata.get("source", "Unknown"),
            content=doc.page_content.strip(),
            score=round(float(1 - score), 4),
        )
        for doc, score in results
    ]
    logger.debug(f"Retrieved {len(chunks)} chunks for query: '{query[:60]}...'")
    return chunks


# ── Prompt Building ────────────────────────────────────────────────────────────

def build_structured_prompt(
    state: str,
    sector: str,
    fuel: str,
    year: int,
    co2_mmt: float,
    level: str,
    chunks: list[PolicyChunk],
) -> str:
    context = ""
    for i, c in enumerate(chunks, 1):
        context += f"\n[Source {i}: {c.source}]\n{c.content}\n"

    return f"""RETRIEVED POLICY DOCUMENTS:
{context}

EMISSION DATA FROM PREDICTION MODEL:
- State          : {state}
- Sector         : {clean_sector(sector)}
- Fuel Type      : {fuel}
- Year           : {year}
- CO2 Emissions  : {co2_mmt:.4f} Million Metric Tons
- Emission Level : {level}

Based ONLY on the policy documents above, provide 5 specific recommendations
for the {clean_sector(sector)} sector in {state} using {fuel} to reduce CO2 emissions.
Cite each source document by name. Be concise and research-paper appropriate."""


def build_chatbot_prompt(
    user_query: str,
    chunks: list[PolicyChunk],
    emission_context: str = "",
) -> str:
    context_str = ""
    for i, c in enumerate(chunks, 1):
        context_str += f"\n[Source {i}: {c.source}]\n{c.content}\n"

    return (
        f"RETRIEVED POLICY DOCUMENTS:\n{context_str}\n"
        f"{emission_context}"
        f"USER QUESTION: {user_query}\n\n"
        "Based ONLY on the policy documents provided above, answer the user's question. "
        "Cite the source document name for every piece of information. "
        "If the context is insufficient, state that you don't have enough information."
    )


# ── LLM Generation ─────────────────────────────────────────────────────────────

def _call_ollama(prompt: str, model: str) -> str:
    try:
        response = ollama.chat(
            model=model,
            messages=[
                {"role": "system", "content": SYSTEM_CONTEXT},
                {"role": "user",   "content": prompt},
            ],
            options={
                "temperature": settings.OLLAMA_TEMPERATURE,
                "num_predict": settings.OLLAMA_MAX_TOKENS,
            },
        )
        return response["message"]["content"]
    except Exception as e:
        logger.error(f"Ollama call failed: {e}")
        raise RuntimeError(
            f"LLM generation failed. Ensure Ollama is running at {settings.OLLAMA_BASE_URL} "
            f"and the model '{model}' is pulled. Error: {e}"
        )


# ── Public Service Functions ───────────────────────────────────────────────────

def get_policy_advice(
    state: str,
    sector: str,
    fuel: str,
    year: int,
    co2_mmt: float,
    emission_level: str,
    model: Optional[str] = None,
) -> tuple[str, list[PolicyChunk]]:
    """
    Runs the full RAG pipeline for structured emission advice.
    Returns (advice_text, retrieved_chunks).
    """
    llm_model = model or settings.OLLAMA_MODEL
    query = f"{clean_sector(sector)} sector {fuel} CO2 emissions reduction regulations"
    chunks = retrieve_chunks(query, k=settings.RAG_TOP_K)
    prompt = build_structured_prompt(state, sector, fuel, year, co2_mmt, emission_level, chunks)
    advice = _call_ollama(prompt, llm_model)
    logger.info(f"RAG advice generated for {state}/{clean_sector(sector)}/{fuel} ({year})")
    return advice, chunks


def rag_chatbot_query(request: RAGQueryRequest) -> RAGQueryResponse:
    """
    Handles a free-form user query.
    Optionally parses CO2 values mentioned in the query to enrich context.
    """
    query = request.query
    model = request.model or settings.OLLAMA_MODEL

    # Extract CO2 value if mentioned in the query
    co2_mmt: Optional[float] = None
    emission_context = ""
    match = re.search(r"(\d+\.?\d*)\s*(MMT|million metric tons|metric tons)", query, re.IGNORECASE)
    if match:
        val = float(match.group(1))
        unit = match.group(2).lower()
        co2_mmt = val / 1_000_000 if unit == "metric tons" else val

        from app.services.offset_service import calculate_offset_raw
        from app.services.classification_service import classify_emission_raw
        level, _, _ = classify_emission_raw(co2_mmt)
        offset = calculate_offset_raw(co2_mmt)

        emission_context = (
            f"\nEMISSION DATA FROM USER QUERY:\n"
            f"- CO2 Emissions  : {co2_mmt:.4f} Million Metric Tons\n"
            f"- Emission Level : {level}\n"
            f"- Trees needed   : {offset['trees_needed']:,}\n"
            f"- Wind turbines  : {offset['wind_turbines']:,}\n"
            f"- Solar (MW)     : {offset['solar_capacity_mw']:,}\n\n"
        )

    chunks = retrieve_chunks(query, k=request.top_k)
    prompt = build_chatbot_prompt(query, chunks, emission_context)
    answer = _call_ollama(prompt, model)

    return RAGQueryResponse(
        query=query,
        answer=answer,
        sources=chunks,
        co2_mmt_detected=co2_mmt,
    )
