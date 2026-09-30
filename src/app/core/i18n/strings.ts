import { TimelineEntry } from '../data/travel-data';

/** UI strings in one language. English is the source; every other language must match its shape. */
export interface Strings {
  /** BCP 47 tag for `lang` attributes (hyphenation) and date formatting. */
  locale: string;
  /** A day, e.g. `14 Mar 2026`. */
  formatDate: (date: Date) => string;
  /** The headline percentage, as a column or score label. */
  metric: string;
  worldMetric: string;
  /** The headline percentage for a named continent or country. */
  placeMetric: (place: string) => string;
  /** `43 of 320 weighted places`. */
  weightedPlaces: (v: number, t: number) => string;
  worldMapCaption: string;
  continentMapCaption: (continent: string) => string;
  countryDiscoveriesNote: string;
  cityDiscoveriesNote: string;

  /** The stat tiles above the map on the world and continent views. */
  stats: {
    countriesTouched: string;
    acrossTheWorld: string;
    citiesLogged: string;
    landmarksCheckedOff: (n: number) => string;
    discoveries: string;
    localKnowledgeScore: string;
    countries: string;
    withVisits: (n: number) => string;
    inThisContinent: string;
  };

  /** The table below the map on the world and continent views. */
  table: {
    continent: string;
    country: string;
    logged: string;
    byContinent: string;
    worldSub: string;
    continentSub: (countries: number) => string;
    countriesTouched: (touched: number, total: number) => string;
    citiesLogged: (logged: number, total: number) => string;
    noVisits: string;
    emptyContinent: (continent: string, countries: number, t: number) => string;
  };

  addVisit: {
    lead: string;
    place: string;
    coverageType: string;
    neighbourhood: string;
    landmark: string;
    discovery: string;
    hint: string;
    name: string;
    namePlaceholder: string;
    date: string;
    notes: string;
    notesPlaceholder: string;
    save: string;
    cancel: string;
    source: string;
  };

  photo: {
    kicker: string;
    title: (place: string) => string;
    body: (city: string, date: string, metres: number) => string;
    confidence: string;
    source: string;
    sourceValue: string;
    reject: string;
    confirm: string;
  };

  /** The What's left page. */
  left: {
    title: string;
    lead: string;
    place: string;
    open: string;
    discoveries: string;
  };

  timeline: {
    title: string;
    lead: string;
    /** Translations of a seed-data entry's `detail`, `source` and `weight`. */
    details: Record<string, string>;
    sources: Record<TimelineEntry['source'], string>;
    weights: Record<string, string>;
  };

  /** The Leaderboard page. */
  leaderboard: {
    title: string;
    lead: string;
    rank: string;
    traveller: string;
    countries: string;
    cities: string;
    you: string;
    yourRank: string;
    ofTravellers: (n: number) => string;
    aheadOf: string;
    aheadOfNote: string;
    countriesNote: string;
    citiesNote: string;
    /** Screen-reader text for the gap between the top rows and yours. */
    gap: string;
  };

  header: {
    world: string;
    confirmDetections: (n: number) => string;
    addVisit: string;
  };

  sidebar: {
    tagline: string;
    explore: string;
    exploreCount: (continents: number) => string;
    whatsLeft: string;
    whatsLeftCount: (places: number) => string;
    timeline: string;
    timelineCount: (entries: number) => string;
    leaderboard: string;
    leaderboardCount: (travellers: number) => string;
    countries: (n: number) => string;
    citiesOnFile: (n: number) => string;
    sendFeedback: string;
  };

  /** Text shared by the country and city detail pages. */
  detail: {
    reportLink: string;
    nothingLogged: string;
    /** Local knowledge score label, split over two lines. */
    lksLabel: [string, string];
    lksShow: string;
    lksHide: string;
    cities: string;
    /** May contain a soft hyphen so the narrow breakdown cell can wrap it. */
    neighbourhoods: string;
    landmarks: string;
    weightEach: (weight: number) => string;
    /** Translations of the `kind` of an open place in the seed data. */
    placeKinds: Record<string, string>;
    /** Formats a seed-data month such as `Mar 2026`. */
    monthYear: (value: string) => string;
  };

  country: {
    citiesRatioNote: string;
    mapTitle: string;
    mapVisited: string;
    mapSavedOnly: string;
    citiesHead: string;
    citiesCount: (n: number) => string;
    cityMeta: (neighbourhoods: number, landmarks: number, last: string) => string;
    cityNotVisited: string;
    formula: (v: number, t: number, nv: number, lv: number, rest: number) => string;
    emptyNote: (country: string, t: number) => string;
  };

  city: {
    formula: (v: number, t: number, nv: number, lv: number) => string;
    openHead: string;
    openCount: (neighbourhoods: number, landmarks: number) => string;
    notItemised: (neighbourhoods: number, landmarks: number) => string;
    seedData: string;
  };

  /** Hover titles on the map. */
  map: {
    explored: string;
    savedNothingLogged: string;
  };

  feedback: {
    kicker: string;
    reportKicker: string;
    sentTitle: string;
    about: string;
    whatIsWrong: string;
    /** Report reasons, first one preselected. */
    reasons: string[];
    fieldLabel: string;
    reportFieldLabel: string;
    placeholder: string;
    reportPlaceholder: string;
    email: string;
    emailPlaceholder: string;
    thanks: string;
    reportThanks: (place: string) => string;
    cancel: string;
    send: string;
    close: string;
  };

  how: {
    title: string;
    kicker: string;
    body: string;
    neighbourhood: string;
    landmark: string;
    weight: (weight: number) => string;
    rollingUpTitle: string;
    rollingUp: string;
    discoveriesTitle: string;
    discoveries: string;
    visitTitle: string;
    visit: string;
    close: string;
  };
}
