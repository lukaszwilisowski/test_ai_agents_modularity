"""Configuration for outlier detection module."""

DESCRIPTION = "Detects statistical outliers using IQR and Z-score methods"
VERSION = "1.0.0"
AUTHOR = "AI Assistant"

PARAMETERS = {
    "iqr_multiplier": 1.5,  # IQR multiplier for outlier detection
    "zscore_threshold": 2.5,  # Z-score threshold for outlier detection
    "methods": ["iqr", "zscore"],  # Methods to use: iqr, zscore, or both
    "columns_to_analyze": ["value", "score", "count"],
    "precision": 3
}
