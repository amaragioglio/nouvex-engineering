---
name: Nouvex Engineering
description: Static precision-engineering landing page with a diagnostic Scope Engine
colors:
  graphite: "#101216"
  instrument-panel: "#171b20"
  calibration-paper: "#eef0e7"
  muted-paper: "#c7cdbf"
  signal-cobalt: "#2e79ff"
  routing-amber: "#f2a51a"
  fault-oxide: "#f05b3f"
typography:
  display:
    fontFamily: "Aptos, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(3.5rem, 8.5vw, 6rem)"
    fontWeight: 800
    lineHeight: 0.88
    letterSpacing: "-0.035em"
  body:
    fontFamily: "Aptos, Segoe UI, system-ui, sans-serif"
    fontSize: "1rem"
    lineHeight: 1.62
rounded:
  sm: "8px"
  md: "10px"
  lg: "12px"
spacing:
  sm: "10px"
  md: "18px"
  lg: "42px"
components:
  button-primary:
    backgroundColor: "{colors.routing-amber}"
    textColor: "{colors.graphite}"
    rounded: "{rounded.sm}"
    padding: "0 18px"
    height: "48px"
  button-secondary:
    backgroundColor: "rgba(238, 240, 231, .08)"
    textColor: "{colors.calibration-paper}"
    rounded: "{rounded.sm}"
    padding: "0 18px"
    height: "48px"
---

# Design System: Nouvex Engineering

## Overview

**Creative North Star: "The Calibration Plate"**

Nouvex should feel like a precise diagnostic instrument rather than a consulting template. The visual system uses matte graphite surfaces, calibrated paper contrast, routed signal colors, and ruled comparison plates to make project scoping feel engineered and deliberate.

**Key Characteristics:**
- Instrument-grade dark surfaces with one light paper reversal for generated output.
- Cobalt for progress and selection; amber for routing and primary action.
- Dense but legible plates, rails, rows, and chips instead of generic icon cards.

## Colors

The palette is restrained and technical: graphite is the working environment, calibration paper is the inspected result, cobalt marks selection, and amber marks the route forward.

### Primary
- **Routing Amber:** Used for primary actions, route codes, and the active signal.
- **Signal Cobalt:** Used for selected states, progress traces, and focus emphasis.

### Neutral
- **Graphite:** Page background and instrument surface.
- **Instrument Panel:** Main panel and section surface.
- **Calibration Paper:** High-contrast text and generated brief surface.
- **Muted Paper:** Secondary copy on dark surfaces.

### Named Rules

**The Signal Rarity Rule.** Amber and cobalt must identify action or state; they are not general decoration.

## Typography

**Display Font:** Aptos with Segoe UI and system fallbacks  
**Body Font:** Aptos with Segoe UI and system fallbacks

**Character:** The type is direct, compact, and operational. Large type can be forceful, but body copy must stay clean enough for technical buyers scanning under time pressure.

### Hierarchy
- **Display** (800, clamp(3.5rem, 8.5vw, 6rem), 0.88): Hero thesis only.
- **Headline** (800, clamp(2rem, 4.5vw, 4rem), 0.95): Major section claims.
- **Body** (400, 1rem to 1.22rem, 1.62): Explanatory copy with a 62-68ch measure.
- **Label** (700, .82rem to .92rem): Navigation, route labels, and field labels.

## Layout

The first viewport is split between thesis and instrument. Subsequent sections use plates, ruled grids, and comparison groups with strong alignment. Responsive behavior collapses to a single column before text becomes cramped.

## Elevation & Depth

Depth is structural: the Scope Engine receives one large offset shadow, while most surfaces rely on borders, tonal layering, and grid lines. Shadows should be reserved for the main working instrument and interactive lift.

## Ambient Contour Field

The hero carries one ambient layer: a slow topographic contour field rendered to a canvas in `assets/shaders/topographic.html` (vendored from Radiant, MIT, © 2025 Paul Bakaus).

It is a **subordinate measurement surface, not an identity element**. It is admitted as a deliberate exception to "no abstract tech gradients" below, on the grounds that contour isolines are a measurement device consistent with the Calibration Plate, not a decorative gradient or glow. That exemption does not generalize: glows, orbs, plasma, and colour washes remain out.

Rules that keep it subordinate:
- Hero only, behind content, `pointer-events: none`, opacity at or below `.32`.
- Masked twice so it never sits under the headline or under the Scope Engine plate.
- Contours use the amber-to-paper ramp only. It introduces no new hue.
- It must never load under `prefers-reduced-motion`, and never below 700px.
- Its render loop must stop when the hero is off-screen or the tab is hidden.

If any of those cannot hold, remove the field rather than weaken the rule.

## Shapes

Corners are small and controlled: 8px for controls, 10px for generated output, and 12px for major instrument plates. Pills are allowed only for compact labels and industry tags.

## Components

### Buttons
- **Shape:** Small-radius rectangle (8px).
- **Primary:** Routing Amber background with graphite text.
- **Hover / Focus:** Slight upward movement on hover; visible cobalt focus ring.
- **Secondary:** Transparent or low-opacity paper fill with a calibrated border.

### Chips
- **Style:** Dark panel, one-pixel border, selected cobalt wash.
- **State:** Selected chips must look routed, not merely highlighted.

### Cards / Containers
- **Corner Style:** 10-12px.
- **Background:** Graphite or instrument panel.
- **Shadow Strategy:** No decorative glow; use the main Scope Engine shadow only.
- **Border:** One-pixel calibrated line.

### Inputs / Fields
- **Style:** Dark field, one-pixel line, compact radius.
- **Focus:** Cobalt focus ring, no glow-only state.

### Navigation
- **Style:** Sticky translucent graphite rail with small text and compact hover states.

## Do's and Don'ts

### Do:
- **Do** make the Scope Engine the visual proof of the offer.
- **Do** use route codes, traces, and generated-output formatting as the system language.
- **Do** keep commercial claims factual and modest when proof assets are absent.

### Don't:
- **Don't** build a generic hero plus feature-card stack.
- **Don't** use abstract tech gradients or decorative glows as the main identity. The hero contour field is the one documented exception and is bound by the rules in "Ambient Contour Field".
- **Don't** fabricate customers, metrics, certifications, or case studies.
