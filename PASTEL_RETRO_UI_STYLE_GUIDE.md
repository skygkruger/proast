# Pastel Retro Terminal UI Style Guide
## The Official Design System for All SaaS Products

**Version:** 1.0  
**Last Updated:** January 2025  
**Codename:** "BBS Vaporwave"

---

## Table of Contents

1. [Design Philosophy](#1-design-philosophy)
2. [Color System](#2-color-system)
3. [Typography](#3-typography)
4. [Box Drawing & Borders](#4-box-drawing--borders)
5. [ASCII Iconography](#5-ascii-iconography)
6. [Component Library](#6-component-library)
7. [Layout Patterns](#7-layout-patterns)
8. [Animation & Interaction](#8-animation--interaction)
9. [Product Color Variations](#9-product-color-variations)
10. [Code Examples](#10-code-examples)
11. [Do's and Don'ts](#11-dos-and-donts)

---

## 1. Design Philosophy

### Core Principles

1. **Nostalgic but Fresh** - Evokes BBS/DOS/early internet aesthetics without feeling dated
2. **Soft, Not Harsh** - Pastel colors instead of neon; easy on the eyes for long coding sessions
3. **Text is Interface** - Box-drawing characters and ASCII art ARE the UI, not decorations
4. **Monospace Everything** - Consistent character grid creates visual harmony
5. **Functional Retro** - Every design choice serves usability, not just aesthetics

### Inspirations

- BBS (Bulletin Board Systems) interfaces
- DOS applications and menus
- Early terminal emulators
- Vaporwave color aesthetics
- ASCII art culture
- Retro computing (Amiga, C64, early Mac)

### The Feeling We Want

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   "Like discovering a beautifully crafted tool someone     │
│    left running on a forgotten server from 1992,           │
│    but it works perfectly and looks gorgeous."              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Color System

### Base Palette

```
BACKGROUND COLORS
─────────────────────────────────────────────────────────────
Name              Hex        RGB              Usage
─────────────────────────────────────────────────────────────
Deep Navy         #1a1a2e    (26, 26, 46)     Primary background
Card Dark         #16161a    (22, 22, 26)     Elevated surfaces
Card Light        #232336    (35, 35, 54)     Hover states
```

```
TEXT COLORS
─────────────────────────────────────────────────────────────
Name              Hex        RGB              Usage
─────────────────────────────────────────────────────────────
Text Primary      #e8e3e3    (232, 227, 227)  Main content
Text Secondary    #a8b2c3    (168, 178, 195)  Secondary content
Text Muted        #6e6a86    (110, 106, 134)  Disabled/comments
```

```
ACCENT COLORS (Pastels)
─────────────────────────────────────────────────────────────
Name              Hex        RGB              Usage
─────────────────────────────────────────────────────────────
Soft Cyan         #7eb8da    (126, 184, 218)  Primary accent, links
Soft Mint         #a8d8b9    (168, 216, 185)  Success, positive
Soft Lavender     #c4a7e7    (196, 167, 231)  Pro/premium features
Soft Rose         #f2cdcd    (242, 205, 205)  Highlights, cursor
Soft Peach        #f5a97f    (245, 169, 127)  Warnings (soft)
Soft Cream        #ffe9b0    (255, 233, 176)  Caution, processing
Soft Coral        #eb6f92    (235, 111, 146)  Errors, destructive
```

### Color Usage Rules

1. **Background is always deep navy** - Never pure black, never gray
2. **One primary accent per product** - Each SaaS has a signature color
3. **Success = Mint, Error = Coral** - Consistent across all products
4. **Lavender = Premium** - Always indicates Pro/paid features
5. **Rose for interaction** - Cursor, focus states, active elements

### Contrast Guidelines

```
MINIMUM CONTRAST RATIOS
─────────────────────────────────────────────────────────────
Text Primary on Deep Navy:      12.5:1  [PASS AAA]
Text Secondary on Deep Navy:     7.2:1  [PASS AAA]
Text Muted on Deep Navy:         3.8:1  [PASS AA for large]
Soft Cyan on Deep Navy:          6.1:1  [PASS AA]
```

---

## 3. Typography

### Font Stack

```css
font-family: 
  'JetBrains Mono',      /* Primary - best for code */
  'Fira Code',           /* Fallback 1 */
  'SF Mono',             /* Fallback 2 (Mac) */
  'Cascadia Code',       /* Fallback 3 (Windows) */
  'Consolas',            /* Fallback 4 */
  monospace;             /* System fallback */
```

### Font Sizes

```
SIZE SCALE (Monospace Grid)
─────────────────────────────────────────────────────────────
Name          Size      Line Height    Usage
─────────────────────────────────────────────────────────────
xs            10px      1.4            Fine print, badges
sm            12px      1.5            Secondary text, labels
base          14px      1.6            Body text, inputs
lg            16px      1.5            Headings (in boxes)
xl            20px      1.4            ASCII art headers
```

### Text Styling Rules

1. **No bold** - Use color or CAPS for emphasis
2. **No italic** - Breaks monospace grid
3. **UPPERCASE for labels** - Section headers, button text
4. **lowercase for content** - User input, descriptions
5. **Tracking (letter-spacing)** - Use `0.05em-0.2em` for headers

---

## 4. Box Drawing & Borders

### Character Set

```
SINGLE LINE (Standard containers)
─────────────────────────────────────────────────────────────
Horizontal:   ─
Vertical:     │
Corners:      ┌ ┐ └ ┘
T-Joins:      ├ ┤ ┬ ┴
Cross:        ┼
```

```
DOUBLE LINE (Emphasis, premium, important)
─────────────────────────────────────────────────────────────
Horizontal:   ═
Vertical:     ║
Corners:      ╔ ╗ ╚ ╝
T-Joins:      ╠ ╣ ╦ ╩
Cross:        ╬
```

```
PROGRESS/DENSITY BLOCKS
─────────────────────────────────────────────────────────────
Light:        ░
Medium:       ▒
Dark:         ▓
Full:         █
```

### Box Hierarchy

```
LEVEL 1: Page sections (double line)
╔═══════════════════════════════════════════╗
║  MAIN CONTENT AREA                        ║
╚═══════════════════════════════════════════╝

LEVEL 2: Cards/containers (single line)
┌───────────────────────────────────────────┐
│  Standard container                       │
└───────────────────────────────────────────┘

LEVEL 3: Nested elements (single line, no top)
├───────────────────────────────────────────┤
│  Nested content                           │
└───────────────────────────────────────────┘

LEVEL 4: Inline grouping (brackets)
[  inline element  ]
```

### Standard Box Templates

```
BASIC CARD
┌─────────────────────────────────────────────────────────────┐
│  TITLE                                                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Content goes here                                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘

CARD WITH CONTROLS
┌─────────────────────────────────────────────────────────────┐
│  TITLE                                              [-][x]  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Content                                                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘

PREMIUM/EMPHASIZED CARD
╔═════════════════════════════════════════════════════════════╗
║  IMPORTANT CONTENT                                          ║
╠═════════════════════════════════════════════════════════════╣
║                                                             ║
║  Premium or highlighted content                             ║
║                                                             ║
╚═════════════════════════════════════════════════════════════╝
```

---

## 5. ASCII Iconography

### Standard Icon Set

```
ACTIONS
─────────────────────────────────────────────────────────────
[>]     Play/Start/Submit/Generate
[=]     Pause/Stop
[x]     Close/Delete/Cancel
[+]     Add/New/Create
[-]     Remove/Minimize
[?]     Help/Explain/Info
[:]     Copy/Duplicate
[/]     Check/Success/Enabled
[ ]     Unchecked/Empty/Disabled
[*]     Star/Featured/Selected
[^]     Upload/Up
[v]     Download/Down
[<]     Back/Previous
[>]     Next/Forward
[@]     User/Account
[#]     Settings/Config
[!]     Warning/Alert
[~]     Loading/Processing
```

```
STATUS INDICATORS
─────────────────────────────────────────────────────────────
(o)     Online/Active/Connected
( )     Offline/Inactive/Disconnected
(*)     Selected (radio button)
(x)     Error state
(~)     Processing/Loading
(?)     Unknown/Pending
```

```
EMOTICONS (for severity/mood)
─────────────────────────────────────────────────────────────
:)      Gentle/Happy/Success
:|      Neutral/Honest
:(      Sad/Warning
>:(     Angry/Brutal
X_X     Dead/Savage/Critical
<3      Love/Favorite/Popular
:D      Very happy/Celebration
:/      Uncertain/Mixed
```

```
DECORATIVE
─────────────────────────────────────────────────────────────
>>>     Arrow right (navigation)
<<<     Arrow left (navigation)
...     Ellipsis (loading/truncated)
---     Divider (light)
===     Divider (heavy)
***     Separator (decorative)
·:·     Decorative dots
```

### Icon Usage Examples

```
BUTTON EXAMPLES
┌───────────────────┐    ┌───────────────────┐
│  [>] GENERATE     │    │  [?] EXPLAIN      │
└───────────────────┘    └───────────────────┘

┌───────────────────┐    ┌───────────────────┐
│  [+] NEW PROJECT  │    │  [x] DELETE       │
└───────────────────┘    └───────────────────┘

STATUS EXAMPLES
[o] ONLINE     [~] LOADING     [!] ERROR     [*] PRO

CHECKBOX EXAMPLES
[x] Option enabled
[ ] Option disabled
[/] Task complete

RADIO BUTTON EXAMPLES
(*) Selected option
( ) Unselected option
```

---

## 6. Component Library

### Buttons

```
PRIMARY BUTTON (main action)
┌───────────────────┐
│  [>] ACTION       │     Color: Soft Mint (#a8d8b9)
└───────────────────┘

SECONDARY BUTTON (alternate action)
┌───────────────────┐
│  [?] EXPLAIN      │     Color: Soft Lavender (#c4a7e7)
└───────────────────┘

TERTIARY BUTTON (subtle action)
┌───────────────────┐
│  [:] COPY         │     Color: Soft Rose (#f2cdcd)
└───────────────────┘

DESTRUCTIVE BUTTON (dangerous action)
┌───────────────────┐
│  [x] DELETE       │     Color: Soft Coral (#eb6f92)
└───────────────────┘

DISABLED BUTTON
┌───────────────────┐
│  [ ] DISABLED     │     Color: Text Muted (#6e6a86)
└───────────────────┘
```

### Input Fields

```
TEXT INPUT (empty)
┌─────────────────────────────────────────────────────────────┐
│  > placeholder text...█                                     │
└─────────────────────────────────────────────────────────────┘

TEXT INPUT (filled)
┌─────────────────────────────────────────────────────────────┐
│  > user input here█                                         │
└─────────────────────────────────────────────────────────────┘

TEXT INPUT (focused) - Border color changes to accent
┌─────────────────────────────────────────────────────────────┐
│  > typing here...█                                          │
└─────────────────────────────────────────────────────────────┘

TEXTAREA
┌─────────────────────────────────────────────────────────────┐
│  LABEL                                                      │
├─────────────────────────────────────────────────────────────┤
│  > Multi-line content goes here                             │
│    and continues on the next line                           │
│    █                                                        │
└─────────────────────────────────────────────────────────────┘
```

### Selection Controls

```
CHECKBOXES
  [x] Option one (selected)
  [ ] Option two (unselected)
  [x] Option three (selected)
  [-] Option four (indeterminate)

RADIO BUTTONS
  (*) First choice (selected)
  ( ) Second choice
  ( ) Third choice

TOGGLE
  ON:  [====o]
  OFF: [o====]
```

### Tabs

```
HORIZONTAL TABS
┌──────────────┬──────────────┬──────────────┬──────────────┐
│ [*] TAB ONE  │    TAB TWO   │   TAB THREE  │   TAB FOUR   │
└──────────────┴──────────────┴──────────────┴──────────────┘

VERTICAL TABS
┌─────────────────┐
│ [*] SECTION ONE │
├─────────────────┤
│     SECTION TWO │
├─────────────────┤
│   SECTION THREE │
└─────────────────┘
```

### Progress Indicators

```
PROGRESS BAR (percentage)
LOADING: [████████████░░░░░░░░░░░░░] 48%

PROGRESS BAR (steps)
STEP 2/4: [██████████████░░░░░░░░░░] 

PROGRESS BAR (indeterminate)
LOADING: [░▒▓██▓▒░░░░░░░░░░░░░░░░░]

SPINNER (text-based)
Frame 1: (|)
Frame 2: (/)
Frame 3: (-)
Frame 4: (\)

Or: (...) LOADING...
```

### Alerts & Messages

```
SUCCESS
┌─ [/] SUCCESS ────────────────────────────────────────────────┐
│                                                              │
│  Your action was completed successfully.                     │
│                                                              │
└──────────────────────────────────────────────────────────────┘
Color: Soft Mint border

WARNING
┌─ [!] WARNING ────────────────────────────────────────────────┐
│                                                              │
│  Please review before proceeding.                            │
│                                                              │
└──────────────────────────────────────────────────────────────┘
Color: Soft Cream border

ERROR
┌─ [x] ERROR ──────────────────────────────────────────────────┐
│                                                              │
│  Something went wrong. Please try again.                     │
│                                                              │
└──────────────────────────────────────────────────────────────┘
Color: Soft Coral border

INFO
┌─ [?] INFO ───────────────────────────────────────────────────┐
│                                                              │
│  Here's some helpful information.                            │
│                                                              │
└──────────────────────────────────────────────────────────────┘
Color: Soft Cyan border
```

### Cards

```
BASIC CARD
┌─────────────────────────────────────────────────────────────┐
│  CARD TITLE                                                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Card content goes here. Can contain any elements.          │
│                                                             │
│  [>] ACTION                                                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘

PREMIUM CARD (double border)
╔═════════════════════════════════════════════════════════════╗
║  [*] PREMIUM FEATURE                                        ║
╠═════════════════════════════════════════════════════════════╣
║                                                             ║
║  This is highlighted or premium content.                    ║
║                                                             ║
║  ╔═══════════════════╗                                      ║
║  ║  [>] UPGRADE NOW  ║                                      ║
║  ╚═══════════════════╝                                      ║
║                                                             ║
╚═════════════════════════════════════════════════════════════╝
```

### Pricing Cards

```
FREE TIER                          PRO TIER
┌─────────────────────────┐        ╔═════════════════════════╗
│                         │        ║  * * RECOMMENDED * *    ║
│   ┌───┐                 │        ║                         ║
│   │ F │  FREE           │        ║   ╔═══╗                 ║
│   └───┘                 │        ║   ║ P ║  PRO            ║
│                         │        ║   ╚═══╝                 ║
│   $0/forever            │        ║                         ║
│                         │        ║   $X/month              ║
│   [/] Feature one       │        ║                         ║
│   [/] Feature two       │        ║   [/] Everything free   ║
│   [x] Feature three     │        ║   [/] Plus more         ║
│                         │        ║   [/] Premium support   ║
│  ┌───────────────────┐  │        ║                         ║
│  │   CURRENT PLAN    │  │        ║  ╔═══════════════════╗  ║
│  └───────────────────┘  │        ║  ║  [>] UPGRADE NOW  ║  ║
│                         │        ║  ╚═══════════════════╝  ║
└─────────────────────────┘        ╚═════════════════════════╝
```

### Navigation

```
HEADER
╔═════════════════════════════════════════════════════════════╗
║  PRODUCT NAME          [HOME] [DOCS] [PRICING]    [@] USER  ║
╚═════════════════════════════════════════════════════════════╝

BREADCRUMB
HOME >>> DASHBOARD >>> SETTINGS >>> ACCOUNT

PAGINATION
<<< [1] [2] [3] ... [10] >>>
```

---

## 7. Layout Patterns

### Page Structure

```
╔═════════════════════════════════════════════════════════════╗
║  HEADER / NAVIGATION                                        ║
╠═════════════════════════════════════════════════════════════╣
║                                                             ║
║  ┌─────────────────────────────────────────────────────┐   ║
║  │                                                     │   ║
║  │  HERO / MAIN CONTENT AREA                          │   ║
║  │                                                     │   ║
║  └─────────────────────────────────────────────────────┘   ║
║                                                             ║
║  ┌─────────────────┐  ┌─────────────────┐  ┌───────────┐   ║
║  │  FEATURE 1      │  │  FEATURE 2      │  │ FEATURE 3 │   ║
║  └─────────────────┘  └─────────────────┘  └───────────┘   ║
║                                                             ║
╠═════════════════════════════════════════════════════════════╣
║  FOOTER                                                     ║
╚═════════════════════════════════════════════════════════════╝
```

### Spacing System

```
SPACING SCALE (based on character width)
─────────────────────────────────────────────────────────────
Name      Value     Characters    Usage
─────────────────────────────────────────────────────────────
xs        4px       ~0.5 char     Tight spacing
sm        8px       ~1 char       Inline elements
md        16px      ~2 chars      Between components
lg        24px      ~3 chars      Section spacing
xl        32px      ~4 chars      Major sections
2xl       48px      ~6 chars      Page margins
```

### Grid Guidelines

- Use character-based widths when possible (40, 60, 80 chars)
- Standard content width: 60-80 characters
- Mobile: Stack vertically, full width boxes
- Desktop: 2-3 column grids for cards

---

## 8. Animation & Interaction

### Cursor Blink

```css
.cursor {
  animation: blink 1.06s step-end infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
```

### Button Hover

```
RESTING STATE
┌───────────────────┐
│  [>] GENERATE     │
└───────────────────┘

HOVER STATE (translate down 1-2px, optional color brighten)
┌───────────────────┐
│  [>] GENERATE     │
└───────────────────┘
 ↓ (subtle shift)
```

### Loading Animation

```
Frame sequence for text spinner:
[|]  [/]  [-]  [\]  [|]  ...

Or pulsing dots:
.    ..   ...  ..   .    ...
```

### Transitions

- Duration: 100-200ms for micro-interactions
- Duration: 300-400ms for larger state changes
- Easing: `ease-out` for most transitions
- No bounce or spring effects (too modern)

---

## 9. Product Color Variations

Each SaaS product uses the same design system with a unique primary accent color.

```
PRODUCT COLOR ASSIGNMENTS
═════════════════════════════════════════════════════════════

Product           Primary Accent    Hex        Usage
─────────────────────────────────────────────────────────────
RegexGPT          Soft Cyan         #7eb8da    Borders, buttons
PRoast            Soft Coral        #eb6f92    Fire theme
VaultAgent        Soft Lavender     #c4a7e7    Security/premium
ShipLog           Soft Mint         #a8d8b9    Success/shipping
DeadCode          Soft Peach        #f5a97f    Warning/removal
ErrorStory        Soft Rose         #f2cdcd    Soft/friendly
CommitPoet        Soft Cream        #ffe9b0    Creative/warm

═════════════════════════════════════════════════════════════
```

### Application Example

```
REGEXGPT (Soft Cyan #7eb8da)
┌─────────────────────────────────────────────────────────────┐
│  INPUT                                                      │
├─────────────────────────────────────────────────────────────┤
│  > describe your pattern...█                                │
└─────────────────────────────────────────────────────────────┘
   ^ Cyan border and text

PROAST (Soft Coral #eb6f92)  
┌─────────────────────────────────────────────────────────────┐
│  INPUT                                                      │
├─────────────────────────────────────────────────────────────┤
│  > paste your code...█                                      │
└─────────────────────────────────────────────────────────────┘
   ^ Coral border and text
```

---

## 10. Code Examples

### CSS Custom Properties

```css
:root {
  /* Backgrounds */
  --bg-deep: #1a1a2e;
  --bg-card: #16161a;
  --bg-card-hover: #232336;
  
  /* Text */
  --text-primary: #e8e3e3;
  --text-secondary: #a8b2c3;
  --text-muted: #6e6a86;
  
  /* Accents */
  --accent-cyan: #7eb8da;
  --accent-mint: #a8d8b9;
  --accent-lavender: #c4a7e7;
  --accent-rose: #f2cdcd;
  --accent-peach: #f5a97f;
  --accent-cream: #ffe9b0;
  --accent-coral: #eb6f92;
  
  /* Typography */
  --font-mono: 'JetBrains Mono', 'Fira Code', 'SF Mono', monospace;
  --font-size-xs: 10px;
  --font-size-sm: 12px;
  --font-size-base: 14px;
  --font-size-lg: 16px;
  
  /* Spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
}
```

### Tailwind Config

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'retro': {
          'deep': '#1a1a2e',
          'card': '#16161a',
          'card-hover': '#232336',
        },
        'pastel': {
          'cyan': '#7eb8da',
          'mint': '#a8d8b9',
          'lavender': '#c4a7e7',
          'rose': '#f2cdcd',
          'peach': '#f5a97f',
          'cream': '#ffe9b0',
          'coral': '#eb6f92',
        },
        'text': {
          'primary': '#e8e3e3',
          'secondary': '#a8b2c3',
          'muted': '#6e6a86',
        }
      },
      fontFamily: {
        'mono': ['JetBrains Mono', 'Fira Code', 'SF Mono', 'monospace'],
      },
    },
  },
}
```

### React Component Example

```jsx
// TerminalCard.jsx
export function TerminalCard({ title, children, variant = 'default' }) {
  const colors = {
    default: 'text-pastel-cyan',
    success: 'text-pastel-mint',
    warning: 'text-pastel-cream',
    error: 'text-pastel-coral',
    premium: 'text-pastel-lavender',
  };

  return (
    <div className={`font-mono text-sm ${colors[variant]}`}>
      <pre>
{`┌${'─'.repeat(60)}┐
│  ${title.padEnd(56)}│
├${'─'.repeat(60)}┤`}
      </pre>
      <div className="px-4 py-3 border-l border-r" style={{ borderColor: 'currentColor' }}>
        {children}
      </div>
      <pre>
{`└${'─'.repeat(60)}┘`}
      </pre>
    </div>
  );
}
```

---

## 11. Do's and Don'ts

### DO ✓

```
[/] Use box-drawing characters for all containers
[/] Keep text monospace throughout
[/] Use ASCII icons instead of emoji or icon fonts
[/] Apply pastel colors sparingly as accents
[/] Maintain consistent character widths
[/] Use double-line boxes for emphasis/premium
[/] Include blinking cursor in input fields
[/] Keep animations subtle and quick
[/] Use UPPERCASE for labels, lowercase for content
[/] Test readability on dark backgrounds
```

### DON'T ✗

```
[x] Use emojis or icon fonts
[x] Use gradients or shadows
[x] Use rounded corners (except very subtle)
[x] Use bold or italic text
[x] Mix multiple fonts
[x] Use neon/bright saturated colors
[x] Add complex animations or transitions
[x] Use images where ASCII art would work
[x] Break the monospace character grid
[x] Forget the blinking cursor effect
```

### Edge Cases

```
MOBILE RESPONSIVENESS
─────────────────────────────────────────────────────────────
- Boxes can shrink but maintain proportions
- Use shorter line lengths (40-50 chars)
- Stack elements vertically
- ASCII art logos can use smaller variants

ACCESSIBILITY
─────────────────────────────────────────────────────────────
- Maintain WCAG AA contrast ratios
- Blinking cursor can be disabled (prefers-reduced-motion)
- All ASCII icons need aria-labels
- Tab navigation must work through box elements
```

---

## Quick Reference Card

```
╔═══════════════════════════════════════════════════════════════╗
║  PASTEL RETRO UI - QUICK REFERENCE                            ║
╠═══════════════════════════════════════════════════════════════╣
║                                                               ║
║  COLORS                                                       ║
║  ───────────────────────────────────────────────────────────  ║
║  Background: #1a1a2e    Text: #e8e3e3    Muted: #6e6a86      ║
║  Cyan: #7eb8da  Mint: #a8d8b9  Lavender: #c4a7e7             ║
║  Rose: #f2cdcd  Peach: #f5a97f  Cream: #ffe9b0  Coral: #eb6f92║
║                                                               ║
║  ICONS                                                        ║
║  ───────────────────────────────────────────────────────────  ║
║  [>] Play   [x] Close   [+] Add   [-] Remove   [?] Help      ║
║  [/] Check  [ ] Empty   [*] Star  [:] Copy     [!] Alert     ║
║  (o) On     ( ) Off     (*) Selected           <3 Love       ║
║  :) Happy   :| Neutral  >:( Angry   X_X Dead                 ║
║                                                               ║
║  BOXES                                                        ║
║  ───────────────────────────────────────────────────────────  ║
║  Single: ┌ ─ ┐ │ └ ┘ ├ ┤ ┬ ┴ ┼                               ║
║  Double: ╔ ═ ╗ ║ ╚ ╝ ╠ ╣ ╦ ╩ ╬                               ║
║  Blocks: ░ ▒ ▓ █                                              ║
║                                                               ║
║  FONT                                                         ║
║  ───────────────────────────────────────────────────────────  ║
║  JetBrains Mono, Fira Code, SF Mono, monospace               ║
║  Sizes: 10px / 12px / 14px / 16px                            ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Jan 2025 | Initial release |

---

**Created for:** SaaS Product Suite  
**Design System:** Pastel Retro Terminal  
**Maintainer:** [Your Name]

```
═══════════════════════════════════════════════════════════════

                    END OF STYLE GUIDE
                    
              BUILT WITH <3 IN THE TERMINAL

═══════════════════════════════════════════════════════════════
```
