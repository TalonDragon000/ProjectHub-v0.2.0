# DESIGN.md — Project Hub Visual System

This document is the single source of truth for the visual design of Project Hub. All colors, spacing, typography, shadows, and component conventions are defined here. To retheme the entire app, edit `src/themes.css` only — every value below maps directly to that file.

---

## 1. Active Theme: Clarity Blue (Light)
A clean, highly accessible light theme. Derived from a bright cyan to deep navy gradient, carefully desaturated and darkened to ensure WCAG AA (4.5:1) or AAA (7:1) compliance. Backgrounds deliberately use a soft off-white (`slate-50`) instead of pure white to reduce glare, serving as a primary neurodivergent accommodation. No pure saturated hues are used for text.

| Property | Value | Reference |
| :--- | :--- | :--- |
| Background base | `rgb(248, 250, 252)` | slate-50 |
| Surface layer | `rgb(241, 245, 249)` | slate-100 |
| Raised elements | `rgb(226, 232, 240)` | slate-200 |
| Overlay / modals | `rgb(203, 213, 225)` | slate-300 |

---

## 2. Design Token System
All tokens live in `src/themes.css` as CSS custom properties on `:root`. Tailwind consumes them via `tailwind.config.js` using the `rgb(var(...) / <alpha-value>)` syntax, which enables native Tailwind opacity modifiers (e.g. `bg-surface/80`). 

Shadows use `rgba()` directly because they are applied via `style={{}}` props in JSX, not via Tailwind utility classes.

### How to create a new theme
1. Open `src/themes.css`
2. Copy the blank `:root` template at the bottom of the file
3. Fill in your new RGB and hex values
4. Replace the existing `:root` block with your new one
5. Rebuild — no other files need to change

---

## 3. Color Tokens

### Backgrounds
| Token | CSS Variable | RGB Value | Tailwind Class | Notes |
| :--- | :--- | :--- | :--- | :--- |
| Base | `--bg-base` | `248 250 252` | `bg-base` | slate-50 — off-white, reduces glare |
| Surface | `--bg-surface` | `241 245 249` | `bg-surface` | slate-100 — card backgrounds |
| Raised | `--bg-raised` | `226 232 240` | `bg-raised` | slate-200 — raised elements |
| Overlay | `--bg-overlay` | `203 213 225` | `bg-overlay` | slate-300 — modals, overlays |

### Borders
| Token | CSS Variable | RGB Value | Tailwind Class |
| :--- | :--- | :--- | :--- |
| Base | `--border-base` | `248 250 252` | `border-base` |
| Subtle | `--border-subtle` | `226 232 240` | `border-subtle` |
| Default | `--border-default` | `203 213 225` | `border-default` |
| Strong | `--border-strong` | `148 163 184` | `border-strong` |

### Text
| Token | CSS Variable | RGB Value | Usage |
| :--- | :--- | :--- | :--- |
| Primary | `--text-primary` | `15 23 42` | Headlines, task titles (slate-900, AAA) |
| Secondary | `--text-secondary` | `30 41 59` | Body copy, labels (slate-800, AAA) |
| Muted | `--text-muted` | `71 85 105` | Supporting text, metadata (slate-600, AAA) |
| Faint | `--text-faint` | `100 116 139` | Placeholder text, disabled (slate-500, AA) |
| Inverted | `--text-inverted` | `248 250 252` | Text on dark/colored buttons (slate-50) |

### Accents
| Token | CSS Variable | RGB Value | Hex | Role |
| :--- | :--- | :--- | :--- | :--- |
| Primary | `--accent-primary` | `30 64 175` | `#1e40af` | blue-800 — primary CTAs, active states |
| Primary Dark | `--accent-primary-dark` | `30 58 138` | `#1e3a8a` | blue-900 — hover state for primary |
| Secondary | `--accent-secondary` | `8 145 178` | `#0891b2` | cyan-600 — selected tabs, highlights |
| Tertiary | `--accent-tertiary` | `14 116 144` | `#0e7490` | cyan-700 — section headers |
| Tertiary Alt | `--accent-tertiary-alt` | `6 182 212` | `#06b6d4` | cyan-500 — gradient accent |
| Amber | `--accent-amber` | `180 83 9` | `#b45309` | amber-700 — warnings, MoSCoW "Must" |

### Priority Colors
These map directly to the task columns in the Kanban workspace.

| Priority | CSS Variable | RGB Value | Hex | Column |
| :--- | :--- | :--- | :--- | :--- |
| High | `--priority-high` | `185 28 28` | `#b91c1c` | High (red-700) |
| Med | `--priority-med` | `30 64 175` | `#1e40af` | Med (blue-800) |
| Low | `--priority-low` | `8 145 178` | `#0891b2` | Low (cyan-600) |
| Later | `--priority-later` | `100 116 139` | `#64748b` | Later / Icebox (slate-500) |

