#!/usr/bin/env python3
"""Fix import order for files with 'use client' directive"""

import re
from pathlib import Path

def fix_file(file_path):
    """Fix a single file's import order"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Pattern: remixicon import on line 1, 'use client' on line 2
        pattern = r"^(import \{[^}]+\} from 'remixicon-react';)\n('use client';)\n"
        replacement = r"'\2'\n\n\1\n"

        new_content = re.sub(pattern, replacement, content, flags=re.MULTILINE)

        if new_content != content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            return True
        return False
    except Exception as e:
        print(f"Error fixing {file_path}: {e}")
        return False

def main():
    src_dir = Path('/Users/overtrue/www/sparkset/apps/dashboard/src')

    # Find all files that might need fixing
    fixed_count = 0
    for file_path in src_dir.rglob('*.tsx'):
        if fix_file(file_path):
            print(f"✓ Fixed: {file_path.relative_to(src_dir.parent)}")
            fixed_count += 1

    print(f"\nFixed {fixed_count} files")

if __name__ == '__main__':
    main()