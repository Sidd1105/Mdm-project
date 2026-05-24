"""
Shared constants used across services.
"""

# ── RAG System Prompt ─────────────────────────────────────────────────────────

SYSTEM_CONTEXT = """You are an AI Carbon Emission Advisor specialized in environmental
policy compliance and sustainability for the US energy and industrial sector.
You operate as part of a Retrieval-Augmented Generation (RAG) system for an academic
research project on AI-driven carbon emission prediction and policy recommendation.

ROLE:
You assist in understanding CO2 emission levels by US state, sector, and fuel type,
and provide actionable policy-grounded recommendations to reduce emissions.

KNOWLEDGE BASE:
Answer exclusively using the policy documents retrieved and provided to you.
These include US EPA regulations, Paris Agreement NDC, Inflation Reduction Act,
IPCC reports, DOE sector plans, and supplementary documents provided by the user.
Do not use knowledge outside the provided context.

BEHAVIOR RULES:
1. Cite the source document name for every recommendation.
2. Never fabricate policies, statistics, or regulatory thresholds.
3. If context is insufficient, state that clearly.
4. Keep recommendations specific, numbered, and directly actionable.
5. Tailor advice to the specific sector (Industrial / Transportation / Electric Power etc.)
6. Use formal academic language suitable for a research publication.

OUTPUT FORMAT:
- One-line emission status summary.
- Exactly 5 numbered recommendations, each citing a source document.
- One-line offset summary including the calculated number of trees needed to offset
  the emissions if a CO2 value is provided in the prompt.
"""

# ── Built-in Policy Documents ─────────────────────────────────────────────────

BUILT_IN_POLICIES = [
    {
        "source": "US-EPA-Clean-Air-Act",
        "content": """
        The US EPA Clean Air Act regulates carbon dioxide and greenhouse gas emissions
        from stationary and mobile sources. Industrial facilities emitting above 25,000
        tons CO2 equivalent annually must report under the Greenhouse Gas Reporting
        Program (GHGRP). Major industrial emitters must obtain Title V operating permits.
        New Source Performance Standards (NSPS) set emission limits for power plants,
        cement kilns, steel mills, and chemical manufacturers. The Clean Air Act Section 111
        requires Best System of Emission Reduction (BSER) for new and existing sources.
        Industrial facilities must conduct stack emission tests annually.
        """,
    },
    {
        "source": "US-Clean-Power-Plan-EPA",
        "content": """
        The EPA Clean Power Plan targets carbon dioxide emissions from electric power sector.
        Power plants must reduce CO2 emissions by 32 percent from 2005 levels by 2030.
        States must submit implementation plans showing how they will achieve emission targets.
        Utilities are encouraged to shift from coal to natural gas and renewable energy.
        Energy efficiency programs in commercial and residential sectors count toward targets.
        Carbon trading and offset markets are permitted compliance mechanisms under the plan.
        Coal-fired power plants must install carbon capture and storage or switch fuels.
        """,
    },
    {
        "source": "Paris-Agreement-US-NDC-2021",
        "content": """
        The United States Nationally Determined Contribution commits to reducing greenhouse
        gas emissions 50 to 52 percent below 2005 levels by 2030. All sectors including
        transportation, electric power, industry, and buildings must contribute to reduction.
        The Inflation Reduction Act provides 369 billion dollars in clean energy investments.
        Tax credits are available for renewable energy, electric vehicles, and energy efficiency.
        Industrial decarbonization pathways include hydrogen fuel switching and carbon capture.
        """,
    },
    {
        "source": "US-DOE-Industrial-Decarbonization-Roadmap",
        "content": """
        The US Department of Energy Industrial Decarbonization Roadmap targets five
        energy-intensive industries: chemicals, iron and steel, cement, food and beverage,
        and petroleum refining. Key strategies include energy efficiency improvements,
        industrial electrification, low-carbon fuels and feedstocks, and carbon capture.
        DOE funds research into hydrogen-based steelmaking and electric arc furnace adoption.
        Industrial heat pumps and electrification can reduce process heat emissions by 40 percent.
        Carbon capture and storage is prioritized for cement and steel sectors.
        """,
    },
    {
        "source": "US-Transportation-Climate-Initiative",
        "content": """
        The Transportation Climate Initiative targets greenhouse gas reductions from
        the transportation sector, the largest source of US CO2 emissions.
        States must adopt zero-emission vehicle mandates aligned with California standards.
        Fuel economy standards require new passenger vehicles to average 49 mpg by 2026.
        Aviation sector must blend 3 billion gallons of sustainable aviation fuel by 2030.
        Marine shipping must reduce carbon intensity by 40 percent by 2030 under IMO rules.
        Electric vehicle charging infrastructure investments are prioritized under the IIJA.
        """,
    },
    {
        "source": "US-Forest-Service-Carbon-Sequestration",
        "content": """
        The US Forest Service recommends planting approximately 45 million trees to offset
        1 million tons of CO2 annually. Reforestation projects targeting degraded
        lands and urban areas are prioritized. Incentives for private landowners adopting
        afforestation practices are available through programs like EQIP. Each tree is
        estimated to sequester an average of 22 kilograms of CO2 per year over its growth
        period. Large-scale tree planting initiatives are considered a natural climate
        solution to complement industrial and energy sector decarbonization efforts.
        """,
    },
]

# ── Emission Thresholds (Million Metric Tons) ─────────────────────────────────

EMISSION_THRESHOLDS = {
    "Low": (0, 5),
    "Moderate": (5, 25),
    "High": (25, 75),
    "Critical": (75, float("inf")),
}

# ── Offset Constants ──────────────────────────────────────────────────────────

KG_CO2_PER_TREE_PER_YEAR = 22          # kg CO2 absorbed by one tree per year
TONS_CO2_PER_WIND_TURBINE_PER_YEAR = 4600  # metric tons offset by one wind turbine/yr
TONS_CO2_PER_MW_SOLAR_PER_YEAR = 1100  # metric tons offset per MW solar capacity/yr
TREES_PER_HECTARE = 1000               # average tree density for offset forests
