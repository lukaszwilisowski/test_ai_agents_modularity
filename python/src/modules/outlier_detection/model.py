"""Data models and validation for outlier detection module."""

import pandas as pd
import numpy as np
from typing import Any, Dict, List, Tuple


def validate_input(data: pd.DataFrame) -> bool:
    """Validate that input data has required numerical columns."""
    numerical_cols = ['value', 'score', 'count']
    return any(col in data.columns for col in numerical_cols)


def prepare_data(data: pd.DataFrame) -> pd.DataFrame:
    """Clean and prepare data for outlier detection."""
    # Get numerical columns
    numerical_cols = ['value', 'score', 'count']
    available_cols = [col for col in numerical_cols if col in data.columns]
    
    # Select only numerical columns and remove missing values
    clean_data = data[available_cols + ['id']].copy() if 'id' in data.columns else data[available_cols].copy()
    
    # Convert to numeric
    for col in available_cols:
        clean_data[col] = pd.to_numeric(clean_data[col], errors='coerce')
    
    # Remove rows with missing numerical values
    clean_data = clean_data.dropna(subset=available_cols)
    
    return clean_data


def detect_outliers_iqr(data: pd.Series, multiplier: float = 1.5) -> Tuple[List[int], Dict[str, float]]:
    """Detect outliers using Interquartile Range (IQR) method."""
    q1 = data.quantile(0.25)
    q3 = data.quantile(0.75)
    iqr = q3 - q1
    
    lower_bound = q1 - multiplier * iqr
    upper_bound = q3 + multiplier * iqr
    
    outlier_indices = data[(data < lower_bound) | (data > upper_bound)].index.tolist()
    
    bounds = {
        'lower_bound': float(lower_bound),
        'upper_bound': float(upper_bound),
        'q1': float(q1),
        'q3': float(q3),
        'iqr': float(iqr)
    }
    
    return outlier_indices, bounds


def detect_outliers_zscore(data: pd.Series, threshold: float = 2.5) -> Tuple[List[int], Dict[str, float]]:
    """Detect outliers using Z-score method."""
    mean = data.mean()
    std = data.std()
    
    if std == 0:  # Avoid division by zero
        return [], {'mean': float(mean), 'std': float(std), 'threshold': threshold}
    
    z_scores = np.abs((data - mean) / std)
    outlier_indices = data[z_scores > threshold].index.tolist()
    
    stats = {
        'mean': float(mean),
        'std': float(std),
        'threshold': threshold
    }
    
    return outlier_indices, stats


def validate_output(result: Dict[str, Any]) -> bool:
    """Validate outlier detection results."""
    required_keys = ['outliers_by_column', 'summary', 'total_records']
    return all(key in result for key in required_keys)


def format_outlier_details(data: pd.DataFrame, outlier_indices: List[int], column: str) -> List[Dict[str, Any]]:
    """Format outlier details for reporting."""
    outliers = []
    for idx in outlier_indices:
        if idx in data.index:
            outlier_data = {
                'index': int(idx),
                'column': column,
                'value': float(data.loc[idx, column])
            }
            
            # Add ID if available
            if 'id' in data.columns:
                outlier_data['id'] = int(data.loc[idx, 'id'])
            
            outliers.append(outlier_data)
    
    return outliers
