# Design: Experience Section — Group by Company

**Date:** 2026-03-14
**Status:** Approved

---

## Problem

The Experience section renders each job role as a separate, independent timeline card. Ibotta and Xactly each have two roles, so they appear as four disconnected cards with no visual connection indicating they belong to the same employer. This obscures career progression at those companies.

## Goal

Group timeline entries by company so that multiple roles at the same employer appear together under a single company card, clearly communicating promotion/progression.

---

## Data Model

**File:** `src/content/resume.ts`

Replace the flat `Job` interface and `jobs[]` array with `Role`, `Company`, and `companies[]`.

```ts
export interface Role {
  title: string;
  startDate: string;
  endDate: string | null; // null = present
  description: string[];
}

export interface Company {
  name: string;
  location: string;
  roles: Role[];          // ordered newest-first
  technologies: string[]; // merged & deduplicated across all roles
}

export const companies: Company[] = [ ... ];
```

**Key decisions:**
- `technologies` is pre-merged in the data (no runtime dedup). This keeps the component dumb.
- `roles` is ordered newest-first so `roles[0]` is always the most recent role. This is a **trusted data invariant** — the component does not sort at runtime. When adding new companies, roles must be inserted newest-first or tenure span and dot state will be wrong.
- `location` is a company-level field only. Roles do not carry their own location. This works for the current data (all roles at a company share the same location). If a future role has a different location (e.g., remote vs. office), the data model would need revisiting.
- The old `Job` interface and `jobs[]` export are removed. Only `Experience.tsx` consumed `jobs[]`.

---

## Component

**File:** `src/components/sections/Experience.tsx`

### CompanyItem (replaces TimelineItem)

Receives a `Company`. Renders one timeline entry.

**Timeline dot behavior:**
- Pulsing/glowing accent dot if `company.roles[0].endDate === null` (company is current employer)
- Static hollow dot otherwise
- Note: for a single-role current company, both the pulsing dot and the "Current" badge on the role header will appear simultaneously. This is correct and requires no special-casing.

**Card header row:**
- Left: company name (accent color, `font-semibold`)
- Right: overall tenure span in mono/muted font, with location beneath. Rendered as:
  ```tsx
  `${company.roles[company.roles.length - 1].startDate} — ${company.roles[0].endDate ?? "Present"}`
  ```

**Roles list:**
- Each role rendered top-to-bottom (newest first)
- Role header: title (`var(--color-text)`, `font-semibold`) + "Current" badge if `role.endDate === null`; date range (`var(--color-text-muted)`, mono) on same row. Badge is driven independently by the role's own `endDate`, not by its position in the list.
- Bullet points below the role header
- Roles separated by a `1px var(--color-border)` divider, with `py-4` spacing

**Tech tags:**
- Single merged list at bottom of card, same chip style as today

### Section component

No changes. Iterates `companies` instead of `jobs`.

---

## Files Changed

| File | Change |
|------|--------|
| `src/content/resume.ts` | Replace `Job`/`jobs[]` with `Role`/`Company`/`companies[]` |
| `src/components/sections/Experience.tsx` | Replace `TimelineItem` with `CompanyItem`, consume `companies[]` |

---

## Out of Scope

- No accordion/expand behavior
- No changes to animation system, section layout, or other sections
- No new dependencies
