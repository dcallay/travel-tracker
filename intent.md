# Project Brief: Travel Tracking App

## The Idea

A mobile app that tracks the places you've visited and shows what percentage of the world you actually know — broken down by continent, region, country, and city.

## Why This Matters to Me

A raw count of countries visited ("12 countries") doesn't mean much on its own. This app is meant to give an **honest picture of how well I actually know a place**, not just whether I set foot there. It's also a personal record of my travel journey growing over time — and a bit of a game, where seeing what's "left" in a place makes exploring feel like progress.

## How "Visited" Is Defined

Not binary. Weighted by **depth of coverage**:

- Neighborhoods/districts explored
- Landmarks / points of interest checked off
- My own personal discoveries — local spots not in any curated list (e.g. a trendy restaurant a friend recommended on social media)

## How Logging Should Feel

Low-friction, ideally automatic:

- Geolocation detecting where I've been
- Photo recognition identifying a place/landscape from a picture
- Manual entry only when I want to add something the app doesn't know about yet

## The Game Loop

- Occasionally check overall % by continent/region/country/city
- See a light "what's still open" list for a place I'm in or interested in — not aggressive suggestions, just visibility into gaps
- Add my own discoveries even if they're not on the app's curated list

## Who It's For

Primarily me, for now. Open to it becoming something others could use later — but that's not a requirement for v1.

## What Success Looks Like (v1)

A working app I actually use on trips. Functional over beautiful. Priorities in order:

1. I use it myself
2. It's a satisfying way to look back on my travel history
3. It's technically interesting / a good learning project
4. (Later, optionally) Others discover and use it

## Timing & Context

- Likely built after (or alongside) my current Claude/AI engineering courses
- Doubles as a portfolio piece for my AI Application Engineer / Agent Developer career transition
- Natural spots for AI: photo-based place recognition, a "what haven't I explored here" recommender
- Doesn't need to be original — plenty of travel trackers exist. This is for me, in my way.

## Open Questions for Later (Not Blocking)

- Where does city/neighborhood boundary data come from?
- How is % calculated exactly (e.g. weighting scheme for depth)?
- Photo recognition: build vs. use an existing model/API?
- Data source for "recommended places" per city/country?