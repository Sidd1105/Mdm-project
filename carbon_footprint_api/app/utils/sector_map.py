"""
Maps verbose dataset sector names to clean, human-readable labels.
Mirrors the SECTOR_MAP from the original notebook.
"""

SECTOR_MAP: dict[str, str] = {
    "Industrial carbon dioxide emissions": "Industrial",
    "Total carbon dioxide emissions from all sectors": "All Sectors",
    "Commercial carbon dioxide emissions": "Commercial",
    "Residential carbon dioxide emissions": "Residential",
    "Transportation carbon dioxide emissions": "Transportation",
    "Electric Power carbon dioxide emissions": "Electric Power",
    "Coal Mining carbon dioxide emissions": "Coal Mining",
    "Natural Gas Systems carbon dioxide emissions": "Natural Gas",
    "Petroleum Systems carbon dioxide emissions": "Petroleum",
    "Agriculture carbon dioxide emissions": "Agriculture",
    "Waste carbon dioxide emissions": "Waste Management",
}

# Valid values for validation
VALID_FUEL_NAMES = [
    "Coal", "Natural Gas", "Petroleum", "Geothermal", "Hydroelectric",
    "Nuclear", "Solar", "Wind", "Biomass", "Other Gases",
]

VALID_STATE_NAMES = [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
    "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
    "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
    "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota",
    "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
    "New Hampshire", "New Jersey", "New Mexico", "New York",
    "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon",
    "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
    "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington",
    "West Virginia", "Wisconsin", "Wyoming", "United States",
]


def clean_sector(sector_name: str) -> str:
    """Map verbose sector name to clean label, fallback to first meaningful words."""
    if sector_name in SECTOR_MAP:
        return SECTOR_MAP[sector_name]
    words = sector_name.replace("carbon dioxide emissions", "").strip()
    return words if words else sector_name


def get_all_sectors() -> list[str]:
    return list(SECTOR_MAP.keys())


def get_all_clean_sectors() -> list[str]:
    return list(SECTOR_MAP.values())
