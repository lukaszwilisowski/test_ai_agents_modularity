"""Main execution logic for variance computation module."""

import pandas as pd
import numpy as np
from typing import Any, Dict


def analyze(dataset: pd.DataFrame, model: Any, config: Any) -> Dict[str, Any]:
    """
    Perform comprehensive variance analysis on the dataset.
    
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
    
    if len(clean_data) == 0:
        raise ValueError("No valid numerical data remaining after cleaning")
    
    # Get configuration parameters
    precision = getattr(config, 'PARAMETERS', {}).get('precision', 4)
    include_sample = getattr(config, 'PARAMETERS', {}).get('include_sample_variance', True)
    include_population = getattr(config, 'PARAMETERS', {}).get('include_population_variance', True)
    include_std = getattr(config, 'PARAMETERS', {}).get('include_standard_deviation', True)
    include_cv = getattr(config, 'PARAMETERS', {}).get('include_coefficient_variation', True)
    ddof = getattr(config, 'PARAMETERS', {}).get('ddof', 1)
    columns_to_analyze = getattr(config, 'PARAMETERS', {}).get('columns_to_analyze', None)
    
    # Filter columns if specified in config
    if columns_to_analyze:
        available_columns = [col for col in columns_to_analyze if col in clean_data.columns]
        if available_columns:
            clean_data = clean_data[available_columns]
    
    # Perform variance analysis for each numerical column
    variance_results = {}
    
    for column in clean_data.columns:
        col_data = clean_data[column].dropna()  # Remove NaN values for this column
        
        if len(col_data) < 2:
            # Cannot calculate meaningful variance with less than 2 data points
            variance_results[column] = {
                'sample_variance': None,
                'population_variance': None,
                'sample_std': None,
                'population_std': None,
                'coefficient_of_variation': None,
                'count': len(col_data),
                'mean': None,
                'interpretation': 'insufficient data',
                'error': 'Insufficient data points for variance calculation (need at least 2)'
            }
            continue
        
        # Calculate basic statistics
        mean_val = col_data.mean()
        min_val = col_data.min()
        max_val = col_data.max()
        count = len(col_data)
        
        # Initialize column results
        col_results = {
            'count': count,
            'mean': round(mean_val, precision),
            'min': round(min_val, precision),
            'max': round(max_val, precision),
            'range': round(max_val - min_val, precision)
        }
        
        # Calculate sample variance and standard deviation
        if include_sample:
            sample_var = col_data.var(ddof=ddof)
            sample_std = np.sqrt(sample_var)
            col_results['sample_variance'] = round(sample_var, precision)
            if include_std:
                col_results['sample_std'] = round(sample_std, precision)
            
            # Use sample std for coefficient of variation by default
            if include_cv and not np.isnan(sample_std):
                cv = model.calculate_coefficient_of_variation(mean_val, sample_std)
                col_results['coefficient_of_variation'] = round(cv, precision)
        
        # Calculate population variance and standard deviation
        if include_population:
            pop_var = col_data.var(ddof=0)
            pop_std = np.sqrt(pop_var)
            col_results['population_variance'] = round(pop_var, precision)
            if include_std:
                col_results['population_std'] = round(pop_std, precision)
        
        # Add interpretation of variance level
        if include_sample and 'sample_variance' in col_results:
            interpretation = model.interpret_variance_level(col_results['sample_variance'], mean_val)
            col_results['interpretation'] = interpretation
        elif include_population and 'population_variance' in col_results:
            interpretation = model.interpret_variance_level(col_results['population_variance'], mean_val)
            col_results['interpretation'] = interpretation
        
        # Additional statistical measures
        col_results['median'] = round(col_data.median(), precision)
        col_results['q25'] = round(col_data.quantile(0.25), precision)
        col_results['q75'] = round(col_data.quantile(0.75), precision)
        col_results['iqr'] = round(col_results['q75'] - col_results['q25'], precision)
        
        variance_results[column] = col_results
    
    # Calculate overall dataset statistics
    total_variance_cols = len([col for col, stats in variance_results.items() 
                              if stats.get('sample_variance') is not None])
    
    # Compile final results
    results = {
        'module': 'variance_copilot',
        'description': getattr(config, 'DESCRIPTION', 'Variance computation module'),
        'version': getattr(config, 'VERSION', '1.0.0'),
        'author': getattr(config, 'AUTHOR', 'GitHub Copilot'),
        'columns_analyzed': list(variance_results.keys()),
        'total_columns': len(variance_results),
        'valid_variance_columns': total_variance_cols,
        'variance_results': variance_results,
        'dataset_summary': {
            'original_rows': len(dataset),
            'clean_rows': len(clean_data),
            'original_columns': len(dataset.columns),
            'numerical_columns': len(clean_data.columns)
        },
        'parameters_used': {
            'precision': precision,
            'include_sample_variance': include_sample,
            'include_population_variance': include_population,
            'include_standard_deviation': include_std,
            'include_coefficient_variation': include_cv,
            'ddof': ddof,
            'columns_filter': columns_to_analyze
        }
    }
    
    # Validate and format output
    if not model.validate_output(results):
        raise ValueError("Generated results failed validation")
    
    results = model.format_output(results)
    
    return results