"""Main execution logic for correlation analysis."""

import pandas as pd
import numpy as np
from typing import Any, Dict


def analyze(dataset: pd.DataFrame, model: Any, config: Any) -> Dict[str, Any]:
    """
    Perform correlation analysis on numerical columns in the dataset.
    
    Args:
        dataset: Input pandas DataFrame
        model: Loaded model module
        config: Loaded config module
        
    Returns:
        Dictionary containing correlation analysis results
    """
    
    # Validate input
    if not model.validate_input(dataset):
        raise ValueError("Dataset needs at least 2 numerical columns for correlation analysis")
    
    # Prepare data
    clean_data = model.prepare_data(dataset)
    
    if len(clean_data) < 2:
        raise ValueError("Need at least 2 records for correlation analysis")
    
    # Get parameters from config
    method = getattr(config, 'PARAMETERS', {}).get('method', 'pearson')
    min_correlation = getattr(config, 'PARAMETERS', {}).get('min_correlation', 0.1)
    precision = getattr(config, 'PARAMETERS', {}).get('precision', 3)
    columns_to_analyze = getattr(config, 'PARAMETERS', {}).get(
        'columns_to_analyze', ['value', 'score', 'count']
    )
    
    # Filter to available columns
    available_cols = [col for col in columns_to_analyze if col in clean_data.columns]
    analysis_data = clean_data[available_cols]
    
    # Calculate correlation matrix
    try:
        corr_matrix = analysis_data.corr(method=method)
    except Exception as e:
        raise ValueError(f"Failed to calculate correlation matrix: {str(e)}")
    
    # Convert to regular dict for JSON serialization
    corr_dict = {}
    for col in corr_matrix.columns:
        corr_dict[col] = {}
        for row in corr_matrix.index:
            value = corr_matrix.loc[row, col]
            if pd.isna(value):
                corr_dict[col][row] = None
            else:
                corr_dict[col][row] = round(float(value), precision)
    
    # Find significant correlations
    significant_correlations = model.format_correlation_pairs(corr_matrix, min_correlation)
    
    # Calculate additional statistics
    correlations_list = []
    for i, col1 in enumerate(corr_matrix.columns):
        for j, col2 in enumerate(corr_matrix.columns):
            if i < j:  # Only upper triangle
                corr_val = corr_matrix.loc[col1, col2]
                if not pd.isna(corr_val):
                    correlations_list.append(abs(corr_val))
    
    avg_correlation = np.mean(correlations_list) if correlations_list else 0
    max_correlation = max(correlations_list) if correlations_list else 0
    
    # Prepare results
    results = {
        'module': 'correlation',
        'description': config.DESCRIPTION,
        'method': method,
        'correlation_matrix': corr_dict,
        'significant_correlations': significant_correlations,
        'statistics': {
            'average_correlation': round(float(avg_correlation), precision),
            'max_correlation': round(float(max_correlation), precision),
            'total_pairs': len(correlations_list),
            'significant_pairs': len(significant_correlations)
        },
        'total_records': len(dataset),
        'clean_records': len(clean_data),
        'columns_analyzed': available_cols
    }
    
    # Validate output
    if not model.validate_output(results):
        raise ValueError("Generated results failed validation")
    
    return results
