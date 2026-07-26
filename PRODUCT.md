# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary users are technical buyers, plant and maintenance engineers, operators, product founders, and small manufacturing teams who need a mechanical engineering partner for design, analysis, prototypes, or failure investigation. They arrive with an unresolved mechanical problem and need to turn it into a scoped project brief.

## Product Purpose

Nouvex Engineering is a static website for a precision mechanical engineering consultancy. Its main interaction is the Scope Engine, a questionnaire that generates a project brief and submits it to `/api/leads` for Nouvex review. Success means a qualified visitor understands the offer quickly, trusts the technical positioning, and submits or copies a useful brief.

## Positioning

Nouvex positions itself around mechanical engineering scoping by someone who works in drawings, loads, tolerances, and failure modes, not around generic consulting language.

The four routes are mechanical design and CAD, simulation and analysis, prototypes and fixtures, and failure analysis. The site must not claim laboratory, cleanroom, semiconductor-fab, or materials-characterization capability (SEM, TEM, EDX, XRD, ICP-MS, TOF-SIMS), which the practice does not have.

## Operating Context

The site is a static HTML/CSS/JavaScript website deployed on Vercel without a build step. The home page owns the Scope Engine, while focused pages explain each of the four service routes and link back to the inquiry flow. The core workflow is: understand the engineering offer, inspect the relevant service, answer Scope Engine prompts, review a generated brief, and send or copy that brief.

## Capabilities and Constraints

The site must remain a static website with no build process. The Scope Engine questionnaire and its brief handoff are core functionality. Existing deployment configuration lives in `vercel.json`.

The Scope Engine route keys (`equipment`, `analysis`, `prototyping`, `strategy`) and the three timeline strings are a hard contract with the `allowedRoutes` and `allowedTimelines` allowlists in `api/leads.js`. Visible labels are free to change; these keys and strings are not, unless both sides change together.

## Brand Commitments

The product name is Nouvex Engineering. Existing durable phrase: "Precision · Analysis · Engineered Solutions." The site should feel less generic while preserving a technical, high-precision engineering posture.

## Evidence on Hand

Repository evidence includes `README.md`, `index.html`, and `vercel.json`. No customer names, metrics, certifications, case studies, or third-party proof assets are present, so future work must not fabricate them.

## Product Principles

Lead with engineered specificity over broad consultancy claims.
Make the Scope Engine the proof of how Nouvex thinks.
Keep the path from technical problem to scoped inquiry short.
Preserve trust by separating real facts from illustrative or synthetic examples.
Favor static durability and fast loading over framework complexity.
