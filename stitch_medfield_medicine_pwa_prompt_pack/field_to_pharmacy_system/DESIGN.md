---
name: Field-to-Pharmacy System
colors:
  surface: '#f6fbf3'
  surface-dim: '#d7dbd4'
  surface-bright: '#f6fbf3'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f5ed'
  surface-container: '#ebefe8'
  surface-container-high: '#e5e9e2'
  surface-container-highest: '#dfe4dc'
  on-surface: '#181d18'
  on-surface-variant: '#3f4940'
  inverse-surface: '#2d322d'
  inverse-on-surface: '#eef2eb'
  outline: '#6f7a6f'
  outline-variant: '#bfc9bd'
  surface-tint: '#0f6d3a'
  primary: '#004c25'
  on-primary: '#ffffff'
  primary-container: '#006634'
  on-primary-container: '#8ce1a2'
  inverse-primary: '#84d99a'
  secondary: '#506354'
  on-secondary: '#ffffff'
  secondary-container: '#d2e8d5'
  on-secondary-container: '#55695a'
  tertiary: '#742531'
  on-tertiary: '#ffffff'
  tertiary-container: '#923c47'
  on-tertiary-container: '#ffbfc3'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#9ff5b5'
  primary-fixed-dim: '#84d99a'
  on-primary-fixed: '#00210d'
  on-primary-fixed-variant: '#005229'
  secondary-fixed: '#d2e8d5'
  secondary-fixed-dim: '#b6ccba'
  on-secondary-fixed: '#0d1f14'
  on-secondary-fixed-variant: '#384b3d'
  tertiary-fixed: '#ffdadb'
  tertiary-fixed-dim: '#ffb2b8'
  on-tertiary-fixed: '#40000e'
  on-tertiary-fixed-variant: '#7c2b36'
  background: '#f6fbf3'
  on-background: '#181d18'
  surface-variant: '#dfe4dc'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 14px
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
  xl: 48px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 32px
---

## Brand & Style
This design system focuses on clinical reliability blended with organic warmth. The aesthetic is **Corporate / Modern** but borrows a unique asymmetric motif from the brand’s "tile" logo. The goal is to evoke a sense of safety, precision, and pharmaceutical integrity. 

The interface prioritizes high legibility and reassurance, using ample whitespace and a restrained color palette to ensure users can navigate medical information without cognitive fatigue. The signature visual element—a single large radius on the bottom-left of key containers—provides a proprietary "leaf-like" feel that differentiates the PWA from standard medical apps.

## Colors
The palette is rooted in a deep, medicinal green. The **Primary Green (#006634)** is used for key actions and brand identity. 

In **Light Mode**, we use a tiered neutral system:
- **Canvas:** The primary backdrop for the PWA.
- **Ink:** For high-contrast body text and headings.
- **Muted:** For secondary information and labels.
- **Border:** For subtle structural separation.

In **Dark Mode**, the background shifts to a near-black **#0D0D0D**, while surface elements utilize **#16281C** to maintain a "dark-medicinal" atmospheric feel.

## Typography
The system uses a dual-sans approach to balance friendliness with function. 
- **Headings:** Set in **Plus Jakarta Sans** (a highly legible alternative to Baloo). It provides a soft, geometric personality that aligns with the "rounded" brand identity.
- **Body & Interface:** Set in **Manrope**. Its high x-height and technical precision make it ideal for pharmaceutical lists, dosage instructions, and data-heavy order screens.
- **Specific Scale:** Use `headline-xl` only for web hero sections; on mobile PWA views, default to `headline-lg`.

## Layout & Spacing
The layout follows a **Fluid Grid** model optimized for a "mobile-first" PWA experience. 
- **Grid:** 4 columns for mobile (16px margin), 12 columns for desktop (32px margin).
- **Rhythm:** An 8px linear scale (base 4px) is used for all internal padding and alignment. 
- **Safe Zones:** Ensure all interactive elements maintain a minimum 48px touch target area, even if the visual asset is smaller.

## Elevation & Depth
Depth is conveyed primarily through **Tonal Layers** rather than heavy shadows, keeping the UI clean and medical.
- **Level 0 (Canvas):** The base background layer (#F6FAF7).
- **Level 1 (Card):** Surface-white containers for product listings and info cards.
- **Level 2 (Overlay):** Modals and bottom sheets use a very soft, diffused shadow (0px 8px 24px, 5% opacity of Ink) to indicate they are floating above the main interaction layer.
- **Dividers:** Use 1px borders (#E0E7E2) for internal list items instead of shadow-based separation.

## Shapes
The design system employs a unique **Asymmetric Radii** rule to echo the logo:
- **Standard UI Elements:** (Buttons, Inputs, Chips) Use a uniform `roundedness: 2` (8px).
- **Signature Containers:** (Hero banners, Product Cards, Modal headers) Apply a large `signature_radius` (32px) only to the **bottom-left corner**, keeping the other three corners at 0px or 4px. This creates a "tile" look that feels proprietary and organic.

## Components
- **Buttons:** Primary buttons are Solid Primary Green with white text and 8px uniform rounding. Secondary buttons use a Primary Green border and text.
- **Product Cards:** Must feature the signature bottom-left large radius. Use `body-md` for drug names and `label-sm` for dosage info.
- **Verified Mark:** A custom glyph (leaf/checkmark hybrid) in Primary Green, always placed to the right of vendor or product names to indicate pharmaceutical certification.
- **Input Fields:** 1px #E0E7E2 border with 8px radius. Active state uses a 2px Primary Green border.
- **Chips:** Small pill-shaped tags used for "In Stock" or "Prescription Required." Use a subtle tint of the primary color for the background.
- **Navigation:** A persistent bottom tab bar for the PWA with icons in Muted green, shifting to Primary Green when active.