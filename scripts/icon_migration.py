#!/usr/bin/env python3
"""
Icon Migration Script
Migrates all lucide-react and @radix-ui/react-icons imports to remixicon-react
"""

import os
import re
from pathlib import Path

# Icon mapping from lucide-react and radix to remixicon-react
ICON_MAPPINGS = {
    # Navigation & Direction
    'ArrowDown': 'ArrowDownLine',
    'ArrowUp': 'ArrowUpLine',
    'ArrowRight': 'ArrowRightLine',
    'ArrowLeft': 'ArrowLeftLine',
    'ChevronDown': 'ArrowDownSLine',
    'ChevronRight': 'ArrowRightSLine',
    'ChevronLeft': 'ArrowLeftSLine',
    'ChevronUp': 'ArrowUpSLine',
    'ChevronsUpDown': 'ExpandVerticalLine',
    'MoreHorizontal': 'More2Line',
    'GripVerticalIcon': 'DragMove2Line',
    'PanelLeftIcon': 'SideBarLine',

    # Actions
    'Play': 'PlayLine',
    'Plus': 'AddLine',
    'Edit': 'Edit2Line',
    'Edit2': 'Edit2Line',
    'Trash2': 'DeleteBin2Line',
    'X': 'CloseLine',
    'Check': 'CheckLine',
    'CheckIcon': 'CheckLine',
    'CheckCircle2': 'CheckboxCircleLine',
    'CircleCheckIcon': 'CheckboxCircleLine',
    'Save': 'Save3Line',
    'Copy': 'Copy2Line',
    'RefreshCw': 'RefreshLine',
    'History': 'TimeLine',
    'Search': 'Search2Line',
    'SearchIcon': 'Search2Line',
    'Star': 'StarLine',

    # Data & System
    'Database': 'Database2Line',
    'Zap': 'FlashlightLine',
    'Sparkles': 'Sparkling2Line',
    'ZapOff': 'FlashlightOffLine',
    'FileText': 'FileTextLine',
    'Code': 'CodeSlashLine',
    'MessageSquare': 'Chat3Line',
    'ExternalLink': 'ExternalLinkLine',
    'GalleryVerticalEnd': 'GalleryView2Line',

    # Status & Feedback
    'Loader2': 'Loader4Line',
    'Loader2Icon': 'Loader4Line',
    'InfoIcon': 'InformationLine',
    'TriangleAlertIcon': 'AlarmWarningLine',
    'OctagonXIcon': 'CloseCircleLine',
    'XCircle': 'CloseCircleLine',
    'Circle': 'CheckboxBlankCircleLine',

    # Editor & Input
    'Minus': 'SubtractLine',
    'MinusIcon': 'SubtractLine',
    'AlignJustify': 'AlignJustify',
    'AlignLeft': 'AlignLeft',
    'AlignDown': 'ArrowDownLine',
    'AlignUp': 'ArrowUpLine',
    'Label': 'PriceTag3Line',

    # Theme/Toggle
    'Sun': 'SunFoggyLine',
    'Moon': 'MoonLine',
    'Monitor': 'ComputerLine',
    'Github': 'GithubLine',
    'BookOpen': 'BookOpenLine',
    'Heart': 'Heart2Line',

    # Additional icons
    'User': 'UserLine',
    'Eye': 'EyeLine',
}

# Radix specific replacements
RADIX_MAPPINGS = {
    'BellIcon': 'Notification3Line',
    'CheckIcon': 'CheckLine',
    'CaretSortIcon': 'ArrowUpDownLine',
    'CaretSortIcon': 'ArrowUpDownLine',
}

def create_import_string(icons):
    """Create an import statement from list of icon names"""
    if not icons:
        return ''
    return ', '.join(sorted(set(icons)))

