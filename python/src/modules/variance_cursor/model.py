"""
Data models and validation logic for variance analysis.
"""

import pandas as pd
import numpy as np
from typing import Any, Dict


def validate_input(data: pd.DataFrame) -> bool:
    """
    Validate that input data has numerical columns for variance calculation.
    
    Args:
        data: Input pandas DataFrame
        
    Returns:
        bool: True if data is valid for variance analysis
    """
    if data.empty:
        return False
    
    # Check if there are any numerical columns
    numerical_columns = data.select_dtypes(include=[np.number]).columns
    if len(numerical_columns) == 0:
        return False
    
    # Check if we have at least 2 data points for meaningful variance
    if len(data) < 2:
        return False
    
    return True


def prepare_data(data: pd.DataFrame) -> pd.DataFrame:
    """
    Clean and prepare data for variance analysis.
    
    Args:
        data: Input pandas DataFrame
        
    Returns:
        pd.DataFrame: Cleaned data ready for analysis
    """
    # Select only numerical columns
    numerical_data = data.select_dtypes(include=[np.number])
    
    # Remove rows with all NaN values
    clean_data = numerical_data.dropna(how='all')
    
    # For each column, remove NaN values for variance calculation
    # This is handled per-column in the analysis phase
    
    return clean_data


def validate_output(result: Dict[str, Any]) -> bool:
    """
    Validate that the analysis results are properly formatted.
    
    Args:
        result: Dictionary containing analysis results
        
    Returns:
        bool: True if results are valid
    """
    required_keys = ['columns_analyzed', 'total_columns']
    
    if not all(key in result for key in required_keys):
        return False
    
    if 'variance_results' in result and not isinstance(result['variance_results'], dict):
        return False
    
    return True


def format_output(result: Dict[str, Any]) -> Dict[str, Any]:
    """
    Format results for better display and readability.
    
    Args:
        result: Raw analysis results
        
    Returns:
        Dict[str, Any]: Formatted results
    """
    formatted = result.copy()
    
    # Add summary information
    if 'variance_results' in formatted:
        variance_data = formatted['variance_results']
        
        # Calculate average variances across all columns
        sample_variances = []
        population_variances = []
        
        for col_data in variance_data.values():
            if 'sample_variance' in col_data and col_data['sample_variance'] is not None:
                sample_variances.append(col_data['sample_variance'])
            if 'population_variance' in col_data and col_data['population_variance'] is not None:
                population_variances.append(col_data['population_variance'])
        
        formatted['summary'] = {
            'avg_sample_variance': np.mean(sample_variances) if sample_variances else None,
            'avg_population_variance': np.mean(population_variances) if population_variances else None,
            'total_valid_columns': len([v for v in variance_data.values() if v['sample_variance'] is not None])
        }
    
    return formatted
