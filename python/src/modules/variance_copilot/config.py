"""Configuration for variance computation module."""

DESCRIPTION = "Computes variance and related statistical measures for numerical data"
VERSION = "1.0.0"
AUTHOR = "GitHub Copilot"

PARAMETERS = {
    "precision": 4,
    "include_sample_variance": True,
    "include_population_variance": True,
    "include_standard_deviation": True,
    "include_coefficient_variation": True,
    "ddof": 1,  # Delta degrees of freedom for sample variance
    "columns_to_analyze": ["value", "score", "count"]
}