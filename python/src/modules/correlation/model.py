"""Data models and validation for correlation analysis module."""

import pandas as pd
import numpy as np
from typing import Any, Dict, List


def validate_input(data: pd.DataFrame) -> bool:
    """Validate that input data has at least 2 numerical columns for correlation."""
    numerical_cols = ['value', 'score', 'count']
    available_cols = [col for col in numerical_cols if col in data.columns]
    return len(available_cols) >= 2


def prepare_data(data: pd.DataFrame) -> pd.DataFrame:
    """Clean and prepare data for correlation analysis."""
    # Get numerical columns
    numerical_cols = ['value', 'score', 'count']
    available_cols = [col for col in numerical_cols if col in data.columns]
    
    # Select only numerical columns and remove missing values
    clean_data = data[available_cols].copy()
    
    # Convert to numeric
    for col in available_cols:
        clean_data[col] = pd.to_numeric(clean_data[col], errors='coerce')
    
    # Remove rows with any missing values
    clean_data = clean_data.dropna()
    
    return clean_data


def validate_output(result: Dict[str, Any]) -> bool:
    """Validate correlation analysis results."""
    required_keys = ['correlation_matrix', 'significant_correlations', 'total_records']
    return all(key in result for key in required_keys)


def format_correlation_pairs(corr_matrix: pd.DataFrame, min_correlation: float = 0.1) -> List[Dict[str, Any]]:
    """Format correlation matrix into significant correlation pairs."""
    pairs = []
    
    for i, col1 in enumerate(corr_matrix.columns):
        for j, col2 in enumerate(corr_matrix.columns):
            if i < j:  # Only upper triangle to avoid duplicates
                correlation = corr_matrix.loc[col1, col2]
                if abs(correlation) >= min_correlation:
                    pairs.append({
                        'variable_1': col1,
                        'variable_2': col2,
                        'correlation': round(float(correlation), 3),
                        'strength': _get_correlation_strength(abs(correlation))
                    })
    
    # Sort by absolute correlation value (descending)
    pairs.sort(key=lambda x: abs(x['correlation']), reverse=True)
    return pairs


def _get_correlation_strength(abs_correlation: float) -> str:
    """Categorize correlation strength."""
    if abs_correlation >= 0.7:
        return "strong"
    elif abs_correlation >= 0.4:
        return "moderate"
    elif abs_correlation >= 0.1:
        return "weak"
    else:
        return "very_weak"
