# Icon Replacement Rules for Remix Icon Migration

## Import Statement Replacements

### Standard Icon Imports

```typescript
// From patterns like:
import { Icon1, Icon2, Icon3 } from 'lucide-react';
import { SomeIcon } from '@radix-ui/react-icons';

// To:
import { Icon1Line, Icon2Line, Icon3Line } from 'remixicon-react';
```

### Single Icon Case (Radix Change)

```typescript
// Original (app/layout.tsx):
import { BellIcon } from '@radix-ui/react-icons';

// Replace with:
import { Notification3Line } from 'remixicon-react';
```

### Type Import Changes

```typescript
// Original (app-sidebar.tsx):
import type { LucideIcon } from 'lucide-react';

// This needs special handling - see "Type Compatibility" section
```

## Icon Name Mapping

### Navigation & Direction

| Original (lucide)    | Remix Icon           | Notes                           |
| -------------------- | -------------------- | ------------------------------- |
| `ArrowDown`          | `ArrowDownLine`      | ✅ Straightforward              |
| `ArrowUp`            | `ArrowUpLine`        | ✅ Straightforward              |
| `ArrowRight`         | `ArrowRightLine`     | ✅ Straightforward              |
| `ArrowLeft`          | `ArrowLeftLine`      | ✅ Straightforward              |
| `ChevronDown`        | `ArrowDownSLine`     | Use S-line variant for chevrons |
| `ChevronRight`       | `ArrowRightSLine`    | Use S-line variant for chevrons |
| `ChevronLeft`        | `ArrowLeftSLine`     | Use S-line variant for chevrons |
| `ChevronUp`          | `ArrowUpSLine`       | Use S-line variant for chevrons |
| `ChevronsUpDown`     | `ExpandVerticalLine` | Similar horizontal expansion    |
| `CaretSortIcon`      | `ArrowUpDownLine`    | Sort/swap pattern               |
| `MoreHorizontal`     | `More2Line`          | Horizontal menu                 |
| `MoreHorizontalIcon` | `More2Line`          | Same as above                   |
| `GripVerticalIcon`   | `DragMove2Line`      | Drag handle                     |
| `PanelLeftIcon`      | `SideBarLine`        | Sidebar/panel                   |

### Actions & Operations

| Original (lucide) | Remix Icon           | Notes             |
| ----------------- | -------------------- | ----------------- |
| `Play`            | `PlayLine`           | ✅ Direct mapping |
| `Plus`            | `AddLine`            | Add/action        |
| `Edit`            | `Edit2Line`          | Edit action       |
| `Edit2`           | `Edit2Line`          | Same as Edit      |
| `Trash2`          | `DeleteBin2Line`     | Delete action     |
| `X`               | `CloseLine`          | Close/dismiss     |
| `Check`           | `CheckLine`          | Checkmark         |
| `CheckIcon`       | `CheckLine`          | Same as Check     |
| `CheckCircle2`    | `CheckboxCircleLine` | Circle check      |
| `CircleCheckIcon` | `CheckboxCircleLine` | Same as above     |
| `Save`            | `Save3Line`          | Save action       |
| `Copy`            | `Copy2Line`          | Copy action       |
| `RefreshCw`       | `RefreshLine`        | Refresh/reset     |
| `History`         | `TimeLine`           | Time/history      |
| `Search`          | `Search2Line`        | Search action     |
| `SearchIcon`      | `Search2Line`        | Same as Search    |
| `Star`            | `StarLine`           | Star/favorite     |

### Data & System Icons

| Original (lucide)    | Remix Icon          | Notes                               |
| -------------------- | ------------------- | ----------------------------------- |
| `Database`           | `Database2Line`     | Database                            |
| `Zap`                | `FlashlightLine`    | Lightning/quick                     |
| `Sparkles`           | `Sparkling2Line`    | Sparkles/AI magic                   |
| `ZapOff`             | `FlashlightOffLine` | Disabled flash                      |
| `FileText`           | `FileTextLine`      | Document                            |
| `Code`               | `CodeSlashLine`     | Code parenthesis                    |
| `MessageSquare`      | `Chat3Line`         | Chat/message                        |
| `BellIcon`           | `Notification3Line` | ✅ Notification (Radix replacement) |
| `ExternalLink`       | `ExternalLinkLine`  | External link                       |
| `GalleryVerticalEnd` | `GalleryView2Line`  | Gallery/layout                      |

### Status & Feedback Icons

| Original (lucide)   | Remix Icon                | Notes                  |
| ------------------- | ------------------------- | ---------------------- |
| `Loader2`           | `Loader4Line`             | Loading spinner        |
| `Loader2Icon`       | `Loader4Line`             | Same as Loader2        |
| `InfoIcon`          | `InformationLine`         | Information            |
| `TriangleAlertIcon` | `AlarmWarningLine`        | Warning triangle       |
| `OctagonXIcon`      | `CloseCircleLine`         | Error (octagon→circle) |
| `XCircle`           | `CloseCircleLine`         | Close/stop             |
| `Circle`            | `CheckboxBlankCircleLine` | Empty circle           |

### Editor & Input Icons

| Original (lucide) | Remix Icon      | Notes               |
| ----------------- | --------------- | ------------------- |
| `Minus`           | `SubtractLine`  | Minus/dash          |
| `MinusIcon`       | `SubtractLine`  | Same                |
| `AlignJustify`    | `AlignJustify`  | Same name available |
| `AlignLeft`       | `AlignLeft`     | Same name available |
| `AlignDown`       | `ArrowDownLine` | Reuse arrow         |
| `AlignUp`         | `ArrowUpLine`   | Reuse arrow         |
| `Label`           | `PriceTag3Line` | Tag/price           |

