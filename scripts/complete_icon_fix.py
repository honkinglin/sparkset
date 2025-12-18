#!/usr/bin/env python3
"""Complete fix for all Remix Icon imports - adding Ri prefix and correcting format"""

import re
from pathlib import Path

# Map old icon names to their Ri equivalents (backup mapping)
# This is used to help find what needs to be fixed
Ri_MAPPING = {
    # Navigation
    'ArrowDown': 'RiArrowDownLine',
    'ArrowUp': 'RiArrowUpLine',
    'ArrowRight': 'RiArrowRightLine',
    'ArrowLeft': 'RiArrowLeftLine',
    'ChevronDown': 'RiArrowDownSLine',
    'ChevronRight': 'RiArrowRightSLine',
    'ChevronLeft': 'RiArrowLeftSLine',
    'ChevronUp': 'RiArrowUpSLine',
    'ChevronsUpDown': 'RiExpandVerticalLine',
    'CaretSort': 'RiArrowUpDownLine',
    'MoreHorizontal': 'RiMore2Line',
    'GripVertical': 'RiDragMove2Line',
    'PanelLeft': 'RiSideBarLine',

    # Actions
    'Play': 'RiPlayLine',
    'Plus': 'RiAddLine',
    'Edit': 'RiEdit2Line',
    'Edit2': 'RiEdit2Line',
    'Trash2': 'RiDeleteBin2Line',
    'X': 'RiCloseLine',
    'Check': 'RiCheckLine',
    'CheckCircle2': 'RiCheckboxCircleLine',
    'Save': 'RiSave3Line',
    'Copy': 'RiCopy2Line',
    'RefreshCw': 'RiRefreshLine',
    'History': 'RiTimeLine',
    'Search': 'RiSearch2Line',
    'Star': 'RiStarLine',

    # Data & System
    'Database': 'RiDatabase2Line',
    'Zap': 'RiFlashlightLine',
    'Sparkles': 'RiSparkling2Line',
    'ZapOff': 'RiNotificationOffLine',  # Closest available
    'FileText': 'RiFileTextLine',
    'Code': 'RiCodeSlashLine',
    'MessageSquare': 'RiChat3Line',
    'ExternalLink': 'RiExternalLinkLine',
    'GalleryVerticalEnd': 'RiGalleryView2Line',

    # Status
    'Loader2': 'RiLoader4Line',
    'Info': 'RiInformationLine',
    'TriangleAlert': 'RiAlarmWarningLine',
    'OctagonX': 'RiCloseCircleLine',
    'XCircle': 'RiCloseCircleLine',
    'Circle': 'RiCheckboxBlankCircleLine',

    # Editor
    'Minus': 'RiSubtractLine',
    'AlignJustify': 'RiAlignJustify',
    'AlignLeft': 'RiAlignLeft',
    'AlignDown': 'RiArrowDownLine',
    'AlignUp': 'RiArrowUpLine',
    'Label': 'RiPriceTag3Line',

    # Theme
    'Sun': 'RiSunFoggyLine',
    'Moon': 'RiMoonLine',
    'Monitor': 'RiComputerLine',
    'Github': 'RiGithubLine',
    'BookOpen': 'RiBookOpenLine',
    'Heart': 'RiHeart2Line',
    'Bell': 'RiNotification3Line',  # For Radix BellIcon replacement

    # Additional
    'User': 'RiUserLine',
    'Eye': 'RiEyeLine',

    # Views/Sorting
    'Checkbox': 'RiCheckboxLine',
}

def fix_file(file_path):
    """Fix a single file completely"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        original = content

        # Step 1: Remove any existing remixicon import
        content = re.sub(r"import\s*{[^}]+}\s*from\s*'@remixicon/react';\s*\n?", '', content)

        # Step 2: Replace all icon usage in JSX
        # Handle different patterns

        # Pattern 1: <IconName
        for old, new in Ri_MAPPING.items():
            if old in ['Check', 'Minus']:  # Common words, need careful matching
                content = re.sub(rf'<{old}\s', f'<{new} ', content)
            else:
                content = re.sub(rf'<{old}(\s|>)', f'<{new}\\1', content)
                content = re.sub(rf'<{old}Icon(\s|>)', f'<{new}\\1', content)

        # Pattern 2: icon: IconName (for state props)
        for old, new in Ri_MAPPING.items():
            if old in ['Play', 'Zap', 'Database', 'Sparkles']:
                content = re.sub(rf'icon:\s*{old}(?!\w)', f'icon: {new}', content)
                content = re.sub(rf'icon:\s*{old}Icon(?!\w)', f'icon: {new}', content)

        # Pattern 3: const Icon = item.icon; <Icon ...
        content = re.sub(r'const\s+(\w+)\s*=\s*item\.icon;(\s*\n\s*const\s+\w+\s*=\s*[^;]+;)?', r'\1 = item.icon as React.ComponentType<React.SVGProps<SVGSVGElement>>;\2', content)

        # Pattern 4: typeof checks - keep them as typeof since we're changing the icon
        # They'll need manual review anyway

        # Step 3: Write JSX with updated component names
        # (already done above)

        # Step 4: Collect all needed Ri icons and create import
        # Find all icons that match Ri[A-Z] pattern in file
        used_ri_icons = re.findall(r'\b(Ri[A-Za-z0-9]+Line)\b', content)
        used_ri_icons = sorted(set(used_ri_icons))

        if used_ri_icons:
            new_import = f"import {{ {', '.join(used_ri_icons)} }} from '@remixicon/react';\n"
            # Check if file starts with 'use client'
            if content.strip().startswith("'use client';"):
                lines = content.split('\n')
                lines.insert(1, new_import)  # After 'use client'
                content = '\n'.join(lines)
            elif 'import' in content:
                # Find first import and insert before it
                first_import_pos = content.find('import')
                content = content[:first_import_pos] + new_import + content[first_import_pos:]
            else:
                # No imports, insert at top
                content = new_import + content

        # Clean up
        content = re.sub(r'\n{3,}', '\n\n', content)
        content = content.strip() + '\n'

        # Check if fixed
        if 'lucide-react' in content or '@radix-ui/react-icons' in content:
            # Still has old dependencies
            print(f"⚠️  Warning: {file_path.name} still has old imports")
            return False

        if content != original:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True

        return False

    except Exception as e:
        print(f"❌ Error: {file_path.name} - {e}")
        return False

def main():
    src_dir = Path('/Users/overtrue/www/sparkset/apps/dashboard/src')

    print("🔍 Scanning all files....")
    files = list(src_dir.rglob('*.tsx')) + list(src_dir.rglob('*.ts'))

    updated = 0
    skipped = 0

    for file_path in files:
        # Skip already processed or not needing icons
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()

            if 'lucide-react' not in content and '@radix-ui/react-icons' not in content:
                if '@remixicon/react' not in content:
                    skipped += 1
                    continue
        except:
            skipped += 1
            continue

        if fix_file(file_path):
            updated += 1
            print(f"✅ {file_path.relative_to(src_dir.parent)}")
        else:
            skipped += 1

    print(f"\n{'='*60}")
    print(f"✨ Complete! Fixed {updated} files, skipped {skipped} files")

if __name__ == '__main__':
    main()