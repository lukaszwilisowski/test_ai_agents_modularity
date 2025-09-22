"""Main execution logic for outlier detection analysis."""

import pandas as pd
from typing import Any, Dict, List, Set


def analyze(dataset: pd.DataFrame, model: Any, config: Any) -> Dict[str, Any]:
    """
    Perform outlier detection on numerical columns in the dataset.
    
    Args:
        dataset: Input pandas DataFrame
        model: Loaded model module
        config: Loaded config module
        
    Returns:
        Dictionary containing outlier detection results
    """
    
    # Validate input
    if not model.validate_input(dataset):
        raise ValueError("Dataset missing numerical columns for outlier detection")
    
    # Prepare data
    clean_data = model.prepare_data(dataset)
    
    if len(clean_data) < 3:
        raise ValueError("Need at least 3 records for meaningful outlier detection")
    
    # Get parameters from config
    iqr_multiplier = getattr(config, 'PARAMETERS', {}).get('iqr_multiplier', 1.5)
    zscore_threshold = getattr(config, 'PARAMETERS', {}).get('zscore_threshold', 2.5)
    methods = getattr(config, 'PARAMETERS', {}).get('methods', ['iqr', 'zscore'])
    precision = getattr(config, 'PARAMETERS', {}).get('precision', 3)
    columns_to_analyze = getattr(config, 'PARAMETERS', {}).get(
        'columns_to_analyze', ['value', 'score', 'count']
    )
    
    # Filter to available columns
    available_cols = [col for col in columns_to_analyze if col in clean_data.columns]
    
    if not available_cols:
        raise ValueError("No analyzable columns found in the dataset")
    
    # Results storage
    outliers_by_column = {}
    all_outlier_indices = set()
    
    # Analyze each column
    for column in available_cols:
        column_data = clean_data[column]
        column_outliers = {
            'column': column,
            'methods': {}
        }
        
        # IQR method
        if 'iqr' in methods:
            iqr_outliers, iqr_bounds = model.detect_outliers_iqr(column_data, iqr_multiplier)
            column_outliers['methods']['iqr'] = {
                'outlier_indices': iqr_outliers,
                'outlier_count': len(iqr_outliers),
                'bounds': iqr_bounds,
                'outliers': model.format_outlier_details(clean_data, iqr_outliers, column)
            }
            all_outlier_indices.update(iqr_outliers)
        
        # Z-score method
        if 'zscore' in methods:
            zscore_outliers, zscore_stats = model.detect_outliers_zscore(column_data, zscore_threshold)
            column_outliers['methods']['zscore'] = {
                'outlier_indices': zscore_outliers,
                'outlier_count': len(zscore_outliers),
                'statistics': zscore_stats,
                'outliers': model.format_outlier_details(clean_data, zscore_outliers, column)
            }
            all_outlier_indices.update(zscore_outliers)
        
        outliers_by_column[column] = column_outliers
    
    # Calculate summary statistics
    total_outliers = len(all_outlier_indices)
    outlier_percentage = (total_outliers / len(clean_data)) * 100 if len(clean_data) > 0 else 0
    
    # Count outliers per method across all columns
    method_summary = {}
    for method in methods:
        method_outliers = set()
        for col_data in outliers_by_column.values():
            if method in col_data['methods']:
                method_outliers.update(col_data['methods'][method]['outlier_indices'])
        method_summary[method] = {
            'total_outliers': len(method_outliers),
            'percentage': (len(method_outliers) / len(clean_data)) * 100 if len(clean_data) > 0 else 0
        }
    
    # Round percentages
    outlier_percentage = round(outlier_percentage, precision)
    for method_data in method_summary.values():
        method_data['percentage'] = round(method_data['percentage'], precision)
    
    # Prepare results
    results = {
        'module': 'outlier_detection',
        'description': config.DESCRIPTION,
        'methods_used': methods,
        'parameters': {
            'iqr_multiplier': iqr_multiplier,
            'zscore_threshold': zscore_threshold
        },
        'outliers_by_column': outliers_by_column,
        'summary': {
            'total_unique_outliers': total_outliers,
            'outlier_percentage': outlier_percentage,
            'method_summary': method_summary,
            'columns_analyzed': available_cols
        },
        'total_records': len(dataset),
        'clean_records': len(clean_data)
    }
    
    # Validate output
    if not model.validate_output(results):
        raise ValueError("Generated results failed validation")
    
    return results
