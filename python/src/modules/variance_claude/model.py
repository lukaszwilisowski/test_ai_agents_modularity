import pandas as pd
from typing import Any, Dict

def validate_input(data: pd.DataFrame) -> bool:
    """Validate that input data has numeric columns for variance calculation."""
    if data.empty:
        return False

    # Check if there are any numeric columns
    numeric_columns = data.select_dtypes(include=['number']).columns
    return len(numeric_columns) > 0

def prepare_data(data: pd.DataFrame) -> pd.DataFrame:
    """Clean and prepare data for variance analysis."""
    # Select only numeric columns
    numeric_data = data.select_dtypes(include=['number'])

    # Remove rows with all NaN values in numeric columns
    clean_data = numeric_data.dropna(how='all')

    return clean_data

def validate_output(result: Dict[str, Any]) -> bool:
    """Validate that analysis results contain expected variance metrics."""
    required_keys = ['variance']
    return all(key in result for key in required_keys)

def format_output(result: Dict[str, Any]) -> Dict[str, Any]:
    """Format results for display with proper precision."""
    formatted = {}
    for key, value in result.items():
        if isinstance(value, dict):
            formatted[key] = {k: round(v, 4) if isinstance(v, float) else v for k, v in value.items()}
        elif isinstance(value, float):
            formatted[key] = round(value, 4)
        else:
            formatted[key] = value
    return formatted