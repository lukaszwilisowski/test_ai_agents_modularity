import pandas as pd
import numpy as np
from typing import Any, Dict

def analyze(dataset: pd.DataFrame, model: Any, config: Any) -> Dict[str, Any]:
    """Calculate variance and related statistical measures for the dataset."""

    # Validate input
    if not model.validate_input(dataset):
        raise ValueError("Invalid input data: No numeric columns found or dataset is empty")

    # Prepare data
    clean_data = model.prepare_data(dataset)

    if clean_data.empty:
        raise ValueError("No valid numeric data remaining after cleaning")

    # Get configuration parameters
    ddof = config.PARAMETERS.get('ddof', 1)
    precision = config.PARAMETERS.get('precision', 4)
    include_std = config.PARAMETERS.get('include_std', True)
    include_population_variance = config.PARAMETERS.get('include_population_variance', False)

    # Calculate variance for each numeric column
    column_results = {}
    overall_results = {}

    for column in clean_data.columns:
        col_data = clean_data[column].dropna()

        if len(col_data) > 0:
            # Sample variance (ddof=1) or population variance (ddof=0)
            variance = col_data.var(ddof=ddof)
            col_result = {
                'variance': variance,
                'count': len(col_data),
                'mean': col_data.mean()
            }

            if include_std:
                col_result['std'] = col_data.std(ddof=ddof)

            if include_population_variance and ddof != 0:
                col_result['population_variance'] = col_data.var(ddof=0)

            column_results[column] = col_result

    # Calculate overall statistics if multiple columns
    if len(clean_data.columns) > 1:
        # Flatten all numeric values
        all_values = clean_data.values.flatten()
        all_values = all_values[~np.isnan(all_values)]

        if len(all_values) > 0:
            overall_variance = np.var(all_values, ddof=ddof)
            overall_results = {
                'overall_variance': overall_variance,
                'overall_count': len(all_values),
                'overall_mean': np.mean(all_values)
            }

            if include_std:
                overall_results['overall_std'] = np.std(all_values, ddof=ddof)

            if include_population_variance and ddof != 0:
                overall_results['overall_population_variance'] = np.var(all_values, ddof=0)

    # Compile final results
    results = {
        'variance': column_results,
        'summary': {
            'total_columns': len(column_results),
            'ddof': ddof,
            'precision': precision
        }
    }

    if overall_results:
        results['overall'] = overall_results

    # Apply precision formatting
    if hasattr(config, 'PARAMETERS'):
        precision = config.PARAMETERS.get('precision', 4)
        for column, values in results['variance'].items():
            for key, value in values.items():
                if isinstance(value, float):
                    results['variance'][column][key] = round(value, precision)

        if 'overall' in results:
            for key, value in results['overall'].items():
                if isinstance(value, float):
                    results['overall'][key] = round(value, precision)

    return results