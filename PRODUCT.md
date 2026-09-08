# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary users are laboratory buyers, technical and quality teams, cleanroom operators, research groups, manufacturers, and organizations that need equipment, materials analysis, prototype design, or engineering project support.

## Product Purpose

Nouvex Engineering is a static B2B website that explains four capability routes and converts an incomplete technical need into a structured inquiry. The guided inquiry submits to `/api/leads` for storage and email follow-up.

## Positioning

Nouvex is positioned as a technical equipment supplier and engineering-support company, not as the manufacturer of every product and not as an undifferentiated online store.

The four public routes are:

1. Laboratory and cleanroom equipment
2. Materials analysis
3. CAD and prototype design
4. Engineering consulting

## Operating Context

The site is static HTML, CSS, and JavaScript deployed on Vercel without a build step. The homepage introduces the offer and owns the guided inquiry. Separate pages explain each route and return visitors to that inquiry.

## Current Product Constraints

The initial equipment catalog is provisional and category-level only. Do not publish specific manufacturers, models, prices, availability, certifications, authorization status, warranties, installation scope, or delivery claims until Nouvex confirms them.

Do not claim that stock photographs show Nouvex facilities, personnel, products, or projects. Materials analysis is performed directly by Nouvex personnel at partner laboratories and facilities; do not imply that Nouvex owns the laboratories, facilities, or instruments.

The inquiry route keys (`equipment`, `analysis`, `prototyping`, `strategy`) and timeline strings are a hard contract between `index.html` and `api/leads.js`.

## Brand Commitments

The product name is Nouvex Engineering. The working identity uses a horizontal wordmark with a microchip symbol. The public experience should feel clean, established, technical, and direct: photography-led, conventional navigation, clear service naming, and restrained motion.

## Evidence on Hand

Evidence includes the BIOBASE overview catalog supplied by the owner, a provisional wordmark reference, and the Pen-Tec website as visual direction only. No customer names, metrics, certifications, authorization letters, case studies, product selection, founder biography, facility photographs, partner names, laboratory accreditations, or third-party proof assets are currently approved for publication.

Confirmed materials-analysis methods are SEM, TEM/STEM, FIB, ToF-SIMS, TGA, photovoltaic cell testing, four-point probe analysis, FTIR, ICP-MS, UV-Vis, and Keyence digital microscopy. RGA was previously listed in error and must not be published as a Nouvex service. Confirmed deliverables may include images, raw data, measurements, interpretation, reports, and recommendations. Confirmed application experience includes semiconductor, solar, plating, precision cleaning, machining, and aerospace cleaning. Commercial authorization for each individual method, partner identities, credentials, instrument models, turnaround times, and technique-specific certifications remain unconfirmed and must not be inferred.

Approved and published as of July 27, 2026: the company name, the operating location (Austin, Texas, United States), and a response commitment of one to three business days. The owner's name is intentionally private and must not appear on the public site. No engineering discipline, degree, licensure, or professional title is approved; do not add one until Nouvex confirms what is accurate and legally safe to state.

## Product Principles

- Lead with the application and customer decision, not a model number.
- Keep equipment sourcing and engineering judgment in the same conversation.
- Use modest, verifiable claims and mark provisional catalog boundaries clearly.
- Make the inquiry useful without requiring perfect specifications.
- Favor static durability, fast loading, and clear information architecture.
