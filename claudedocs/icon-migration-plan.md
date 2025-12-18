# Remix Icon Migration Plan

## Overview

Migrating from `lucide-react` (50+ icons) and `@radix-ui/react-icons` (1 icon) to `remixicon-react`.

## Icon Mapping Strategy

### Navigation & Direction Icons

| Lucide Icon          | Remix Icon Equivalent  | Notes                             |
| -------------------- | ---------------------- | --------------------------------- |
| `ArrowDown`          | `arrow-down-line`      | Direct mapping                    |
| `ArrowUp`            | `arrow-up-line`        | Direct mapping                    |
| `ArrowRight`         | `arrow-right-line`     | Direct mapping                    |
| `ArrowLeft`          | `arrow-left-line`      | Direct mapping                    |
| `ChevronDown`        | `arrow-down-s-line`    | "S" variant for smaller chevrons  |
| `ChevronRight`       | `arrow-right-s-line`   | "S" variant for smaller chevrons  |
| `ChevronLeft`        | `arrow-left-s-line`    | "S" variant for smaller chevrons  |
| `ChevronUp`          | `arrow-up-s-line`      | "S" variant for smaller chevrons  |
| `ChevronsUpDown`     | `expand-vertical-line` | Similar vertical expansion effect |
| `CaretSortIcon`      | `arrow-up-down-line`   | Sort/swap direction               |
| `MoreHorizontal`     | `more-2-line`          | Horizontal ellipsis menu          |
| `MoreHorizontalIcon` | `more-2-line`          | Same as above                     |
| `GripVerticalIcon`   | `drag-move-2-line`     | Vertical grip handle              |
| `PanelLeftIcon`      | `side-bar-line`        | Left panel/sidebar                |

### Actions & Operation Icons

| Lucide Icon       | Remix Icon Equivalent  | Notes                      |
| ----------------- | ---------------------- | -------------------------- |
| `Play`            | `play-line`            | Direct mapping             |
| `Plus`            | `add-line`             | Add action                 |
| `Edit`            | `edit-2-line`          | Edit action                |
| `Edit2`           | `edit-2-line`          | Same as Edit               |
| `Trash2`          | `delete-bin-2-line`    | Delete action              |
| `X`               | `close-line`           | Close/dismiss              |
| `Check`           | `check-line`           | Checkmark                  |
| `CheckIcon`       | `check-line`           | Same as Check              |
| `CheckCircle2`    | `checkbox-circle-line` | Circle checkmark           |
| `CircleCheckIcon` | `checkbox-circle-line` | Same as above              |
| `Save`            | `save-3-line`          | Save action                |
| `Copy`            | `copy-2-line`          | Copy action                |
| `RefreshCw`       | `refresh-line`         | Refresh/clockwise rotation |
| `History`         | `time-line`            | Time/history icon          |
| `Search`          | `search-2-line`        | Search action              |
| `SearchIcon`      | `search-2-line`        | Same as Search             |
| `Star`            | `star-line`            | Star/favorite              |

### Data & System Icons

| Lucide Icon          | Remix Icon Equivalent | Notes                                    |
| -------------------- | --------------------- | ---------------------------------------- |
| `Database`           | `database-2-line`     | Database connection                      |
| `Zap`                | `flashlight-line`     | Lightning/quick action                   |
| `Sparkles`           | `sparkling-2-line`    | Sparkles/AI magic                        |
| `ZapOff`             | `flashlight-off-line` | Disabled lightning                       |
| `FileText`           | `file-text-line`      | Document icon                            |
| `Code`               | `code-s-slash-line`   | Code/development                         |
| `MessageSquare`      | `chat-3-line`         | Chat/message                             |
| `BellIcon`           | `notification-3-line` | Notification bell (Radix UI replacement) |
| `ExternalLink`       | `external-link-line`  | External link                            |
| `GalleryVerticalEnd` | `gallery-view-2-line` | Gallery/layout view                      |

### Status & Feedback Icons