def check_file_needs_processing(file_path):
    """Check if file needs icon migration"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        return 'lucide-react' in content or '@radix-ui/react-icons' in content
    except:
        return False

def process_file(file_path):
    """Process a single file to replace icons"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content

        # Collect all icons to import
        needed_icons = set()

        # Step 1: Handle imports
        # Find lucide-react imports
        lucide_regex = r'import\s*{([^}]+)}\s*from\s*[\'"]lucide-react[\'"]\s*;?\s*'
        lucide_matches = re.findall(lucide_regex, content)
        for match in lucide_matches:
            icons = [icon.strip() for icon in match.split(',')]
            for icon in icons:
                if icon in ICON_MAPPINGS:
                    needed_icons.add(ICON_MAPPINGS[icon])
                    # Also map the specific icon usage in JSX
                    content = content.replace(f'<{icon} ', f'<{ICON_MAPPINGS[icon]} ')
                    content = content.replace(f'<{icon}Icon ', f'<{ICON_MAPPINGS[icon]} ')
                    content = content.replace(f'typeof {icon}', f'typeof {ICON_MAPPINGS[icon]}')
                    content = content.replace(f' {icon},', f' {ICON_MAPPINGS[icon]},')
                    content = content.replace(f' {icon}}}', f' {ICON_MAPPINGS[icon]}}}')
                    content = content.replace(f'icon: {icon},', f'icon: {ICON_MAPPINGS[icon]},')

        # Find radix imports
        radix_regex = r'import\s*{([^}]+)}\s*from\s*[\'"]@radix-ui/react-icons[\'"]\s*;?\s*'
        radix_matches = re.findall(radix_regex, content)
        for match in radix_matches:
            icons = [icon.strip() for icon in match.split(',')]
            for icon in icons:
                if icon in RADIX_MAPPINGS:
                    remix_icon = RADIX_MAPPINGS[icon]
                    needed_icons.add(remix_icon)
                    # Replace JSX usage
                    content = content.replace(f'<{icon}className="', f'<{remix_icon}className="')
                    content = content.replace(f'<{icon} ', f'<{remix_icon} ')
                    content = content.replace(f'from {icon};', f'from {remix_icon};')

        # Remove all old imports
        content = re.sub(lucide_regex, '', content)
        content = re.sub(radix_regex, '', content)
        content = re.sub(r'import\s+type\s*{[^}]+}\s*from\s*[\'"]lucide-react[\'"]\s*;?\s*', '', content)

        # Step 2: Add new import
        if needed_icons:
            new_import = f"import {{ {create_import_string(needed_icons)} }} from 'remixicon-react';\n"
            # Insert after any existing remixicon-react imports, or at top
            if 'remixicon-react' in content:
                lines = content.split('\n')
                for i, line in enumerate(lines):
                    if 'remixicon-react' in line:
                        # Add icons to existing import
                        if 'import {' in line:
                            existing_icons = re.search(r'\{([^}]+)\}', line)
                            if existing_icons:
                                current_icons = [x.strip() for x in existing_icons.group(1).split(',')]
                                all_icons = list(set(current_icons + list(needed_icons)))
                                new_line = f"import {{ {create_import_string(all_icons)} }} from 'remixicon-react';"
                                lines[i] = new_line
                                content = '\n'.join(lines)
                                break
                else:
                    # No remixicon-react import found yet, need to add
                    lines = content.split('\n')
                    insert_pos = 0
                    for i, line in enumerate(lines):
                        if line.strip() and not line.strip().startswith('//') and not line.strip().startswith('/*'):
                            insert_pos = i
                            break
                    lines.insert(insert_pos, new_import.strip())
                    content = '\n'.join(lines)
            else:
                # No remixicon-react import, add after license/header comment if any
                lines = content.split('\n')
                insert_pos = 0
                for i, line in enumerate(lines):
                    if line.strip() and not line.strip().startswith('//') and not line.strip().startswith('/*'):
                        insert_pos = i
                        break
                lines.insert(insert_pos, new_import.strip())
                content = '\n'.join(lines)

        # Resolve LucideIcon type usage
        # Replace LucideIcon type with generic component type
        content = re.sub(r'import\s+type\s*{\s*LucideIcon\s*}\s*from\s*[\'"]lucide-react[\'"]\s*;?\s*', '', content)
        content = re.sub(r':\s*LucideIcon', ': React.ComponentType<React.SVGProps<SVGSVGElement>>', content)
        content = re.sub(r'LucideIcon', 'React.ComponentType<React.SVGProps<SVGSVGElement>>', content)

        # Clean up multiple lines
        content = re.sub(r'\n{3,}', '\n\n', content).strip() + '\n'

        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False

    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return False

def main():
    """Main migration function"""
    print("Starting icon migration to Remix Icon...")
    print("=" * 60)

    src_dir = Path('/Users/overtrue/www/sparkset/apps/dashboard/src')
    if not src_dir.exists():
        print("Error: src directory not found")
        return

    files_to_process = []
    for ext in ['*.tsx', '*.ts']:
        files_to_process.extend(src_dir.rglob(ext))

    print(f"Found {len(files_to_process)} potential files to process")

    files_changed = 0
    for file_path in files_to_process:
        str_path = str(file_path)
        # Skip if not needs processing
        if not check_file_needs_processing(str_path):
            continue

        print(f"Processing: {file_path.relative_to(src_dir.parent)}")
        if process_file(str_path):
            files_changed += 1

    print("=" * 60)
    print(f"✅ Migration completed! Files updated: {files_changed}")
    print("\n⚠️  Manual review needed:")
    print("- Verify all imports are correct")
    print("- Run TypeScript compiler to catch any issues")
    print("- Test icon displays in UI")

if __name__ == '__main__':
    main()