"""Data models and validation for variance computation module."""

import pandas as pd
import numpy as np
from typing import Any, Dict, List


def validate_input(data: pd.DataFrame) -> bool:
    """
    Validate that input data has numerical columns for variance computation.
    
    Args:
        data: Input pandas DataFrame
        
    Returns:
        bool: True if data is valid for variance analysis
    """
    if data.empty:
        return False
    
    # Check if there are any numerical columns
    numerical_cols = data.select_dtypes(include=[np.number]).columns
    if len(numerical_cols) == 0:
        return False
    
    # Check if we have at least 2 rows for meaningful variance calculation
    if len(data) < 2:
        return False
    
    return True


def prepare_data(data: pd.DataFrame) -> pd.DataFrame:
    """
    Clean and prepare data for variance analysis.
    
    Args:
        data: Input pandas DataFrame
        
    Returns:
        pd.DataFrame: Cleaned data ready for variance computation
    """
    # Select only numerical columns
    numerical_data = data.select_dtypes(include=[np.number])
    
    # Remove columns that are entirely NaN
    clean_data = numerical_data.dropna(axis=1, how='all')
    
    # Convert to numeric, forcing errors to NaN
    for col in clean_data.columns:
        clean_data[col] = pd.to_numeric(clean_data[col], errors='coerce')
    
    return clean_data


def validate_output(result: Dict[str, Any]) -> bool:
    """
    Validate variance analysis results.
    
    Args:
        result: Results dictionary from variance analysis
        
    Returns:
        bool: True if results are valid
    """
    required_keys = ['module', 'description', 'variance_results', 'columns_analyzed']
    
    # Check if all required keys are present
    if not all(key in result for key in required_keys):
        return False
    
    # Check if variance_results is a dictionary
    if not isinstance(result['variance_results'], dict):
        return False
    
    # Check if columns_analyzed is a list
    if not isinstance(result['columns_analyzed'], list):
        return False
    
    return True


def format_output(result: Dict[str, Any]) -> Dict[str, Any]:
    """
    Format variance analysis results for display.
    
    Args:
        result: Raw results dictionary
        
    Returns:
        Dict[str, Any]: Formatted results
    """
    formatted = result.copy()
    
    # Round numerical values in variance_results for better display
    if 'variance_results' in formatted:
        for col, stats in formatted['variance_results'].items():
            if isinstance(stats, dict):
                for stat, value in stats.items():
                    if isinstance(value, (float, np.floating)) and not np.isnan(value):
                        stats[stat] = round(float(value), 4)
    
    return formatted


def calculate_coefficient_of_variation(mean: float, std: float) -> float:
    """
    Calculate coefficient of variation (CV = std/mean * 100).
    
    Args:
        mean: Mean value
        std: Standard deviation
        
    Returns:
        float: Coefficient of variation as percentage
    """
    if mean == 0:
        return float('inf') if std > 0 else 0.0
    return abs(std / mean) * 100


def interpret_variance_level(variance: float, mean: float) -> str:
    """
    Provide interpretation of variance level relative to the mean.
    
    Args:
        variance: Variance value
        mean: Mean value
        
    Returns:
        str: Interpretation of variance level
    """
    if mean == 0:
        return "undefined (mean is zero)"
    
    cv = calculate_coefficient_of_variation(mean, np.sqrt(variance))
    
    if cv < 10:
        return "low variability"
    elif cv < 30:
        return "moderate variability"
    elif cv < 50:
        return "high variability"
    else:
        return "very high variability"