"""
Main execution logic for variance analysis.
"""

import pandas as pd
import numpy as np
from typing import Any, Dict


def analyze(dataset: pd.DataFrame, model: Any, config: Any) -> Dict[str, Any]:
    """
    Perform variance analysis on the dataset.
    
    Args:
        dataset: Input pandas DataFrame
        model: Loaded model module
        config: Loaded config module
        
    Returns:
        Dictionary containing variance analysis results
    """
    # Validate input
    if not model.validate_input(dataset):
        raise ValueError("Invalid input data: Dataset must contain numerical data with at least 2 rows")
    
    # Prepare data
    clean_data = model.prepare_data(dataset)
    
    # Get configuration parameters
    precision = getattr(config, 'PARAMETERS', {}).get('precision', 4)
    include_sample = getattr(config, 'PARAMETERS', {}).get('include_sample_variance', True)
    include_population = getattr(config, 'PARAMETERS', {}).get('include_population_variance', True)
    ddof = getattr(config, 'PARAMETERS', {}).get('ddof', 1)
    
    # Perform variance analysis for each numerical column
    variance_results = {}
    
    for column in clean_data.columns:
        col_data = clean_data[column].dropna()  # Remove NaN values for this column
        
        if len(col_data) < 2:
            # Cannot calculate meaningful variance with less than 2 data points
            variance_results[column] = {
                'sample_variance': None,
                'population_variance': None,
                'standard_deviation': None,
                'count': len(col_data),
                'error': 'Insufficient data points for variance calculation'
            }
            continue
        
        # Calculate variances
        col_results = {
            'count': len(col_data),
            'mean': col_data.mean()
        }
        
        if include_sample:
            sample_var = col_data.var(ddof=ddof)  # Sample variance (default ddof=1)
            col_results['sample_variance'] = round(sample_var, precision)
            col_results['sample_std'] = round(np.sqrt(sample_var), precision)
        
        if include_population:
            pop_var = col_data.var(ddof=0)  # Population variance (ddof=0)
            col_results['population_variance'] = round(pop_var, precision)
            col_results['population_std'] = round(np.sqrt(pop_var), precision)
        
        # Additional statistics
        col_results['min'] = round(col_data.min(), precision)
        col_results['max'] = round(col_data.max(), precision)
        col_results['range'] = round(col_data.max() - col_data.min(), precision)
        col_results['mean'] = round(col_results['mean'], precision)
        
        variance_results[column] = col_results
    
    # Compile final results
    results = {
        'module': 'variance_cursor',
        'description': getattr(config, 'DESCRIPTION', 'Variance analysis'),
        'version': getattr(config, 'VERSION', '1.0.0'),
        'columns_analyzed': list(variance_results.keys()),
        'total_columns': len(variance_results),
        'variance_results': variance_results,
        'parameters_used': {
            'precision': precision,
            'include_sample_variance': include_sample,
            'include_population_variance': include_population,
            'ddof': ddof
        }
    }
    
    # Validate and format output
    if hasattr(model, 'validate_output'):
        if not model.validate_output(results):
            raise ValueError("Generated results failed validation")
    
    if hasattr(model, 'format_output'):
        results = model.format_output(results)
    
    return results
