"""Main execution logic for basic statistics analysis."""

import pandas as pd
from typing import Any, Dict


def analyze(dataset: pd.DataFrame, model: Any, config: Any) -> Dict[str, Any]:
    """
    Calculate basic statistics for numerical columns in the dataset.
    
    Args:
        dataset: Input pandas DataFrame
        model: Loaded model module
        config: Loaded config module
        
    Returns:
        Dictionary containing statistical analysis results
    """
    
    # Validate input
    if not model.validate_input(dataset):
        raise ValueError("Dataset missing required columns: value, score, count")
    
    # Prepare data
    clean_data = model.prepare_data(dataset)
    
    if len(clean_data) == 0:
        raise ValueError("No valid data remaining after cleaning")
    
    # Get columns to analyze from config
    columns_to_analyze = getattr(config, 'PARAMETERS', {}).get(
        'columns_to_analyze', ['value', 'score', 'count']
    )
    
    # Calculate statistics for each column
    summary_stats = {}
    for col in columns_to_analyze:
        if col in clean_data.columns:
            column_data = clean_data[col]
            summary_stats[col] = {
                'mean': float(column_data.mean()),
                'median': float(column_data.median()),
                'std': float(column_data.std()),
                'min': float(column_data.min()),
                'max': float(column_data.max()),
                'count': int(column_data.count()),
                'q25': float(column_data.quantile(0.25)),
                'q75': float(column_data.quantile(0.75))
            }
    
    # Prepare results
    results = {
        'module': 'basic_stats',
        'description': config.DESCRIPTION,
        'summary_stats': summary_stats,
        'total_records': len(dataset),
        'clean_records': len(clean_data),
        'columns_analyzed': list(summary_stats.keys())
    }
    
    # Apply precision from config
    precision = getattr(config, 'PARAMETERS', {}).get('precision', 3)
    for col, stats in results['summary_stats'].items():
        for key, value in stats.items():
            if isinstance(value, float):
                stats[key] = round(value, precision)
    
    # Validate output
    if not model.validate_output(results):
        raise ValueError("Generated results failed validation")
    
    return results
