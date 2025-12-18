#!/usr/bin/env python3
"""Update all import paths from remixicon-react to @remixicon/react"""

import re
from pathlib import Path

def update_file(file_path):
    """Update import path in a file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        original = content

        # Replace import statements
        content = re.sub(
            r"from ['\"]remixicon-react['\"]",
            "from '@remixicon/react'",
            content
        )

        if content != original:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False
    except Exception as e:
        print(f"Error updating {file_path}: {e}")
        return False

def main():
    src_dir = Path('/Users/overtrue/www/sparkset/apps/dashboard/src')

    updated_count = 0
    for file_path in src_dir.rglob('*.tsx'):
        if update_file(file_path):
            print(f"✓ Updated: {file_path.relative_to(src_dir.parent)}")
            updated_count += 1

    for file_path in src_dir.rglob('*.ts'):
        if not file_path.name.endswith('.tsx'):
            if update_file(file_path):
                print(f"✓ Updated: {file_path.relative_to(src_dir.parent)}")
                updated_count += 1

    print(f"\nUpdated {updated_count} files")

if __name__ == '__main__':
    main()