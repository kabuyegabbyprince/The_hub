# The Hub — Deterministic & Explainable Recommendation Engine

## Core Formula

> USER GOAL + USER SKILLS + ASSESSMENT + SKILL REQUIREMENTS + NISR/LABOUR-MARKET CONTEXT → DATA-INFORMED LEARNING PATHWAY

Recommendations in The Hub are strictly **deterministic, transparent, and explainable**, supplemented by an optional AI advisory layer.

## 1. Skill Gap Calculation

1. **Target Benchmark**: Each learning pathway defines a target skill profile with required proficiency scores (scale 0–100).
   - Example: *Data Analyst*
     - Excel: 80
     - Statistics: 70
     - SQL: 75
     - Python: 60
     - Data Visualization: 65

2. **User Benchmark**: Derived from verified assessments and self-assessment scores.
   - Example:
     - Excel: 75 → Gap: 5 (Low)
     - Statistics: 40 → Gap: 30 (Medium)
     - SQL: 10 → Gap: 65 (High)
     - Python: 20 → Gap: 40 (High)
     - Data Visualization: 30 → Gap: 35 (Medium)

3. **Gap Classification**:
   - `High Gap` (>= 40 delta): Prioritized early in the pathway.
   - `Medium Gap` (20-39 delta): Scheduled for intermediate modules.
   - `Low Gap` (< 20 delta): Brief refresher or optional deep dive.

## 2. Labour Market Context Weighting (NISR)

Indicators from the National Institute of Statistics of Rwanda provide socioeconomic context:
- High demand sectors (Services, ICT, Agribusiness, Tourism) adjust priority weights by $+10\%$.
- Context is clearly documented:
  > *"Services account for a significant share of Rwanda's economic growth (NISR). The Hub incorporates this context into prioritization; it does NOT guarantee employment."*

## 3. Explainability Contract

Every recommendation returns a structured reasoning payload:
```json
{
  "skill": "SQL",
  "priority": "High",
  "gap_score": 65,
  "reason": "Your assessment score (10/100) indicates a high gap against the target proficiency (75/100) for Data Analysis.",
  "labour_market_context": "Database and data management skills are increasingly required across Rwanda's digital and financial services sectors (NISR).",
  "recommended_course": "SQL Fundamentals",
  "estimated_time_to_bridge": "12 hours"
}
```
