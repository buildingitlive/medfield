---
name: MedField Alpha
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#41493e'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#717a6d'
  outline-variant: '#c0c9bb'
  surface-tint: '#2a6b2c'
  primary: '#00450d'
  on-primary: '#ffffff'
  primary-container: '#1b5e20'
  on-primary-container: '#90d689'
  inverse-primary: '#91d78a'
  secondary: '#006c49'
  on-secondary: '#ffffff'
  secondary-container: '#6cf8bb'
  on-secondary-container: '#00714d'
  tertiary: '#333a4f'
  on-tertiary: '#ffffff'
  tertiary-container: '#495167'
  on-tertiary-container: '#bdc4de'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#acf4a4'
  primary-fixed-dim: '#91d78a'
  on-primary-fixed: '#002203'
  on-primary-fixed-variant: '#0c5216'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#dae2fd'
  tertiary-fixed-dim: '#bec6e0'
  on-tertiary-fixed: '#131b2e'
  on-tertiary-fixed-variant: '#3f465c'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  id-code:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 24px
  margin: 32px
  max_width: 1440px
---

## Brand & Style

This design system is built for a high-performance medical SaaS administrative environment. The brand personality is rooted in **precision, clinical clarity, and institutional trust**. It balances the technical rigor required for medical data management with the modern, streamlined aesthetics of top-tier developer and finance platforms.

The design style follows a **Corporate / Modern** approach with hints of **Minimalism**. It prioritizes information density and legibility, using a structured layout and a sophisticated color palette to guide the user through complex workflows. The overall emotional response should be one of "calm control"—the UI stays out of the way, providing a reliable canvas for critical decision-making. High-quality typography and subtle depth reinforce the premium, professional nature of the product.

## Colors

The palette is anchored by **Deep Green**, chosen for its association with health and stability, paired with an **Emerald** accent to provide modern vibrancy. 

- **Primary & Accent:** Use the Deep Green for primary actions, branding, and high-level navigation. Use Emerald for success states, subtle highlights, and secondary call-to-actions.
- **Backgrounds:** Light mode utilizes a cool Slate-tinted white for content areas to reduce eye strain. The sidebar remains dark (#0F172A) even in light mode to provide a strong structural anchor.
- **Dark Mode:** In dark mode, the primary surface is #0F172A, with elevated card surfaces shifting to #1E293B to maintain depth.
- **System States:** Standardized Error and Warning colors are reserved for critical alerts and validation, ensuring high visibility against the green-dominated palette.

## Typography

This design system uses **Inter** for all UI elements to ensure maximum legibility and a systematic, modern feel. For technical data—specifically Patient IDs, Transaction Hashes, and SKU numbers—**JetBrains Mono** is used to distinguish raw data from instructional text.

- **Scale:** Typographic hierarchy is strictly enforced. Headlines use tighter letter-spacing and semi-bold weights to command attention.
- **Utility:** Small labels (12px) use uppercase and increased tracking for clarity in dense dashboard views. 
- **Readability:** Body text is optimized for long-form data reading with comfortable line heights.

## Layout & Spacing

The design system follows a **12-column fluid grid** for the main content area, while the sidebar remains at a fixed width (260px). 

- **The 4px Rule:** All spacing between elements is a multiple of 4px. Use 8px (sm) for internal element spacing and 16px (md) or 24px (lg) for layout sections.
- **Dashboard Density:** Content-heavy tables and grids should utilize a "compact" density setting, reducing vertical padding to 8px to maximize information visible on screen.
- **Breakpoints:**
  - **Desktop:** 1280px+ (Full 12 columns)
  - **Tablet:** 768px - 1279px (Sidebar collapses to icons; 8 columns)
  - **Mobile:** <767px (Sidebar becomes a hidden drawer; 4 columns; page margins reduce to 16px)

## Elevation & Depth

Hierarchy is established through **Tonal Layers** and **Ambient Shadows**.

- **Surfaces:** Level 0 is the background. Level 1 is the main content card. Level 2 is for modals and popovers.
- **Shadows:** Use extra-diffused, low-opacity shadows. For light mode, shadows use a tint of the neutral slate color (e.g., `rgba(15, 23, 42, 0.08)`).
- **Interactive States:** On hover, cards should subtly lift by increasing shadow spread and reducing Y-offset, creating a tactile "clicky" feel.
- **Borders:** Subtle 1px borders in a lighter neutral shade are used to define boundaries where shadow depth is insufficient, particularly in high-density data tables.

## Shapes

The shape language is intentional and varied to differentiate between structural elements and interactive controls.

- **Cards:** Use a **12px (0.75rem)** radius to soften the large dashboard surfaces and provide a modern SaaS feel.
- **Interactive Elements:** Buttons and Input fields use an **8px (0.5rem)** radius, appearing sturdy and professional.
- **Badges/Chips:** A tighter **6px (0.375rem)** radius is used for status indicators and tags to maintain a distinct visual identity from buttons.

## Components

- **Buttons:** Primary buttons use the Deep Green background with white text. Secondary buttons use a subtle Slate border with a transparent background. Ghost buttons are reserved for low-priority actions. All buttons have 8px rounding.
- **Input Fields:** Use a 1px border (#E2E8F0 in light, #334155 in dark). On focus, the border shifts to the Accent Emerald with a 2px soft outer glow.
- **Cards:** Main dashboard widgets must use the 12px radius. In dark mode, cards use the #1E293B surface with a very thin #334155 border.
- **Chips:** Small, 6px rounded elements. For status (e.g., "Active"), use a light tint of the status color with high-contrast text (e.g., light green background with Deep Green text).
- **Sidebar Nav:** High-contrast dark background (#0F172A). Active states should use a vertical 3px Emerald bar on the left edge and a subtle background highlight.
- **Data Tables:** Zebra striping is discouraged. Use thin 1px horizontal dividers. Header text should use `label-md` typography.