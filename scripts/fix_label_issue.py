#!/usr/bin/env python3
"""Fix the Label -> RiPriceTag3Line issue"""

import re
from pathlib import Path

def fix_file(file_path):
    """Fix Label replacement issue"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        original = content

        # Fix the specific issue: RiPriceTag3Line htmlFor should be Label htmlFor
        # This happens when Label component was incorrectly replaced
        content = re.sub(
            r'<RiPriceTag3Line\s+htmlFor=',
            '<Label htmlFor=',
            content
        )

        # Also need to fix the closing tag
        content = re.sub(
            r'</RiPriceTag3Line>',
            '</Label>',
            content
        )

        # Remove RiPriceTag3Line from imports if it was added incorrectly
        # (it should only be used for actual icon usage, not Label components)
        if '<Label' in content and 'RiPriceTag3Line' in content:
            # Check if RiPriceTag3Line is actually used as an icon
            if not re.search(r'<RiPriceTag3Line\s+[^h]', content):
                # It's not used as an icon, remove from imports
                content = re.sub(
                    r'import\s*{[^}]*RiPriceTag3Line[^}]*}\s*from\s*[\'"]@remixicon/react[\'"]\s*;?\s*\n?',
                    '',
                    content
                )
                # If there are other icons in the import, keep them
                ri_icons = sorted(set(re.findall(r'\b(Ri[A-Z][a-zA-Z0-9]+Line)\b', content)))
                if ri_icons:
                    new_import = f"import {{ {', '.join(ri_icons)} }} from '@remixicon/react';\n"
                    if content.strip().startswith("'use client';"):
                        lines = content.split('\n')
                        lines.insert(1, new_import.strip())
                        content = '\n'.join(lines)
                    else:
                        lines = content.split('\n')
                        insert_pos = 0
                        for i, line in enumerate(lines):
                            if line.strip() and not line.strip().startswith('//'):
                                insert_pos = i
                                break
                        lines.insert(insert_pos, new_import.strip())
                        content = '\n'.join(lines)

        if content != original:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False

    except Exception as e:
        print(f"Error: {e}")
        return False

def main():
    src_dir = Path('/Users/overtrue/www/sparkset/apps/dashboard/src')

    # Find files with the issue
    files_with_issue = []
    for file_path in src_dir.rglob('*.tsx'):
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        if 'RiPriceTag3Line htmlFor' in content:
            files_with_issue.append(file_path)

    print(f"Found {len(files_with_issue)} files with Label issue")

    fixed = 0
    for file_path in files_with_issue:
        print(f"Fixing: {file_path.relative_to(src_dir.parent)}")
        if fix_file(file_path):
            fixed += 1
            print("  ✓ Fixed")

    print(f"\nFixed {fixed} files")

if __name__ == '__main__':
    main()