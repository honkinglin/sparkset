#!/usr/bin/env python3
"""Fix remaining icon issues from the migration"""

import re
from pathlib import Path

def fix_file(file_path):
    """Fix individual file issues"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        original = content

        # Fix double/single quote issues with 'use client'
        content = content.replace("''use client';'", "'use client';")
        content = content.replace("'use client';''", "'use client';")
        content = re.sub(r'^use client;', "'use client';", content, flags=re.MULTILINE)

        # Fix other components
        # Check -> CheckLine
        # Only in JSX contexts
        content = re.sub(r'<Check\s', '<CheckLine ', content)
        content = re.sub(r'<CheckIcon\s', '<CheckLine ', content)

        # Fix remaining icon names the script missed for some reason
        content = re.sub(r'from "remixicon-react"', "from 'remixicon-react'", content)
        content = re.sub(r"from 'remixicon-react'", "from 'remixicon-react'", content)

        # Clean up any remaining old imports
        content = re.sub(r'import\s*{[^}]+}\s*from\s*["\']lucide-react["\'];?\s*\n?', '', content)
        content = re.sub(r'import\s*{[^}]+}\s*from\s*["\']@radix-ui/react-icons["\'];?\s*\n?', '', content)

        if content != original:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False
    except Exception as e:
        print(f"Error fixing {file_path}: {e}")
        return False

def main():
    src_dir = Path('/Users/overtrue/www/sparkset/apps/dashboard/src')

    fixed_count = 0
    for file_path in src_dir.rglob('*.tsx'):
        if fix_file(file_path):
            print(f"✓ Fixed: {file_path.relative_to(src_dir.parent)}")
            fixed_count += 1

    for file_path in src_dir.rglob('*.ts'):
        if not file_path.name.endswith('.tsx'):  # Exclude tsx files
            if fix_file(file_path):
                print(f"✓ Fixed: {file_path.relative_to(src_dir.parent)}")
                fixed_count += 1

    print(f"\nFixed {fixed_count} files")

if __name__ == '__main__':
    main()