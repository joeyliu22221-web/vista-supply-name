---
name: Vistas Heavy Industrial
colors:
  surface: '#fbf8ff'
  surface-dim: '#dad9e3'
  surface-bright: '#fbf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f2fd'
  surface-container: '#eeedf7'
  surface-container-high: '#e8e7f1'
  surface-container-highest: '#e3e1ec'
  on-surface: '#1a1b22'
  on-surface-variant: '#47464b'
  inverse-surface: '#2f3038'
  inverse-on-surface: '#f1effa'
  outline: '#77767b'
  outline-variant: '#c8c5cb'
  surface-tint: '#5f5e61'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1b1b1e'
  on-primary-container: '#858387'
  inverse-primary: '#c8c5ca'
  secondary: '#974800'
  on-secondary: '#ffffff'
  secondary-container: '#fd8a35'
  on-secondary-container: '#652e00'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#111c2d'
  on-tertiary-container: '#79849a'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e4e1e6'
  primary-fixed-dim: '#c8c5ca'
  on-primary-fixed: '#1b1b1e'
  on-primary-fixed-variant: '#47464a'
  secondary-fixed: '#ffdbc7'
  secondary-fixed-dim: '#ffb689'
  on-secondary-fixed: '#311300'
  on-secondary-fixed-variant: '#733500'
  tertiary-fixed: '#d8e3fb'
  tertiary-fixed-dim: '#bcc7de'
  on-tertiary-fixed: '#111c2d'
  on-tertiary-fixed-variant: '#3c475a'
  background: '#fbf8ff'
  on-background: '#1a1b22'
  surface-variant: '#e3e1ec'
typography:
  headline-xl:
    fontFamily: Space Grotesk
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Space Grotesk
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
  headline-sm:
    fontFamily: Space Grotesk
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.04em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.06em
  spec-num:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '700'
    lineHeight: 18px
spacing:
  gutter: 1rem
  gutter-mobile: 0.75rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1.25rem
  space-xl: 2rem
---

## Brand & Style

This design system embodies refined, utilitarian American industrialism tailored for commercial builders, structural engineers, and logistics dispatchers. Inspired by construction manifests, fabrication blueprints, and architectural steel grade charts, it values density, absolute legibility, and high-speed operational clarity over decoration.

Key attributes:
- **Direct & Physical:** Interfaces feel like machined tools and carbon-copy job-site manifests.
- **Architectural Utility:** Dense layouts, explicit structural borders, and visible perimeter lines replace ethereal floating layers or playful animations.
- **Tone:** Uncompromising, reliable, professional, and built for real-world job site durability.

## Colors

The palette is derived from raw construction materials: cured poured concrete, cold-rolled steel, mill scale, and safety-rated architectural amber.

- **Primary (`#18181B`):** Mill-finish carbon black used for critical structural text, primary button fills, and high-impact structural dividing lines.
- **Secondary (`#C25E00`):** Architectural steel rust / safety amber. Reserved exclusively for interactive focus states, primary order actions, active status indicators, and critical load warnings.
- **Tertiary (`#1E293B`):** Deep iron navy, used for secondary metadata badges, structural section accents, and technical column headers.
- **Neutral (`#71717A`):** Weathered zinc used for secondary captions, inactive borders, and structural dividing rules.
- **Surfaces & Backgrounds:** The base canvas operates on dry concrete off-white (`#F8F9FA`), with surface containers stepping into light aggregate grey (`#F3F4F6` and `#E4E4E7`).
- **Rules of Application:** Avoid gradients, tints, or soft opacity blends. Colors are applied flat with solid boundaries to maintain high outdoor contrast under direct sunlight.

## Typography

Typography prioritizes tabular precision, strict hierarchy, and rapid data digestion across harsh field conditions:

- **Space Grotesk (Headlines):** Geometric, mechanical, and sturdy. Used strictly for section titles, category headings, and site signage headers.
- **Inter (Body Text):** Workhorse sans-serif for high legibility in descriptions, terms, and general body copy. Set with tight, intentional line heights.
- **JetBrains Mono (Technical Spec & Labels):** Applied for part numbers, ASTM standards, dimensional measurements, SKUs, inventory counts, pricing tables, and all UI badges. Uppercase casing is mandatory for structural metadata tags.