### Theme/Toggle Icons

| Original (lucide) | Remix Icon     | Notes           |
| ----------------- | -------------- | --------------- |
| `Sun`             | `SunFoggyLine` | Sun/light mode  |
| `Moon`            | `MoonLine`     | Moon/dark mode  |
| `Monitor`         | `ComputerLine` | System/computer |
| `Github`          | `GithubLine`   | ✅ Available    |
| `BookOpen`        | `BookOpenLine` | ✅ Available    |
| `Heart`           | `Heart2Line`   | ✅ Available    |

### Additional Icons Needed

```typescript
// Found in exploration:
import { Eye } from 'lucide-react'; // → EyeLine
import { User } from 'lucide-react'; // → UserLine
```

## Usage Patterns

### Component JSX Conversion

```typescript
// Before:
<Play className="h-4 w-4" />
<Database className="h-6 w-6 text-blue-500" />
<Loader2 className="h-4 w-4 animate-spin" />

// After (same structure):
<PlayLine className="h-4 w-4" />
<Database2Line className="h-6 w-6 text-blue-500" />
<Loader4Line className="h-4 w-4 animate-spin" />
```

### Dynamic Icon Props

```typescript
// Before (file: manager.tsx line 363):
icon: <Play className={`h-4 w-4 ${isExecuting ? 'animate-spin' : ''}`} />

// After:
icon: <PlayLine className={`h-4 w-4 ${isExecuting ? 'animate-spin' : ''}`} />

// Before (onboarding.tsx):
const Icon = todo.icon;  // Type: typeof Database
<Icon className="h-5 w-5" />

// After (TypeScript changes needed):
type RemixIconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;
const Icon = todo.icon as RemixIconComponent;
<Icon className="h-5 w-5" />
```

### Toast Configuration

```typescript
// Before:
icons={{
  success: <CircleCheckIcon className="size-4" />,
  info: <InfoIcon className="size-4" />,
  warning: <TriangleAlertIcon className="size-4" />,
  error: <OctagonXIcon className="size-4" />,
  loading: <Loader2Icon className="size-4" />,
}}

// After:
icons={{
  success: <CheckboxCircleLine className="size-4" />,
  info: <InformationLine className="size-4" />,
  warning: <AlarmWarningLine className="size-4" />,
  error: <CloseCircleLine className="size-4" />,
  loading: <Loader4Line className="size-4" />,
}}
```

## Type Compatibility Issues

### LucideIcon Type Problem

```typescript
// Original type usage (app-sidebar.tsx:25):
import type { LucideIcon } from 'lucide-react';

// Problem: No direct equivalent in remixicon-react
// Solutions:
// Option 1: Basic type
type RemixIconType = React.ComponentType<React.SVGProps<SVGSVGElement>>;

// Option 2: Generic icon type
type IconComponent = React.ForwardRefExoticComponent<
  React.PropsWithoutRef<React.SVGProps<SVGSVGElement>> & { title?: string; titleId?: string }
>;

// Option 3: Any for migration (then narrow down)
type IconType = any;
```

### Menu Item Structure

```typescript
// Original (app-sidebar.tsx:38-41):
{ title: '查询', url: '/query', icon: Play },
{ title: 'Actions', url: '/actions', icon: Zap },

// Updated:
{ title: '查询', url: '/query', icon: PlayLine },
{ title: 'Actions', url: '/actions', icon: FlashlightLine },
```

## Execution Strategy

### Phase 1: Basic Import Replacements

1. Update all imports from `lucide-react` to `remixicon-react`
2. Update Radix import in `app/layout.tsx`
3. Replace with correct \*Line suffixes

### Phase 2: Component Usage Updates

1. Find/replace JSX components
2. Update icon in prop patterns
3. Handle toast configuration

### Phase 3: Type System Updates

1. Fix LucideIcon type dependencies
2. Update icon component props
3. Verify TypeScript compilation

### Phase 4: Verification

1. Check all files are updated
2. Run type checker
3. Visual verification in dev mode

## Files Priority List

### Critical (High Impact)

- ✅ `apps/dashboard/package.json` - DONE
- `apps/dashboard/src/app/layout.tsx` - Radix → Remix
- `apps/dashboard/src/components/ui/sonner.tsx` - Toast icons
- `apps/dashboard/src/components/app-sidebar.tsx` - LucideIcon type + icons
- `apps/dashboard/src/components/onboarding.tsx` - Dynamic icon assignment

### High Priority

- `apps/dashboard/src/components/action/manager.tsx` - Row action icons
- `apps/dashboard/src/components/ai-provider/manager.tsx` - Action buttons
- `apps/dashboard/src/components/datasource/manager.tsx` - Button icons
- `apps/dashboard/src/components/datasource/detail.tsx` - Detail view icons

### Medium Priority (UI Components)

- All files in `src/components/ui/`
- Query components (`query/` directory)
- Data table components (`data-table/`)
- Conversation components (`conversation/`)

### Low Priority (Single/Minor Icons)

- Theme toggle (3 icons)
- Version switcher (2 icons)
- Search form (1 icon)

This represents ~50 files total changing imports, ~68+ icon instances to update.
