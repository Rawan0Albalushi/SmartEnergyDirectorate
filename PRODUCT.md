# Product

<!-- impeccable:product-schema 1 -->

Assumptions below are inferred from the public site and the request to redesign the indicators page. The confirmation questions were cancelled.

## Platform

web

## Users

Public visitors (inferred). The site says anyone can read published energy figures without an account. Staff use a separate admin.

## Product Purpose

المديرية الذكية للطاقة / Smart Energy Directorate publishes readings, projects, news, achievements, and departments for the energy sector in Oman. Success on the indicators page is that a visitor can see the published value, unit, period, and date, and narrow the list by sector.

## Positioning

A public record of directorate figures. Readings are entered by staff and shown only when published. This is not an operational control room.

## Operating Context

Bilingual Arabic and English, with Arabic as the default reading direction. Four sectors: renewable energy, hydrogen, electricity, and energy efficiency. The indicators page lists published readings and filters them with a sector query.

## Capabilities and Constraints

Each published indicator has a name, one value, a unit, a period label, a recorded date, an optional note, and a sector. There is no time series and no target, so the page must not draw trends, gauges with invented maxima, or progress. Notes stay off this page, as they do today (inferred). Sector filter, pagination, header, footer, and the other public pages stay. The requested change is visual: a modern indicators page with icons and animation.

## Brand Commitments

The existing name, bilingual voice, and the public site chrome stay. The indicators page itself should read as a contemporary visual board, with drawn icons and motion.

## Evidence on Hand

Seeded readings in `database/seeders/DirectorateSeeder.php`. Sector photographs in `public/images`. No visitor research, testimonials, or official targets are in the repo; do not invent them.

## Product Principles

- Publish the figure that was entered. Do not imply a trend the record does not have.
- A visitor without an account can read every published number.
- Arabic and English carry the same facts.
- Sector is the way the record is narrowed.
- The page should be understandable at a glance, then filterable.