## Layout & Spacing

Layouts follow a structural 12-column grid system built on an 8px technical cadence (with a 4px micro-step). Spacing is compact, optimizing density so dispatchers and site supervisors can scan inventory lists, load capacities, and delivery dates without scrolling through empty padding.

- **Desktop (>= 1024px):** 12 columns, 1rem gutters, 2rem exterior canvas margin.
- **Tablet (768px - 1023px):** 8 columns, 1rem gutters, 1.5rem exterior canvas margin.
- **Mobile (<= 767px):** 4 columns, 0.75rem gutters, 1rem exterior canvas margin.
- **Alignment:** Every container edge aligns strictly with visible dividing borders. Elements snap to structural grid tracks rather than floating independently.

## Elevation & Depth

This system strictly rejects drop shadows, blur effects, and depth layers. Visual separation and layering are achieved through structural boundary rules:

- **Zero Shadows:** Elevation tokens (`box-shadow`) are locked to `none` across all components and states.
- **Structural Framing:** Interfaces rely on solid 1px and 2px borders (`#27272A` and `#E4E4E7`) to delineate containers, cards, and data segments.
- **Tonal Stepping:** Overlays, flyouts, and dialogs sit directly atop canvas surfaces using alternating flat fills (`#F3F4F6` over `#F8F9FA`) framed by heavy 2px charcoal perimeters (`#18181B`).
- **Focus & States:** Interactive elevation is represented strictly by high-contrast border swaps and flat color inversions (e.g., swapping a light background to solid `#18181B` or highlighting with `#C25E00`).

## Shapes

The shape system is strictly non-rounded (`0px` / `rounded-none`).

- Every button, input field, status badge, data table row, and modal dialog is rendered with hard right angles, reflecting sheet steel, cinder blocks, and machined lumber.
- Segmented controls, chips, and table headers are locked into rigid rectangular blocks with continuous bordering.

## Components

### Buttons
- **Primary:** Solid `#18181B` fill, `#FFFFFF` text, `0px` border radius, uppercase `JetBrains Mono` label. Hover shifts to `#27272A`. Active state swaps border to 2px solid `#C25E00`.
- **Secondary / Action:** Solid `#FFFFFF` or `#F3F4F6` background, 1px solid `#18181B` border, `#18181B` text. Hover shifts to full color inversion (`#18181B` background, `#FFFFFF` text).
- **Destructive / Caution:** Transparent background, 1px solid `#C25E00`, `#C25E00` text. Hover fills `#C25E00` with white text.

### Data Tables (The Primary Component)
- Tabular borders are continuous, 1px solid `#E4E4E7` horizontally and vertically.
- Column headers are set in `#F3F4F6` fill with bold uppercase `JetBrains Mono` text (`11px`) and a 2px solid `#18181B` bottom line.
- Numerical values, SKUs, and weights use tabular lining figures and right alignment.
- Row hover triggers an immediate solid `#E4E4E7` background highlight without transition delay.

### Inputs & Selects
- 1px solid `#27272A` border on a `#FFFFFF` fill.
- Internal padding: `0.5rem` vertical by `0.75rem` horizontal.
- Focus state: 2px solid `#C25E00` with zero outer shadow glow.
- Placeholders: Monospaced uppercase text in `#71717A`.

### Status Badges & Chips
- Flat rectangular boxes with 1px solid perimeter borders.
- Backgrounds use muted industrial fills (e.g., `#FEF3C7` with `#92400E` border for in-transit; `#DC2626` text with `#FEE2E2` border for hazardous or delayed).
- Text is set in 11px uppercase `JetBrains Mono`.

### Cards & Grouping Containers
- Built with a 1px solid `#27272A` border and clean `#FFFFFF` or `#F8F9FA` fill.
- Headers inside containers are separated by a mandatory 1px horizontal rule across the full width of the container.
- No internal cards within cards; use single-pixel tabular grids to subdivide information instead.

### Metric Callouts (Industrial Spec Tiles)
- Compact rectangular modules displaying raw quantities (e.g., "50 TONS", "GRADE 60 REBAR").
- Value displayed in bold `Space Grotesk` (`32px`), accompanied by a sub-label in `JetBrains Mono` (`11px`) indicating ASTM specification numbers.