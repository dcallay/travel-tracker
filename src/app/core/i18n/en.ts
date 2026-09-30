import { englishDate } from './dates';
import { Strings } from './strings';

export const EN: Strings = {
  locale: 'en',
  formatDate: englishDate,
  metric: 'Explored',
  worldMetric: 'World explored',
  placeMetric: (place) => `${place} explored`,
  weightedPlaces: (v, t) => `${v} of ${t} weighted places`,
  worldMapCaption: 'Countries shaded by explored — click one for its detail',
  continentMapCaption: (continent) =>
    `${continent} — shaded by explored, click a country for its detail`,
  countryDiscoveriesNote:
    'Personal discoveries across the whole country. Kept out of the explored figure.',
  cityDiscoveriesNote:
    "Personal discoveries — spots you found that aren't on any curated list. Kept out of the explored figure.",

  stats: {
    countriesTouched: 'Countries touched',
    acrossTheWorld: 'across the world',
    citiesLogged: 'Cities logged',
    landmarksCheckedOff: (n) => `${n} landmarks checked off`,
    discoveries: 'Your discoveries',
    localKnowledgeScore: 'local knowledge score',
    countries: 'Countries',
    withVisits: (n) => `${n} with visits`,
    inThisContinent: 'in this continent',
  },

  table: {
    continent: 'Continent',
    country: 'Country',
    logged: 'Logged',
    byContinent: 'By continent',
    worldSub: 'Landmarks count double neighbourhoods',
    continentSub: (n) => `${n} countries on file`,
    countriesTouched: (touched, total) => `${touched} of ${total} countries`,
    citiesLogged: (logged, total) => `${logged} of ${total} cities logged`,
    noVisits: 'No visits yet',
    emptyContinent: (continent, countries, t) =>
      `Nothing logged in ${continent} yet. ${countries} countries and ${t} weighted places are already on file, so the moment you land somewhere the percentage starts moving.`,
  },

  addVisit: {
    lead: 'Manual entry. Geolocation and photo recognition fill this same form.',
    place: 'Place',
    coverageType: 'Coverage type',
    neighbourhood: 'Neighbourhood',
    landmark: 'Landmark',
    discovery: 'Personal discovery',
    hint: 'Neighbourhood counts 1, landmark counts 2. Personal discoveries raise your Local Knowledge Score instead of the percentage.',
    name: 'Neighbourhood or landmark',
    namePlaceholder: 'e.g. La Floresta',
    date: 'Date visited',
    notes: 'Notes',
    notesPlaceholder: 'Optional',
    save: 'Save visit',
    cancel: 'Cancel',
    source: 'Source: manual',
  },

  photo: {
    kicker: 'Photo recognition',
    title: (place) => `Is this ${place}?`,
    body: (city, date, metres) =>
      `Matched from a photo taken in ${city} on ${date}, with a location fix ${metres} m away. Confirming logs it as a landmark — weight 2.`,
    confidence: 'Confidence',
    source: 'Source',
    sourceValue: 'Photo + GPS',
    reject: 'Not this place',
    confirm: 'Confirm visit',
  },

  left: {
    title: "What's still open",
    lead: 'Ordered by how close each place is to done. No suggestions, no nudges — just the gaps.',
    place: 'Place',
    open: 'Open',
    discoveries: 'Discoveries',
  },

  timeline: {
    title: 'Travel history',
    lead: 'Every visit, newest first, with how it got logged.',
    details: {},
    sources: { Geolocation: 'Geolocation', Manual: 'Manual', Photo: 'Photo' },
    weights: {},
  },

  leaderboard: {
    title: 'Leaderboard',
    lead: 'The ten travellers with the most countries visited, then cities, with how much of the world each has explored. Your own row is always shown.',
    rank: '#',
    traveller: 'Traveller',
    countries: 'Countries',
    cities: 'Cities',
    you: 'You',
    yourRank: 'Your rank',
    ofTravellers: (n) => `of ${n} travellers`,
    aheadOf: 'Ahead of',
    aheadOfNote: 'of the other travellers',
    countriesNote: 'with at least one visit',
    citiesNote: 'with at least one visit',
    gap: 'Travellers between the top ten and you',
  },

  header: {
    world: 'World',
    confirmDetections: (n) => `Confirm ${n} detections`,
    addVisit: 'Add a visit',
  },

  sidebar: {
    tagline: "Track how much of the world you've truly seen",
    explore: 'Explore',
    exploreCount: (n) => `${n} continents`,
    whatsLeft: "What's left",
    whatsLeftCount: (n) => `${n} places`,
    timeline: 'Timeline',
    timelineCount: (n) => `${n} recent`,
    leaderboard: 'Leaderboard',
    leaderboardCount: (n) => `${n} travellers`,
    countries: (n) => `${n} countries`,
    citiesOnFile: (n) => `${n} cities on file`,
    sendFeedback: 'Send feedback',
  },

  detail: {
    reportLink: 'Something wrong here?',
    nothingLogged: 'Nothing logged here yet',
    lksLabel: ['Local knowledge', 'score'],
    lksShow: 'See the list',
    lksHide: 'Hide the list',
    cities: 'Cities',
    neighbourhoods: 'Neighbour­hoods',
    landmarks: 'Landmarks',
    weightEach: (weight) => `weight ${weight} each`,
    placeKinds: { Neighbourhood: 'Neighbourhood', Landmark: 'Landmark' },
    monthYear: (value) => value,
  },

  country: {
    citiesRatioNote: 'logged / seeded',
    mapTitle: 'Cities on file',
    mapVisited: 'Visited',
    mapSavedOnly: 'Saved only',
    citiesHead: 'Cities, closest to done first',
    citiesCount: (n) => `${n} seeded`,
    cityMeta: (nv, lv, last) => `${nv} neighbourhoods · ${lv} landmarks · ${last}`,
    cityNotVisited: 'Not yet visited',
    formula: (v, t, nv, lv, rest) =>
      `${v} of ${t} weighted places. ${nv} neighbourhoods at weight 1, ${lv} landmarks at weight 2, plus ${rest} weighted places elsewhere in the country still on file.`,
    emptyNote: (country, t) =>
      `No visits in ${country} yet. Its ${t} weighted places still count against the world figure — that is the point of the denominator.`,
  },

  city: {
    formula: (v, t, nv, lv) =>
      `${v} of ${t} weighted places. ${nv} neighbourhoods at weight 1, ${lv} landmarks at weight 2.`,
    openHead: 'Still open',
    openCount: (n, l) => `${n} neighbourhoods · ${l} landmarks`,
    notItemised: (n, l) => `${n} neighbourhoods and ${l} landmarks not itemised yet`,
    seedData: 'Seed data',
  },

  map: {
    explored: 'explored',
    savedNothingLogged: 'saved, nothing logged',
  },

  feedback: {
    kicker: 'Feedback',
    reportKicker: 'Report a problem',
    sentTitle: 'Thanks — it is logged',
    about: 'About',
    whatIsWrong: 'What is wrong',
    reasons: ['Wrong count', 'Wrong city', 'Missing place', "Visit I didn't make"],
    fieldLabel: 'Would you like to tell us?',
    reportFieldLabel: 'What did you expect to see?',
    placeholder: 'Anything — a bug, a missing city, an idea',
    reportPlaceholder: 'e.g. Guápulo is in Quito, not Cuenca',
    email: 'Email, if you want a reply',
    emailPlaceholder: 'optional',
    thanks: 'Logged with your current view. We read everything, and reply when you leave an email.',
    reportThanks: (place) =>
      `Logged against ${place} with your current view. We look at reports weekly and correct the place data at the source.`,
    cancel: 'Cancel',
    send: 'Send',
    close: 'Close',
  },

  how: {
    title: 'How the score is calculated',
    kicker: 'Method',
    body: 'Every curated place in a city is worth a fixed weight. Your explored figure is the weight you have checked off divided by the weight on file, so a landmark moves the number twice as far as a neighbourhood.',
    neighbourhood: 'Neighbourhood',
    landmark: 'Landmark',
    weight: (weight) => `weight ${weight}`,
    rollingUpTitle: 'Rolling up.',
    rollingUp:
      'A country adds the weight of all its cities plus the places on file outside them; a continent adds its countries; the world adds every continent. The same division applies at each level, so the figures stay comparable.',
    discoveriesTitle: 'Personal discoveries.',
    discoveries:
      "Spots you found yourself aren't on any curated list, so they have no weight to earn. They raise your Local Knowledge Score instead and never touch the explored figure.",
    visitTitle: 'What counts as a visit.',
    visit:
      'A geolocation fix inside the place, a confirmed photo match, or a manual entry. Each place counts once, however many times you return.',
    close: 'Got it',
  },
};
