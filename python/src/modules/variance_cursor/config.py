"""
Configuration for the variance_cursor module.
"""

DESCRIPTION = "Calculates variance and related statistical measures for numerical data"
VERSION = "1.0.0"
AUTHOR = "AI Assistant"

PARAMETERS = {
    "precision": 4,
    "include_sample_variance": True,
    "include_population_variance": True,
    "ddof": 1  # Delta degrees of freedom for sample variance calculation
}
