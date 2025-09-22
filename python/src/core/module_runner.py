"""Module runner for executing analysis modules."""

import importlib.util
import logging
from pathlib import Path
from typing import Any

import pandas as pd

from modular_analysis.core.module_registry import ModuleInfo

logger = logging.getLogger(__name__)


class ModuleRunner:
    """Executes analysis modules following the standard contract."""

    def run_module(
        self, module_info: ModuleInfo, dataset: pd.DataFrame
    ) -> dict[str, Any]:
        """Run a single analysis module.

        Args:
            module_info: Information about the module to run
            dataset: Input dataset for analysis

        Returns:
            Dictionary containing the analysis results

        Raises:
            Exception: If module execution fails
        """
        logger.info(f"Executing module: {module_info.name}")

        try:
            # Load the module components
            config = self._load_config(module_info.config_path)
            model = self._load_model(module_info.model_path)
            engine = self._load_engine(module_info.engine_path)

            # Execute the module following the standard contract
            # Each module should have an 'analyze' function in its engine
            if not hasattr(engine, "analyze"):
                raise AttributeError(
                    f"Module {module_info.name} engine missing 'analyze' function"
                )

            # Run the analysis
            result = engine.analyze(dataset, model, config)

            # Ensure result is a dictionary
            if not isinstance(result, dict):
                result = {"result": result}

            # Add metadata
            result["module_name"] = module_info.name
            result["module_description"] = module_info.description

            logger.info(f"Module {module_info.name} completed successfully")
            return result

        except Exception as e:
            logger.error(f"Module {module_info.name} failed: {e}")
            raise

    def _load_config(self, config_path: Path) -> Any:
        """Load module configuration.

        Args:
            config_path: Path to the config.py file

        Returns:
            Loaded configuration module
        """
        spec = importlib.util.spec_from_file_location("config", config_path)
        config_module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(config_module)
        return config_module

    def _load_model(self, model_path: Path) -> Any:
        """Load module model.

        Args:
            model_path: Path to the model.py file

        Returns:
            Loaded model module
        """
        spec = importlib.util.spec_from_file_location("model", model_path)
        model_module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(model_module)
        return model_module

    def _load_engine(self, engine_path: Path) -> Any:
        """Load module engine.

        Args:
            engine_path: Path to the engine.py file

        Returns:
            Loaded engine module
        """
        spec = importlib.util.spec_from_file_location("engine", engine_path)
        engine_module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(engine_module)
        return engine_module
