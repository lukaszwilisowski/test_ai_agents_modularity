#!/usr/bin/env python3
"""Test script for the variance_copilot module."""

import pandas as pd
import json
from pathlib import Path
import sys

# Add the src directory to the path
sys.path.append(str(Path(__file__).parent / "src"))

from src.core.data_loader import DataLoader
from src.core.module_registry import ModuleRegistry
from src.core.module_runner import ModuleRunner

def test_variance_copilot():
    """Test the variance_copilot module specifically."""
    print("Testing variance_copilot module...")
    
    # Initialize components
    project_root = Path(__file__).parent
    data_loader = DataLoader(project_root / "data")
    module_registry = ModuleRegistry(project_root / "src" / "modules")
    module_runner = ModuleRunner()

    # Load sample data
    dataset = data_loader.load_sample_data()
    print(f"Loaded dataset with {len(dataset)} records")
    print("Dataset columns:", list(dataset.columns))
    print("First 3 rows:")
    print(dataset.head(3))
    print()

    # Discover modules and find variance_copilot
    modules = module_registry.discover_modules()
    
    if 'variance_copilot' not in modules:
        print("ERROR: variance_copilot module not found!")
        return
    
    variance_module = modules['variance_copilot']
    print(f"Found variance_copilot module: {variance_module}")
    print()

    # Run the variance_copilot module
    try:
        result = module_runner.run_module(variance_module, dataset)
        print("SUCCESS: variance_copilot module executed successfully!")
        print()
        
        # Display results
        print("=== VARIANCE COPILOT RESULTS ===")
        print(f"Module: {result.get('module', 'N/A')}")
        print(f"Description: {result.get('description', 'N/A')}")
        print(f"Version: {result.get('version', 'N/A')}")
        print(f"Author: {result.get('author', 'N/A')}")
        print(f"Columns analyzed: {result.get('columns_analyzed', [])}")
        print(f"Total columns: {result.get('total_columns', 0)}")
        print(f"Valid variance columns: {result.get('valid_variance_columns', 0)}")
        print()
        
        # Display variance results for each column
        variance_results = result.get('variance_results', {})
        for column, stats in variance_results.items():
            print(f"Column: {column}")
            print(f"  Count: {stats.get('count', 'N/A')}")
            print(f"  Mean: {stats.get('mean', 'N/A')}")
            print(f"  Sample Variance: {stats.get('sample_variance', 'N/A')}")
            print(f"  Sample Std: {stats.get('sample_std', 'N/A')}")
            print(f"  Population Variance: {stats.get('population_variance', 'N/A')}")
            print(f"  Population Std: {stats.get('population_std', 'N/A')}")
            print(f"  Coefficient of Variation: {stats.get('coefficient_of_variation', 'N/A')}%")
            print(f"  Interpretation: {stats.get('interpretation', 'N/A')}")
            print(f"  Range: {stats.get('min', 'N/A')} - {stats.get('max', 'N/A')}")
            print(f"  IQR: {stats.get('q25', 'N/A')} - {stats.get('q75', 'N/A')} (IQR: {stats.get('iqr', 'N/A')})")
            print()
        
        # Dataset summary
        dataset_summary = result.get('dataset_summary', {})
        print("Dataset Summary:")
        print(f"  Original rows: {dataset_summary.get('original_rows', 'N/A')}")
        print(f"  Clean rows: {dataset_summary.get('clean_rows', 'N/A')}")
        print(f"  Original columns: {dataset_summary.get('original_columns', 'N/A')}")
        print(f"  Numerical columns: {dataset_summary.get('numerical_columns', 'N/A')}")
        print()
        
        # Parameters used
        params = result.get('parameters_used', {})
        print("Parameters used:")
        for key, value in params.items():
            print(f"  {key}: {value}")
            
    except Exception as e:
        print(f"ERROR: Failed to run variance_copilot module: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_variance_copilot()