"""
Business logic for emission severity classification.
Mirrors classify_emission() from the original notebook.
"""

import logging
from app.schemas.classification import ClassifyRequest, ClassifyResponse

logger = logging.getLogger("carbon_api.classification_service")

# (label, color, min_inclusive, max_exclusive_or_None, threshold_info)
LEVELS = [
    ("Low",      "green",   0.0,  5.0,  "Below 5 MMT — within manageable limits"),
    ("Moderate", "orange",  5.0,  25.0, "5–25 MMT — action plans recommended"),
    ("High",     "red",     25.0, 75.0, "25–75 MMT — immediate reduction measures required"),
    ("Critical", "darkred", 75.0, None, "Above 75 MMT — emergency intervention needed"),
]

DESCRIPTIONS = {
    "Low":      "Emissions are within acceptable thresholds. Continue monitoring and best practices.",
    "Moderate": "Emissions are elevated. Implement energy efficiency and renewable transition plans.",
    "High":     "Emissions are significantly above targets. Regulatory compliance action is required.",
    "Critical": "Emissions are at crisis level. Immediate industrial decarbonization measures are essential.",
}


def classify_emission_raw(co2_mmt: float) -> tuple[str, str, str]:
    """Returns (level, color, threshold_info) — used internally by other services."""
    for label, color, lo, hi, threshold_info in LEVELS:
        if hi is None or co2_mmt < hi:
            if co2_mmt >= lo:
                return label, color, threshold_info
    return "Critical", "darkred", "Above 75 MMT — emergency intervention needed"


def classify_emission(request: ClassifyRequest) -> ClassifyResponse:
    co2_mmt = request.co2_mmt
    level, color, threshold_info = classify_emission_raw(co2_mmt)
    logger.info(f"Classified {co2_mmt:.4f} MMT -> {level}")
    return ClassifyResponse(
        co2_mmt=co2_mmt,
        level=level,
        color=color,
        description=DESCRIPTIONS[level],
        threshold_info=threshold_info,
    )
