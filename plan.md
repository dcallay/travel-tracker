# Plan

# Build Plan: Travel Tracking App

Companion to the project brief. This is the phased task breakdown for turning the idea into a working app.

**Stack decision:** Angular (web app, not React Native) — revised 2026-09-16. Building as a plain Angular web app first rather than a React Native mobile app, to prototype the data model and stats/rollup logic before committing to a mobile packaging approach. Mobile delivery (Ionic/Capacitor wrapping this Angular app, or a separate native shell) is an open decision to revisit once Phase 2/3 mobile-specific needs (geolocation, camera/photo capture) are actually being designed.

---

## Phase 1 — Foundation

1. Data model Place
- `id`
- `name`
- `level` (continent / region / country / city / neighborhood / landmark)
- `parent_id` (links to the place above it in the hierarchy)
- *(coordinates deliberately deferred to Phase 3 — see note below)*

Visit

- `id`
- `place_id`
- `date_visited`
- `coverage_type` (neighborhood / landmark / personal_discovery)
- `weight` (1 = neighborhood, 2 = landmark; personal discoveries excluded from weight)
- `source` (manual / geolocation / photo)
- `notes` (optional)

**Coverage % formula** (per city, rolls up the same way to country/region/continent):

```
   % = (sum of weights for visited neighborhoods + landmarks)
       / (sum of weights for ALL known neighborhoods + landmarks in that place)
```

Landmarks weighted 2x neighborhoods.

**Local Knowledge Score** (shown separately, not folded into %):

```
   count of personal_discovery visits logged for that place
```

> **Note on coordinates:** deliberately left out of the Phase 1 model. A single lat/lng pair breaks down for physically large landmarks (e.g. Mitad del Mundo) where a photo taken near the edge wouldn't match a center-point coordinate. Revisit in Phase 3, once geolocation matching is actually being designed (point+radius vs. bounding box) against real test cases.
> 
1. Source/seed geographic data (continents, regions, countries, cities) — likely a public dataset to start
2. Design % rollup logic from city → country → region → continent → world (using the coverage formula above)

## Phase 2 — Core App (manual entry MVP)

1. ~~Set up React Native project~~ Angular project shell created (`ng new`, routing enabled) — build out navigation/layout next
2. Build "add a visit" flow: search/select place, mark coverage (curated list of neighborhoods/landmarks + custom entries for personal discoveries)
3. Build stats dashboard: % by level, drill-down from world → continent → country → city
4. Build "what's left" view for a selected place

**🎯 Checkpoint — LinkedIn Post #1**
Record a demo video of the app working locally. Describe it as work-in-progress, mention it's built while applying Claude Code / Anthropic Academy learnings, and tease geolocation + agent features as what's coming next.

## Phase 3 — Geolocation

1. Request/handle location permissions
2. Design the detection flow ("tap to confirm" vs. passive/background detection)
3. Match coordinates → nearest known place/landmark in the database
4. Feed confirmed detections into the visit-logging system from Phase 2

## Phase 4 — Agent / AI Layer

*This is where Anthropic Academy course knowledge applies directly.*
12. Build an agent (Claude + tool use, possibly an MCP server) that can reason over your data — e.g. "what's left to see in Quito?"
13. Photo recognition — either as a tool the agent calls, or a standalone service
14. Wire the agent into the app as an assistant-style feature, not just a backend function

## Phase 5 — Polish & Portfolio Packaging

1. Visual polish, map view, improved UX
2. Written portfolio piece: what was built, what was learned, tech decisions
3. **LinkedIn Post #2** — polished demo + narrative on applying agent development skills

## Later / Optional (not required for MVP)

- Multi-user support, sharing/social features — revisit only if there's real interest or spare time