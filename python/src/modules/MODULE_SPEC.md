# Module Specification

This document defines the standard contract for analysis modules in the Modular Analysis Tool.

## Overview

The modular architecture allows for easy addition and removal of analysis capabilities. Each module is a self-contained folder with standardized files that implement a specific analysis function.

## Module Structure

Each module must be contained in its own folder under `src/modules/` with the following required files:

```
modules/
├── your_module_name/
│   ├── config.py      # Module configuration and metadata
│   ├── model.py       # Data models and business logic
│   └── engine.py      # Main execution logic
```

## File Contracts

### config.py

Defines module metadata and configuration parameters.

**Required attributes:**
- `DESCRIPTION`: String describing what the module does
- `VERSION`: Module version string
- `AUTHOR`: Module author information

**Optional attributes:**
- `PARAMETERS`: Dictionary of configurable parameters
- `DEPENDENCIES`: List of additional dependencies

**Example:**
```python
DESCRIPTION = "Calculates basic statistical measures"
VERSION = "1.0.0"
AUTHOR = "Your Name"

PARAMETERS = {
    "precision": 2,
    "include_outliers": True
}
```

### model.py

Contains data models, validation logic, and business rules.

**Required functions:**
- `validate_input(data)`: Validates input data format
- `prepare_data(data)`: Prepares/transforms data for analysis

**Optional functions:**
- `validate_output(result)`: Validates analysis results
- `format_output(result)`: Formats results for display

**Example:**
```python
import pandas as pd
from typing import Any, Dict

def validate_input(data: pd.DataFrame) -> bool:
    \"\"\"Validate that input data has required columns.\"\"\"
    required_columns = ['value', 'score']
    return all(col in data.columns for col in required_columns)

def prepare_data(data: pd.DataFrame) -> pd.DataFrame:
    \"\"\"Clean and prepare data for analysis.\"\"\"
    return data.dropna(subset=['value', 'score'])
```

### engine.py

Main execution logic that orchestrates the analysis.

**Required functions:**
- `analyze(dataset, model, config)`: Main analysis function

**Function signature:**
```python
def analyze(dataset: pd.DataFrame, model: Any, config: Any) -> Dict[str, Any]:
    \"\"\"
    Perform the module's analysis on the dataset.
    
    Args:
        dataset: Input pandas DataFrame
        model: Loaded model module
        config: Loaded config module
        
    Returns:
        Dictionary containing analysis results
    \"\"\"
```

**Example:**
```python
import pandas as pd
from typing import Any, Dict

def analyze(dataset: pd.DataFrame, model: Any, config: Any) -> Dict[str, Any]:
    \"\"\"Calculate basic statistics for the dataset.\"\"\"
    
    # Validate input
    if not model.validate_input(dataset):
        raise ValueError("Invalid input data")
    
    # Prepare data
    clean_data = model.prepare_data(dataset)
    
    # Perform analysis
    results = {
        "mean": clean_data['value'].mean(),
        "median": clean_data['value'].median(),
        "std": clean_data['value'].std(),
        "count": len(clean_data)
    }
    
    # Apply configuration
    if hasattr(config, 'PARAMETERS'):
        precision = config.PARAMETERS.get('precision', 2)
        for key, value in results.items():
            if isinstance(value, float):
                results[key] = round(value, precision)
    
    return results
```

## Module Registration

Modules are automatically discovered by the framework. Simply create a folder with the required files under `src/modules/` and the system will detect and run it.

## Error Handling

- Modules should validate their inputs and raise descriptive exceptions
- The framework will catch exceptions and log them appropriately
- Failed modules will not prevent other modules from running

## Best Practices

1. **Single Responsibility**: Each module should perform one specific type of analysis
2. **Data Validation**: Always validate input data before processing
3. **Configuration**: Use config.py for any parameters that might need adjustment
4. **Documentation**: Include docstrings in all functions
5. **Error Messages**: Provide clear, actionable error messages
6. **Testing**: Create unit tests for your module logic

## Example Modules

The following example modules demonstrate different types of analysis:

- `basic_stats`: Mean, median, standard deviation
- `regression`: Linear regression analysis
- `distribution`: Distribution analysis and fitting
- `correlation`: Correlation analysis between variables
- `outlier_detection`: Identify statistical outliers
- `probability`: Probability calculations and modeling

## Adding a New Module

1. Create a new folder under `src/modules/`
2. Implement the three required files following the contracts above
3. Test your module by running the main application
4. The module will be automatically discovered and executed

## Removing a Module

1. Delete the module folder from `src/modules/`
2. The module will no longer be discovered or executed

This modular architecture facilitates:
- Easy automation with AI agents (follow the spec)
- Quick feature removal (delete folder)
- Consistent development patterns
- Scalable architecture for many modules
