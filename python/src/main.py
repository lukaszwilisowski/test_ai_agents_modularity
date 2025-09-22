"""Main application logic for the modular analysis tool."""

import logging
from pathlib import Path
from typing import Any

from modular_analysis.core.data_loader import DataLoader
from modular_analysis.core.module_registry import ModuleRegistry
from modular_analysis.core.module_runner import ModuleRunner

# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


def main() -> None:
    """Main entry point for the modular analysis application."""
    logger.info("Starting Modular Analysis Tool")

    try:
        # Initialize components
        project_root = Path(__file__).parent.parent
        data_loader = DataLoader(project_root / "data")
        module_registry = ModuleRegistry(project_root / "modular_analysis" / "modules")
        module_runner = ModuleRunner()

        # Load sample data
        logger.info("Loading sample dataset...")
        dataset = data_loader.load_sample_data()
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