### Confetti Colors
Used exclusively by `src/lib/colors.js` → `fireConfetti()` on task completion.

| Variable | Hex | Color name |
| :--- | :--- | :--- |
| `--confetti-1` | `#1e40af` | blue-800 |
| `--confetti-2` | `#0891b2` | cyan-600 |
| `--confetti-3` | `#059669` | emerald-600 |
| `--confetti-4` | `#d97706` | amber-500 |
| `--confetti-5` | `#dc2626` | red-600 |

---

## 4. Shadow Tokens
This light theme uses soft drop shadows rather than neon glows. All shadows use `rgba()` values and are applied via Tailwind custom shadow utilities or inline `style={{}}` props.

| Token | CSS Variable | Value | Used On |
| :--- | :--- | :--- | :--- |
| Nav | `--shadow-nav` | `rgba(15, 23, 42, 0.10)` | Bottom navigation bar |
| Dock Button | `--shadow-dock-btn` | `rgba(30, 64, 175, 0.25)` | Floating action (+) button |
| Selected | `--shadow-selected` | `rgba(8, 145, 178, 0.30)` | Active column tab indicator |
| Toast | `--shadow-toast` | `rgba(30, 64, 175, 0.20)` | Goal completion toast overlay |
| Primary | `--shadow-primary` | `rgba(30, 64, 175, 0.25)` | Primary action buttons |
| Amber | `--shadow-amber` | `rgba(180, 83, 9, 0.20)` | Warning / "Must" priority indicators |
| Tertiary | `--shadow-tertiary` | `rgba(14, 116, 144, 0.20)` | RICE score badges |

---

## 5. Typography
No custom font is loaded. The app uses the system font stack via Tailwind's default `font-sans`.

| Context | Class | Size |
| :--- | :--- | :--- |
| Page heading | `text-xl font-bold` | 20px |
| Section label | `text-sm font-semibold` | 14px |
| Body / task title | `text-sm` | 14px |
| Metadata / badge | `text-xs` | 12px |
| Base minimum | — | ≥14px on all interactive labels |

---

## 6. Spacing & Layout
- **Max width:** The app is constrained to a single mobile column. No responsive multi-column breakpoints are used — the viewport is always treated as a phone screen.
- **Safe area padding:** `.pb-safe` in `src/index.css` applies `padding-bottom: env(safe-area-inset-bottom)` for iPhone notch/home bar clearance.
- **Bottom nav height:** Fixed dock at the bottom; content areas account for this with bottom padding.
- **Column peek mechanic:** The Tasks workspace uses a 15px gradient bleed on the screen edge to signal swipeable adjacent columns.

---

## 7. Component Visual Conventions
### Task Card
- Background: `bg-raised` with `border border-subtle`
- Priority indicator: left border accent using the column's priority color token
- RICE score badge: `bg-accent-tertiary/20 text-accent-tertiary-alt`, `shadow-tertiary`
- Completed state: strikethrough title, reduced opacity

### Priority Wizard Modal
- Full-screen overlay on `bg-overlay`
- Predicted column badge: updates live as scores change, color-coded to priority tokens
- MoSCoW selector: pill buttons, `Must` uses amber accent, `Won't` uses muted gray

### Bottom Navigation
- Three-button dock: Home, Tasks, floating (+)
- Floating action button: `bg-accent-primary`, `shadow-dock-btn`, larger than nav icons
- Active tab: `text-accent-secondary` with subtle scale effect

### Modals
- Slide-up sheet on `bg-surface`
- Close/dismiss: top-right X icon or backdrop tap
- Inputs: `bg-raised border border-default` with `focus:border-accent-secondary` ring

---

## 8. Animation Conventions
- **Confetti burst:** Triggered on task completion via `canvas-confetti` using the five confetti color tokens. Center-screen, 3-second duration.
- **Transitions:** `transition-all duration-200` on interactive elements (buttons, tabs, cards).
- **Modal entry:** CSS slide-up or fade-in — keep under 300ms.
- **Reduced motion:** All animations should respect `prefers-reduced-motion: reduce`. Add `motion-safe:` prefix to transition classes where applicable.

---

## 9. File Map
| File | Role |
| :--- | :--- |
| `src/themes.css` | All CSS custom property tokens — edit here to retheme |
| `tailwind.config.js` | Maps tokens to Tailwind utility classes |
| `src/index.css` | Tailwind directives, global resets, `.pb-safe` |
| `src/lib/colors.js` | Runtime helpers for dynamic color usage |