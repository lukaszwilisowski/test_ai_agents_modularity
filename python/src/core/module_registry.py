"""Module registry for discovering and managing analysis modules."""

import logging
from dataclasses import dataclass
from pathlib import Path

logger = logging.getLogger(__name__)


@dataclass
class ModuleInfo:
    """Information about a discovered module."""

    name: str
    path: Path
    engine_path: Path
    model_path: Path
    config_path: Path
    description: str = ""

    @property
    def is_valid(self) -> bool:
        """Check if module has all required files."""
        return (
            self.engine_path.exists()
            and self.model_path.exists()
            and self.config_path.exists()
        )


class ModuleRegistry:
    """Registry for discovering and managing analysis modules."""

    def __init__(self, modules_dir: Path):
        """Initialize the module registry.

        Args:
            modules_dir: Path to the directory containing modules
        """
        self.modules_dir = modules_dir
        self.modules_dir.mkdir(exist_ok=True)
        self._registered_modules: dict[str, ModuleInfo] = {}

    def discover_modules(self) -> dict[str, ModuleInfo]:
        """Discover all valid modules in the modules directory.

        Returns:
            Dictionary mapping module names to ModuleInfo objects
        """
        self._registered_modules.clear()

        # Look for subdirectories in the modules directory
        for module_dir in self.modules_dir.iterdir():
            if not module_dir.is_dir() or module_dir.name.startswith("."):
                continue

            module_info = self._analyze_module(module_dir)
            if module_info and module_info.is_valid:
                self._registered_modules[module_info.name] = module_info
                logger.info(f"Registered module: {module_info.name}")
            else:
                logger.warning(f"Skipping invalid module: {module_dir.name}")

        return self._registered_modules.copy()

    def _analyze_module(self, module_dir: Path) -> ModuleInfo:
        """Analyze a module directory and create ModuleInfo.

        Args:
            module_dir: Path to the module directory

        Returns:
            ModuleInfo object for the module
        """
        module_info = ModuleInfo(
            name=module_dir.name,
            path=module_dir,
            engine_path=module_dir / "engine.py",
            model_path=module_dir / "model.py",
            config_path=module_dir / "config.py",
        )

        # Try to read description from config if it exists
        if module_info.config_path.exists():
            try:
                # Import the config module to get description
                import importlib.util

                spec = importlib.util.spec_from_file_location(
                    "config", module_info.config_path
                )
                config_module = importlib.util.module_from_spec(spec)
                spec.loader.exec_module(config_module)

                if hasattr(config_module, "DESCRIPTION"):
                    module_info.description = config_module.DESCRIPTION
            except Exception as e:
                logger.warning(f"Could not read config for {module_info.name}: {e}")

        return module_info

    def get_module(self, name: str) -> ModuleInfo:
        """Get a specific module by name.

        Args:
            name: Name of the module to retrieve

        Returns:
            ModuleInfo object for the requested module

        Raises:
            KeyError: If module is not registered
        """
        if name not in self._registered_modules:
            raise KeyError(f"Module '{name}' not found in registry")
        return self._registered_modules[name]

    def list_modules(self) -> list[str]:
        """Get list of all registered module names.

        Returns:
            List of module names
        """
        return list(self._registered_modules.keys())
