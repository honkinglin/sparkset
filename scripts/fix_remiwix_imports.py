#!/usr/bin/env python3
"""Fix all remixicon imports to use proper RiIconNameLine format"""

import re
from pathlib import Path

# Mapping from old names to NEW Remix Icon format (RiIconLine)
ICON_REPLACEMENTS = {
    # Navigation
    'ArrowDownLine': 'RiArrowDownLine',
    'ArrowUpLine': 'RiArrowUpLine',
    'ArrowRightLine': 'RiArrowRightLine',
    'ArrowLeftLine': 'RiArrowLeftLine',
    'ArrowDownSLine': 'RiArrowDownSLine',
    'ArrowRightSLine': 'RiArrowRightSLine',
    'ArrowLeftSLine': 'RiArrowLeftSLine',
    'ArrowUpSLine': 'RiArrowUpSLine',
    'ExpandVerticalLine': 'RiExpandVerticalLine',
    'ArrowUpDownLine': 'RiArrowUpDownLine',
    'More2Line': 'RiMore2Line',
    'DragMove2Line': 'RiDragMove2Line',
    'SideBarLine': 'RiSideBarLine',

    # Actions
    'PlayLine': 'RiPlayLine',
    'AddLine': 'RiAddLine',
    'Edit2Line': 'RiEdit2Line',
    'DeleteBin2Line': 'RiDeleteBin2Line',
    'CloseLine': 'RiCloseLine',
    'CheckLine': 'RiCheckLine',
    'CheckboxCircleLine': 'RiCheckboxCircleLine',
    'Save3Line': 'RiSave3Line',
    'Copy2Line': 'RiCopy2Line',
    'RefreshLine': 'RiRefreshLine',
    'TimeLine': 'RiTimeLine',
    'Search2Line': 'RiSearch2Line',
    'StarLine': 'RiStarLine',

    # Data & System
    'Database2Line': 'RiDatabase2Line',
    'FlashlightLine': 'RiFlashlightLine',
    'Sparkling2Line': 'RiSparkling2Line',
    # Note: FlashlightOff not available, using Close /
    'FlashlightOffLine': 'RiFlashlightLine',  # Fallback
    'FileTextLine': 'RiFileTextLine',
    'CodeSlashLine': 'RiCodeSlashLine',
    'Chat3Line': 'RiChat3Line',
    'Notification3Line': 'RiNotification3Line',
    'ExternalLinkLine': 'RiExternalLinkLine',
    'GalleryView2Line': 'RiGalleryView2Line',

    # Status
    'Loader4Line': 'RiLoader4Line',
    'InformationLine': 'RiInformationLine',
    'AlarmWarningLine': 'RiAlarmWarningLine',
    'CloseCircleLine': 'RiCloseCircleLine',
    'CheckboxBlankCircleLine': 'RiCheckboxBlankCircleLine',

    # Editor
    'SubtractLine': 'RiSubtractLine',
    'AlignJustify': 'RiAlignJustify',
    'AlignLeft': 'RiAlignLeft',
    'PriceTag3Line': 'RiPriceTag3Line',

    # Theme
    'SunFoggyLine': 'RiSunFoggyLine',
    'MoonLine': 'RiMoonLine',
    'ComputerLine': 'RiComputerLine',
    'GithubLine': 'RiGithubLine',
    'BookOpenLine': 'RiBookOpenLine',
    'Heart2Line': 'RiHeart2Line',

    # Additional
    'UserLine': 'RiUserLine',
    'EyeLine': 'RiEyeLine',
}

def fix_file(file_path):
    """Fix icon imports in a file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        original = content

        # Step 1: Fix individual icon names in imports and usage
        for old, new in ICON_REPLACEMENTS.items():
            # Fix import statements
            content = re.sub(rf'\b{re.escape(old)}\b', new, content)

        # Step 2: Fix the import line to collect all Ri* icons
        # Extract all Ri* icons used
        ri_icons = set(re.findall(r'\b(Ri[A-Za-z0-9]+Line)\b', content))
        ri_icons = sorted(ri_icons)

        # Remove existing remixicon import statement
        content = re.sub(r"import\s*{[^}]+}\s*from\s*'@remixicon/react';\s*\n?", '', content)

        # Add new import at top (after any existing imports)
        if ri_icons:
            import_statement = f"import {{ {', '.join(ri_icons)} }} from '@remixicon/react';\n"
            content = import_statement + content

        # Clean up extra newlines
        content = re.sub(r'\n{3,}', '\n\n', content)
        content = content.strip() + '\n'

        if content != original:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False

    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return False

def main():
    src_dir = Path('/Users/overtrue/www/sparkset/apps/dashboard/src')

    updated = 0
    for file_path in src_dir.rglob('*.tsx'):
        if fix_file(file_path):
            print(f"✓ Fixed: {file_path.relative_to(src_dir.parent)}")
            updated += 1

    print(f"\nUpdated {updated} files")

if __name__ == '__main__':
    main()