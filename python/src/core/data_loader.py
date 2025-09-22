"""Data loading utilities for the modular analysis tool."""

import json
import logging
from pathlib import Path

import pandas as pd

logger = logging.getLogger(__name__)


class DataLoader:
    """Handles loading and managing sample datasets for analysis modules."""

    def __init__(self, data_dir: Path):
        """Initialize the data loader with a data directory.

        Args:
            data_dir: Path to the directory containing data files
        """
        self.data_dir = data_dir
        self.data_dir.mkdir(exist_ok=True)

    def load_sample_data(self) -> pd.DataFrame:
        """Load or create sample dataset for analysis.

        Returns:
            DataFrame containing sample data for analysis
        """
        sample_file = self.data_dir / "sample_data.json"

        if sample_file.exists():
            logger.info("Loading existing sample data")
            with open(sample_file) as f:
                data = json.load(f)
            return pd.DataFrame(data)
        else:
            logger.info("Creating new sample dataset")
            return self._create_sample_data()

    def _create_sample_data(self) -> pd.DataFrame:
        """Create a sample dataset for analysis modules.

        Returns:
            DataFrame with sample data
        """
        import numpy as np

        # Set random seed for reproducibility
        np.random.seed(42)

        # Generate sample data
        n_samples = 100
        data = {
            "id": range(1, n_samples + 1),
            "value": np.random.normal(50, 15, n_samples),
            "category": np.random.choice(["A", "B", "C"], n_samples),
            "score": np.random.uniform(0, 100, n_samples),
            "count": np.random.poisson(10, n_samples),
            "flag": np.random.choice([True, False], n_samples),
            "timestamp": pd.date_range("2024-01-01", periods=n_samples, freq="D"),
        }

        df = pd.DataFrame(data)

        # Save the sample data for future use
        sample_file = self.data_dir / "sample_data.json"
        df.to_json(sample_file, orient="records", date_format="iso", indent=2)
        logger.info(f"Sample dataset created and saved to {sample_file}")

        return df