| Lucide Icon         | Remix Icon Equivalent        | Notes                         |
| ------------------- | ---------------------------- | ----------------------------- |
| `Loader2`           | `loader-4-line`              | Loading spinner               |
| `Loader2Icon`       | `loader-4-line`              | Same as Loader2               |
| `InfoIcon`          | `information-line`           | Information                   |
| `TriangleAlertIcon` | `alarm-warning-line`         | Warning triangle              |
| `OctagonXIcon`      | `close-circle-line`          | Error/stop (octagon → circle) |
| `XCircle`           | `close-circle-line`          | Close circle                  |
| `Circle`            | `checkbox-blank-circle-line` | Empty circle                  |

### Editor & Input Icons

| Lucide Icon    | Remix Icon Equivalent | Notes                          |
| -------------- | --------------------- | ------------------------------ |
| `Minus`        | `subtract-line`       | Minus/dash                     |
| `MinusIcon`    | `subtract-line`       | Same as Minus                  |
| `AlignJustify` | `align-justify`       | Justify alignment              |
| `AlignLeft`    | `align-left`          | Left alignment                 |
| `AlignDown`    | `arrow-down-line`     | Down arrow (alignment?)        |
| `AlignUp`      | `arrow-up-line`       | Up arrow (alignment?)          |
| `Label`        | `price-tag-3-line`    | Tag/label (or `bookmark-line`) |

## React Component API Compatibility

### Current Pattern (lucide-react):

```tsx
import { Play } from 'lucide-react';
<Play className="h-4 w-4 text-primary" />;
```

### New Pattern (remixicon-react):

```tsx
import { PlayLine } from 'remixicon-react';
<PlayLine className="h-4 w-4 text-primary" />;
```

**Note**: Remix Icon uses PascalCase naming with "Line" suffix for outlined icons, which is similar to many other icon libraries.

## Migration Steps

### 1. Update package.json

```diff
{
  "dependencies": {
-   "lucide-react": "^0.556.0",
-   "@radix-ui/react-icons": "^1.3.2",
+   "remixicon-react": "^1.0.0",
    // ... other dependencies
  }
}
```

### 2. Import Statement Changes

```tsx
// Before
import {
  Play,
  Plus,
  Edit,
  Trash2,
  X,
  Check,
  CheckCircle2,
  Save,
  Copy,
  RefreshCw,
  History,
  Search,
  Star,
  Database,
  Zap,
  Sparkles,
  ZapOff,
  FileText,
  Code,
  MessageSquare,
  Loader2,
  InfoIcon,
  TriangleAlertIcon,
  OctagonXIcon,
  XCircle,
  Circle,
  Minus,
  MinusIcon,
  AlignJustify,
  AlignLeft,
  AlignDown,
  AlignUp,
  ArrowDown,
  ArrowUp,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  ChevronsUpDown,
  CaretSortIcon,
  MoreHorizontal,
  MoreHorizontalIcon,
  GripVerticalIcon,
  PanelLeftIcon,
  BellIcon,
  ExternalLink,
  GalleryVerticalEnd,
} from 'lucide-react';

import { BellIcon as RadixBell } from '@radix-ui/react-icons';

// After
import {
  PlayLine,
  AddLine,
  Edit2Line,
  DeleteBin2Line,
  CloseLine,
  CheckLine,
  CheckboxCircleLine,
  Save3Line,
  Copy2Line,
  RefreshLine,
  TimeLine,
  Search2Line,
  StarLine,
  Database2Line,
  FlashlightLine,
  Sparkling2Line,
  FlashlightOffLine,
  FileTextLine,
  CodeSlashLine,
  Chat3Line,
  Loader4Line,
  InformationLine,
  AlarmWarningLine,
  CloseCircleLine,
  CloseCircleLine,
  CheckboxBlankCircleLine,
  SubtractLine,
  SubtractLine,
  AlignJustify,
  AlignLeft,
  ArrowDownLine,
  ArrowUpLine,
  ArrowRightLine,
  ArrowLeftLine,
  ArrowDownSLine,
  ArrowRightSLine,
  ArrowLeftSLine,
  ArrowUpSLine,
  ExpandVerticalLine,
  ArrowUpDownLine,
  More2Line,
  More2Line,
  DragMove2Line,
  SideBarLine,
  Notification3Line,
  ExternalLinkLine,
  GalleryView2Line,
} from 'remixicon-react';
```

