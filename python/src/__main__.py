"""Main entry point for the modular analysis tool."""

import sys
from pathlib import Path

# Add the project root to the Python path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from modular_analysis.main import main

if __name__ == "__main__":
    main()
