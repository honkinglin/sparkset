#!/usr/bin/env python3
"""Final migration script - careful and precise"""

import re
from pathlib import Path

# Complete mapping from lucide/radix to Ri format
# Format: {old_name: new_ri_name}
ICON_MAP = {
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
    'CaretSortIcon': 'RiArrowUpDownLine',
    'MoreHorizontal': 'RiMore2Line',
    'MoreHorizontalIcon': 'RiMore2Line',
    'GripVerticalIcon': 'RiDragMove2Line',
    'PanelLeftIcon': 'RiSideBarLine',

    # Actions
    'Play': 'RiPlayLine',
    'Plus': 'RiAddLine',
    'Edit': 'RiEdit2Line',
    'Edit2': 'RiEdit2Line',
    'Trash2': 'RiDeleteBin2Line',
    'X': 'RiCloseLine',
    'Check': 'RiCheckLine',
    'CheckIcon': 'RiCheckLine',
    'CheckCircle2': 'RiCheckboxCircleLine',
    'CircleCheckIcon': 'RiCheckboxCircleLine',
    'Save': 'RiSave3Line',
    'Copy': 'RiCopy2Line',
    'RefreshCw': 'RiRefreshLine',
    'History': 'RiTimeLine',
    'Search': 'RiSearch2Line',
    'SearchIcon': 'RiSearch2Line',
    'Star': 'RiStarLine',

    # Data & System
    'Database': 'RiDatabase2Line',
    'Zap': 'RiFlashlightLine',
    'Sparkles': 'RiSparkling2Line',
    'ZapOff': 'RiNotificationOffLine',
    'FileText': 'RiFileTextLine',
    'Code': 'RiCodeSlashLine',
    'MessageSquare': 'RiChat3Line',
    'BellIcon': 'RiNotification3Line',
    'ExternalLink': 'RiExternalLinkLine',
    'GalleryVerticalEnd': 'RiGalleryView2Line',

    # Status & Feedback
    'Loader2': 'RiLoader4Line',
    'Loader2Icon': 'RiLoader4Line',
    'InfoIcon': 'RiInformationLine',
    'TriangleAlertIcon': 'RiAlarmWarningLine',
    'OctagonXIcon': 'RiCloseCircleLine',
    'XCircle': 'RiCloseCircleLine',
    'Circle': 'RiCheckboxBlankCircleLine',

    # Editor & Input
    'Minus': 'RiSubtractLine',
    'MinusIcon': 'RiSubtractLine',
    'AlignJustify': 'RiAlignJustify',
    'AlignLeft': 'RiAlignLeft',
    'AlignDown': 'RiArrowDownLine',
    'AlignUp': 'RiArrowUpLine',
    'Label': 'RiPriceTag3Line',

    # Theme/Toggle
    'Sun': 'RiSunFoggyLine',
    'Moon': 'RiMoonLine',
    'Monitor': 'RiComputerLine',
    'Github': 'RiGithubLine',
    'BookOpen': 'RiBookOpenLine',
    'Heart': 'RiHeart2Line',

    # Additional
    'User': 'RiUserLine',
    'Eye': 'RiEyeLine',
}

def process_file(file_path):
    """Process a single file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        original = content

        # Step 1: Remove old imports
        content = re.sub(r'import\s*{[^}]+}\s*from\s*[\'"]lucide-react[\'"]\s*;?\s*\n?', '', content)
        content = re.sub(r'import\s*{[^}]+}\s*from\s*[\'"]@radix-ui/react-icons[\'"]\s*;?\s*\n?', '', content)
        content = re.sub(r'import\s+type\s*{[^}]+}\s*from\s*[\'"]lucide-react[\'"]\s*;?\s*\n?', '', content)

        # Step 2: Replace icon usage in JSX
        # Be careful to only replace actual icon components, not other components
        for old, new in ICON_MAP.items():
            # Replace <OldIconName (with space or > after)
            content = re.sub(rf'<{re.escape(old)}(\s|>)', f'<{new}\\1', content)
            # Replace in icon props: icon: OldIconName
            content = re.sub(rf'\bicon:\s*{re.escape(old)}(?!\w)', f'icon: {new}', content)
            # Replace typeof checks
            content = re.sub(rf'typeof\s+{re.escape(old)}(?!\w)', f'typeof {new}', content)

        # Step 3: Fix type imports
        content = re.sub(r':\s*LucideIcon', ': React.ComponentType<React.SVGProps<SVGSVGElement>>', content)

        # Step 4: Collect all Ri icons used in file
        ri_icons = sorted(set(re.findall(r'\b(Ri[A-Z][a-zA-Z0-9]+Line)\b', content)))

        # Step 5: Add new import
        if ri_icons:
            new_import = f"import {{ {', '.join(ri_icons)} }} from '@remixicon/react';\n"
            # Check for 'use client' directive
            if content.strip().startswith("'use client';"):
                lines = content.split('\n')
                lines.insert(1, new_import.strip())
                content = '\n'.join(lines)
            else:
                # Find first import or code line
                lines = content.split('\n')
                insert_pos = 0
                for i, line in enumerate(lines):
                    if line.strip() and not line.strip().startswith('//') and not line.strip().startswith('/*'):
                        insert_pos = i
                        break
                lines.insert(insert_pos, new_import.strip())
                content = '\n'.join(lines)

        # Clean up
        content = re.sub(r'\n{3,}', '\n\n', content)
        content = content.strip() + '\n'

        if content != original:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False

    except Exception as e:
        print(f"Error: {file_path.name} - {e}")
        return False

def main():
    src_dir = Path('/Users/overtrue/www/sparkset/apps/dashboard/src')

    # Find files that still need migration
    files_to_process = []
    for file_path in src_dir.rglob('*.tsx'):
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        if 'lucide-react' in content or '@radix-ui/react-icons' in content:
            files_to_process.append(file_path)

    print(f"Found {len(files_to_process)} files to process")

    processed = 0
    for file_path in files_to_process:
        print(f"Processing: {file_path.relative_to(src_dir.parent)}")
        if process_file(file_path):
            processed += 1
            print(f"  ✓ Done")
        else:
            print(f"  - No changes")

    print(f"\n{'='*50}")
    print(f"Processed {processed}/{len(files_to_process)} files")

if __name__ == '__main__':
    main()