### 3. Toast Configuration Updates

```tsx
// Before
icons={{
  success: <CircleCheckIcon className="size-4" />,
  info: <InfoIcon className="size-4" />,
  warning: <TriangleAlertIcon className="size-4" />,
  error: <OctagonXIcon className="size-4" />,
  loading: <Loader2Icon className="size-4 animate-spin" />,
}}

// After
icons={{
  success: <CheckboxCircleLine className="size-4" />,
  info: <InformationLine className="size-4" />,
  warning: <AlarmWarningLine className="size-4" />,
  error: <CloseCircleLine className="size-4" />,
  loading: <Loader4Line className="size-4 animate-spin" />,
}}
```

### 4. Dynamic Icon Assignment Updates

```tsx
// Before
const Icon = item.icon; // LucideIcon type

// After - Package needs compatible type
// May need type adapter or switch to direct component references
```

## Files to Update

Based on exploration results (52 files with lucide-react, 1 with radix):

### High Priority (Direct imports):

1. `app/layout.tsx` - Radix BellIcon
2. All components in `src/components/ui/` (15 files)
3. `src/components/action/manager.tsx` - Row actions with icons
4. `src/components/data-table-empty-state.tsx` - Context icons
5. `src/components/onboarding.tsx` - Todo item icons
6. `src/components/theme-toggle.tsx` - Theme icons
7. `src/components/datasource/` components
8. `src/components/ai-provider/` components
9. `src/components/query/` components
10. Any remaining usage in `src/app/` directories

## Components with Complex Icon Patterns

### 1. **Action Manager** (`action/manager.tsx`)

- Uses icon arrays with dynamic states
- Need careful type conversion for icon props
- Current: `icon: <Play className={...} />`
- After: `icon: <PlayLine className={...} />`

### 2. **App Sidebar** (`app-sidebar.tsx`)

- Uses `LucideIcon` type references
- May need type definition updates
- Structures menu items with icon properties

### 3. **Empty State Component** (`data-table-empty-state.tsx`)

- Context-aware icon selection logic
- Switch statements based on item types
- Maps to appropriate actions/datasources

## Migration Risk Assessment

### Risk Level: 🔴 **Medium Risk**

- **Volume**: 50+ files need updates
- **Type Changes**: Potential type compatibility issues
- **Dynamic Usage**: Icon references in arrays/props
- **API Differences**: Similar but not identical component APIs

### Key Concerns:

1. **Dynamic Icon Assignment**: Components using `icon: <CurrentIcon />` need careful migration
2. **Type Compatibility**: `LucideIcon` type vs Remix Icon's component type
3. **API Consistency**: Maintain existing className and prop patterns
4. **CSS Compatibility**: Verify Tailwind classes work identically

### Mitigation Strategy:

1. **Systematic Replacement**: Use find/replace with regex patterns
2. **Type Verification**: Ensure type compatibility for prop usage
3. **Component Testing**: Verify each UI component after changes
4. **Rollback Plan**: Git commit before changes for easy rollback

## Next Steps

1. **Install remixicon-react** and update package.json
2. **Create icon mapping script** for systematic replacement
3. **Update import statements** across all files
4. **Verify component compatibility** for dynamic icon usage
5. **Test all UI components** for visual consistency
6. **Run build/development** to catch any issues
7. **Clean up** any deprecated imports or references

## Verification Checklist

- [ ] All 68+ files updated with new import paths
- [ ] Dynamic icon props work with new components
- [ ] Toast notifications show correct icons
- [ ] Sidebar navigation icons display properly
- [ ] Action buttons show appropriate icons
- [ ] Empty states render correctly
- [ ] Theme toggle works with new sun/moon icons
- [ ] No TypeScript errors from icon types
- [ ] All visual tests pass
- [ ] Bundle size is acceptable
- [ ] Build completes successfully
