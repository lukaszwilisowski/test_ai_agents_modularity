"""Configuration for correlation analysis module."""

DESCRIPTION = "Analyzes correlations between numerical variables"
VERSION = "1.0.0"
AUTHOR = "AI Assistant"

PARAMETERS = {
    "method": "pearson",  # pearson, spearman, kendall
    "min_correlation": 0.1,  # minimum correlation to report
    "precision": 3,
    "columns_to_analyze": ["value", "score", "count"]
}
