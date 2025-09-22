"""Data models and validation for basic statistics module."""

import pandas as pd
from typing import Any, Dict, List


def validate_input(data: pd.DataFrame) -> bool:
    """Validate that input data has required numerical columns."""
    required_columns = ['value', 'score', 'count']
    return all(col in data.columns for col in required_columns)


def prepare_data(data: pd.DataFrame) -> pd.DataFrame:
    """Clean and prepare data for statistical analysis."""
    # Remove rows with missing values in numerical columns
    numerical_cols = ['value', 'score', 'count']
    clean_data = data.dropna(subset=numerical_cols)
    
    # Ensure numerical columns are numeric
    for col in numerical_cols:
        clean_data[col] = pd.to_numeric(clean_data[col], errors='coerce')
    
    # Remove any rows that couldn't be converted to numeric
    clean_data = clean_data.dropna(subset=numerical_cols)
    
    return clean_data


def validate_output(result: Dict[str, Any]) -> bool:
    """Validate analysis results."""
    required_keys = ['summary_stats', 'total_records', 'columns_analyzed']
    return all(key in result for key in required_keys)


def format_output(result: Dict[str, Any]) -> Dict[str, Any]:
    """Format results for display."""
    formatted = result.copy()
    
    # Round numerical values for better display
    if 'summary_stats' in formatted:
        for col, stats in formatted['summary_stats'].items():
            for stat, value in stats.items():
                if isinstance(value, float):
                    stats[stat] = round(value, 3)
    
    return formatted
