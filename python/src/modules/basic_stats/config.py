"""Configuration for basic statistics analysis module."""

DESCRIPTION = "Calculates basic statistical measures for numerical columns"
VERSION = "1.0.0"
AUTHOR = "AI Assistant"

PARAMETERS = {
    "precision": 3,
    "include_outliers": True,
    "columns_to_analyze": ["value", "score", "count"]
}
