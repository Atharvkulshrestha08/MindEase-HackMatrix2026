---
name: MindEase 2.0
colors:
  surface: '#f8f9ff'
  surface-dim: '#ccdbf3'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e6eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d5e3fc'
  on-surface: '#0d1c2e'
  on-surface-variant: '#40484f'
  inverse-surface: '#233144'
  inverse-on-surface: '#eaf1ff'
  outline: '#707880'
  outline-variant: '#bfc7d0'
  surface-tint: '#006491'
  primary: '#006491'
  on-primary: '#ffffff'
  primary-container: '#5dade2'
  on-primary-container: '#003f5d'
  inverse-primary: '#8aceff'
  secondary: '#006d3d'
  on-secondary: '#ffffff'
  secondary-container: '#7efbae'
  on-secondary-container: '#007442'
  tertiary: '#705d00'
  on-tertiary: '#ffffff'
  tertiary-container: '#c3a304'
  on-tertiary-container: '#473a00'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#c9e6ff'
  primary-fixed-dim: '#8aceff'
  on-primary-fixed: '#001e2f'
  on-primary-fixed-variant: '#004b6f'
  secondary-fixed: '#7efbae'
  secondary-fixed-dim: '#60de94'
  on-secondary-fixed: '#00210f'
  on-secondary-fixed-variant: '#00522d'
  tertiary-fixed: '#ffe174'
  tertiary-fixed-dim: '#e7c433'
  on-tertiary-fixed: '#221b00'
  on-tertiary-fixed-variant: '#554500'
  background: '#f8f9ff'
  on-background: '#0d1c2e'
  surface-variant: '#d5e3fc'
typography:
  headline-xl:
    fontFamily: Poppins
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Poppins
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Poppins
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: 0.01em
  headline-lg-mobile:
    fontFamily: Poppins
    fontSize: 28px
    fontWeight: '600'
    lineHeight: '1.3'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  container-max: 1200px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
---

## Brand & Style

The brand personality is rooted in serenity, clarity, and gentle encouragement. It targets individuals seeking mental well-being through a sophisticated yet approachable digital companion. The emotional response is one of immediate "breathing room"—a calm, clutter-free environment that feels premium and intentional.

The design system employs a **Modern-Tactile** style, blending the structured efficiency of high-end SaaS (Linear) with the soft, organic warmth of wellness platforms (Headspace). Key characteristics include:
- **Subtle Glassmorphism:** Used sparingly for navigational elements to maintain context and depth.
- **Organic Softness:** High border radii and generous whitespace to avoid "sharp" or "anxious" interfaces.
- **Playful Precision:** Combining rigorous alignment with whimsical color accents to keep the experience engaging but professional.

## Colors

The palette is designed to be therapeutic and functional.
- **Soft Blue (Primary):** Used for primary actions, focus states, and progress indicators. It represents stability.
- **Mint Green (Secondary):** Reserved for success states, completed tasks, and growth-related metaphors.
- **Warm Yellow (Tertiary):** An accent for highlights, "aha" moments, and gentle reminders.
- **Soft Coral (Quaternary):** Used for destructive actions or urgent notifications, but softened to prevent a sense of alarm.
- **Background (#F8FAFC):** A cool, crisp off-white that reduces eye strain and provides a premium "gallery" feel for content cards.

## Typography

This design system uses a dual-font strategy to balance character with readability.
- **Headings (Poppins):** A geometric sans-serif that brings a friendly, circular, and modern energy. Use Semi-Bold (600) for hierarchy.
- **Body & UI (Inter):** A highly legible, neutral face designed for screen clarity. It provides the "professional" backbone of the system, ensuring long-form content is easy to digest.
- **Hierarchy:** Maintain generous vertical rhythm. Headings should have significant "leading" space to ensure they feel grounded and not cramped.

## Layout & Spacing

The layout philosophy follows a **Fluid-Fixed hybrid**. Content is centered within a 1200px max-width container on desktop, but transitions to a fluid fluid 4-column grid on mobile.

- **8pt Grid:** All spacing (padding, margins) must be multiples of 4px, preferably 8px, to maintain a consistent visual beat.
- **Safe Zones:** Use a minimum of 24px internal padding for cards to maintain the "airy" premium feel.
- **Vertical Spacing:** Use larger gaps (48px+) between distinct content sections to facilitate "mental pauses" while scrolling.

## Elevation & Depth

Depth is achieved through **Ambient Shadows** and **Tonal Layering**, avoiding heavy borders.

- **Soft Shadows:** Use a three-layered shadow approach for cards: a very broad, low-opacity (4%) blur to ground the object, and a tighter, slightly more opaque (8%) blur to define the edge. Shadow color should be tinted with the Primary Blue (#5DADE2) rather than pure black.
- **Glassmorphism:** Navigation bars and floating action buttons should use a `backdrop-filter: blur(12px)` with a 70% white tint.
- **Active States:** When an element is pressed, it should "sink" (shadow decreases) rather than just changing color, reinforcing the tactile nature of the system.

## Shapes

The shape language is defined by the **20px (1.25rem)** base radius. This specific curvature is high enough to feel friendly and "squishy" without becoming a full pill-shape, which preserves the SaaS-like structure.

- **Primary Cards:** 20px corner radius.
- **Buttons:** 12px corner radius (scaled down to feel more precise).
- **Input Fields:** 10px corner radius.
- **Inner Nesting:** When a card is nested inside another, the inner radius should be 8px smaller than the outer to maintain concentricity.

## Components

- **Buttons:** Primary buttons use a solid Soft Blue fill with white text. Hover states should feature a subtle vertical lift (2px) and an increased shadow spread.
- **Cards:** Use a white background (#FFFFFF) against the #F8FAFC page background. No borders; use the ambient blue-tinted shadow for separation.
- **Chips:** Highly rounded (pill-shaped), using 10% opacity versions of the brand colors (Blue, Green, Yellow, Coral) with full-saturation text for categorization.
- **Input Fields:** Use a 1px border in a very light neutral-grey. On focus, the border transitions to Primary Blue with a 4px Soft Blue outer glow.
- **Progress Indicators:** Use the Mint Green for positive completion. Transitions should be eased (cubic-bezier 0.4, 0, 0.2, 1) to feel fluid and organic.
- **Daily Reflection Cards:** A specialized component using a Soft Yellow background and large Poppins typography to serve as a focal point for the user's day.