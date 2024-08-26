"""
load_kegg.py
    Loading KEGG compounds, reactions, or atom mappings

Usage: load_kegg.py <filepath>

Example: load_kegg.py /data/atom_mappings_KEGG_RCLASS.json

"""

import os
from pathlib import Path
from md_harmonize.tools import open_text, open_json
from md_harmonize.reaction import Reaction
from md_harmonize.compound import Compound
def load_files(path: str):
    path = Path(path)
    if path.is_file():
        file_extension = os.path.splitext(path)[1]
        if file_extension == ".json":
            try:
                content = open_json(path)
                print(content)
            except:
                print(f"Error loading {filename}: {e}")
    elif path.is_dir():
        for filename in os.listdir(path):
            file_path = os.path.join(path, filename)
            file_extension = os.path.splitext(file_path)[1]
            if file_extension == ".json":
                try:
                    content = open_json(file_path)
                    print(f"Content of {filename}:")
                    print(content)
                    print("-" * 40)
                except Exception as e:
                    print(f"Error loading {filename}: {e}")
            if file_extension == ".txt":
                try:
                    content = open_text(file_path)
                    print(f"Content of {filename}:")
                    print(content)
                    print("-" * 40)
                except Exception as e:
                    print(f"Error loading {filename}: {e}")
    else:
        print(f"The path '{path}' is neither a file nor a directory.")
if __name__ == "__main__":
    import sys
    if len(sys.argv) != 2:
        print("Usage: python load_kegg.py <path>")
        sys.exit(1)
    path = sys.argv[1]
    load_files(path)
