"""Main application logic for the modular analysis tool."""

import json
import logging
from datetime import datetime
from pathlib import Path
from typing import Any
import numpy as np

from src.core.data_loader import DataLoader
from src.core.module_registry import ModuleRegistry
from src.core.module_runner import ModuleRunner

# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


class NumpyJSONEncoder(json.JSONEncoder):
    """Custom JSON encoder that handles NumPy data types."""
    
    def default(self, obj):
        if isinstance(obj, (np.integer, np.int64)):
            return int(obj)
        elif isinstance(obj, (np.floating, np.float64)):
            return float(obj)
        elif isinstance(obj, np.ndarray):
            return obj.tolist()
        return super().default(obj)


def save_results_to_json(results: dict[str, Any], dataset_info: dict[str, Any], output_path: Path) -> None:
    """Save analysis results to JSON file with module separation."""
    # Prepare structured output
    output_data = {
        "analysis_metadata": {
            "timestamp": datetime.now().isoformat(),
            "dataset_records": dataset_info.get("total_records", 0),
            "modules_executed": len(results),
            "modules_successful": len([r for r in results.values() if "error" not in r]),
            "modules_failed": len([r for r in results.values() if "error" in r])
        },
        "modules": {}
    }
    
    # Process each module's results
    for module_name, result in results.items():
        if "error" in result:
            output_data["modules"][module_name] = {
                "status": "FAILED",
                "error": result["error"],
                "result": None
            }
        else:
            output_data["modules"][module_name] = {
                "status": "SUCCESS",
                "error": None,
                "result": result
            }
    
    # Write to JSON file
    try:
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(output_data, f, indent=2, ensure_ascii=False, cls=NumpyJSONEncoder)
        logger.info(f"Results saved to {output_path}")
    except Exception as e:
        logger.error(f"Failed to save results to JSON: {e}")


def main() -> None:
    """Main entry point for the modular analysis application."""
    logger.info("Starting Modular Analysis Tool")

    try:
        # Initialize components
        project_root = Path(__file__).parent.parent
        data_loader = DataLoader(project_root / "data")
        module_registry = ModuleRegistry(project_root / "src" / "modules")
        module_runner = ModuleRunner()

        # Load sample data
        logger.info("Loading sample dataset...")
        dataset = data_loader.load_sample_data()
        dataset_info = {"total_records": len(dataset)}
        logger.info(f"Loaded dataset with {len(dataset)} records")

        # Discover and register modules
        logger.info("Discovering modules...")
        modules = module_registry.discover_modules()
        logger.info(f"Found {len(modules)} modules: {list(modules.keys())}")

        # Run all modules sequentially
        logger.info("Running modules sequentially...")
        results: dict[str, Any] = {}

        for module_name, module_info in modules.items():
            logger.info(f"Running module: {module_name}")
            try:
                result = module_runner.run_module(module_info, dataset)
                results[module_name] = result
                logger.info(f"Module {module_name} completed successfully")
            except Exception as e:
                logger.error(f"Module {module_name} failed: {e}")
                results[module_name] = {"error": str(e)}

        # Save results to JSON file
        output_path = project_root / "output.json"
        save_results_to_json(results, dataset_info, output_path)

        # Display results summary
        logger.info("=== ANALYSIS RESULTS ===")
        for module_name, result in results.items():
            if "error" in result:
                logger.error(f"{module_name}: FAILED - {result['error']}")
            else:
                logger.info(f"{module_name}: SUCCESS")
                if isinstance(result, dict):
                    for key, value in result.items():
                        logger.info(f"  {key}: {value}")

        logger.info("Modular Analysis Tool completed successfully")

    except Exception as e:
        logger.error(f"Application failed: {e}")
        raise


if __name__ == "__main__":
    main()
