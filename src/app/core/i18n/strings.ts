/** UI strings in one language. English is the source; every other language must match its shape. */
export interface Strings {
  /** BCP 47 tag for `lang` attributes (hyphenation) and date formatting. */
  locale: string;
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

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Re-formats a seed-data month (`Mar 2026`) for a locale; anything else passes through. */
function localMonthYear(value: string, locale: string): string {
  const [mon, year] = value.split(' ');
  const month = MONTHS.indexOf(mon);
  if (month < 0 || !/^\d{4}$/.test(year ?? '')) return value;
  return new Intl.DateTimeFormat(locale, { month: 'short', year: 'numeric' }).format(
    new Date(Number(year), month, 1),
  );
}

export const EN: Strings = {
  locale: 'en',
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

export const ES: Strings = {
  locale: 'es',
  metric: 'Explorado',
  worldMetric: 'Explorado en el mundo',
  placeMetric: (place) => `Explorado en ${place}`,
  weightedPlaces: (v, t) => `${v} de ${t} lugares ponderados`,
  worldMapCaption: 'Países sombreados según lo explorado; haz clic en uno para ver su detalle',
  continentMapCaption: (continent) =>
    `${continent}: sombreado según lo explorado, haz clic en un país para ver su detalle`,
  countryDiscoveriesNote:
    'Descubrimientos personales en todo el país. No cuentan para el porcentaje explorado.',
  cityDiscoveriesNote:
    'Descubrimientos personales: lugares que encontraste y que no están en ninguna lista curada. No cuentan para el porcentaje explorado.',

  stats: {
    countriesTouched: 'Países visitados',
    acrossTheWorld: 'en todo el mundo',
    citiesLogged: 'Ciudades registradas',
    landmarksCheckedOff: (n) => `${n} monumentos visitados`,
    discoveries: 'Tus descubrimientos',
    localKnowledgeScore: 'puntuación de conocimiento local',
    countries: 'Países',
    withVisits: (n) => `${n} con visitas`,
    inThisContinent: 'en este continente',
  },

  header: {
    world: 'Mundo',
    confirmDetections: (n) => `Confirmar ${n} detecciones`,
    addVisit: 'Añadir una visita',
  },

  sidebar: {
    tagline: 'Descubre cuánto del mundo has visto de verdad',
    explore: 'Explorar',
    exploreCount: (n) => `${n} continentes`,
    whatsLeft: 'Lo que falta',
    whatsLeftCount: (n) => `${n} lugares`,
    timeline: 'Cronología',
    timelineCount: (n) => `${n} recientes`,
    countries: (n) => `${n} países`,
    citiesOnFile: (n) => `${n} ciudades en el catálogo`,
    sendFeedback: 'Enviar comentarios',
  },

  detail: {
    reportLink: '¿Algo no está bien?',
    nothingLogged: 'Aún no hay nada registrado aquí',
    lksLabel: ['Conocimiento', 'local'],
    lksShow: 'Ver la lista',
    lksHide: 'Ocultar la lista',
    cities: 'Ciudades',
    neighbourhoods: 'Barrios',
    landmarks: 'Monumentos',
    weightEach: (weight) => `peso ${weight} cada uno`,
    placeKinds: { Neighbourhood: 'Barrio', Landmark: 'Monumento' },
    monthYear: (value) => localMonthYear(value, 'es'),
  },

  country: {
    citiesRatioNote: 'registradas / en catálogo',
    mapTitle: 'Ciudades en el catálogo',
    mapVisited: 'Visitada',
    mapSavedOnly: 'Solo guardada',
    citiesHead: 'Ciudades, de la más a la menos completa',
    citiesCount: (n) => `${n} en catálogo`,
    cityMeta: (nv, lv, last) => `${nv} barrios · ${lv} monumentos · ${last}`,
    cityNotVisited: 'Aún sin visitar',
    formula: (v, t, nv, lv, rest) =>
      `${v} de ${t} lugares ponderados. ${nv} barrios con peso 1, ${lv} monumentos con peso 2 y ${rest} lugares ponderados más en el resto del país, aún en el catálogo.`,
    emptyNote: (country, t) =>
      `Aún no hay visitas en ${country}. Sus ${t} lugares ponderados siguen contando en la cifra mundial: para eso está el denominador.`,
  },

  city: {
    formula: (v, t, nv, lv) =>
      `${v} de ${t} lugares ponderados. ${nv} barrios con peso 1, ${lv} monumentos con peso 2.`,
    openHead: 'Pendiente',
    openCount: (n, l) => `${n} barrios · ${l} monumentos`,
    notItemised: (n, l) => `${n} barrios y ${l} monumentos aún sin detallar`,
    seedData: 'Datos iniciales',
  },

  map: {
    explored: 'explorado',
    savedNothingLogged: 'guardada, sin registros',
  },

  feedback: {
    kicker: 'Comentarios',
    reportKicker: 'Informar de un problema',
    sentTitle: 'Gracias, ya está registrado',
    about: 'Sobre',
    whatIsWrong: 'Qué está mal',
    reasons: ['Recuento incorrecto', 'Ciudad incorrecta', 'Falta un lugar', 'Visita que no hice'],
    fieldLabel: '¿Qué te gustaría contarnos?',
    reportFieldLabel: '¿Qué esperabas ver?',
    placeholder: 'Lo que sea: un error, una ciudad que falta, una idea',
    reportPlaceholder: 'p. ej., Guápulo está en Quito, no en Cuenca',
    email: 'Correo electrónico, si quieres respuesta',
    emailPlaceholder: 'opcional',
    thanks:
      'Registrado junto con tu vista actual. Lo leemos todo y respondemos si nos dejas un correo.',
    reportThanks: (place) =>
      `Registrado para ${place} junto con tu vista actual. Revisamos los informes cada semana y corregimos los datos del lugar en origen.`,
    cancel: 'Cancelar',
    send: 'Enviar',
    close: 'Cerrar',
  },

  how: {
    title: 'Cómo se calcula la puntuación',
    kicker: 'Método',
    body: 'Cada lugar curado de una ciudad vale un peso fijo. Tu porcentaje explorado es el peso que has marcado dividido entre el peso registrado, así que un monumento mueve la cifra el doble que un barrio.',
    neighbourhood: 'Barrio',
    landmark: 'Monumento',
    weight: (weight) => `peso ${weight}`,
    rollingUpTitle: 'Cómo se agrega.',
    rollingUp:
      'Un país suma el peso de todas sus ciudades más los lugares registrados fuera de ellas; un continente suma sus países; el mundo suma todos los continentes. En cada nivel se aplica la misma división, así que las cifras son comparables.',
    discoveriesTitle: 'Descubrimientos personales.',
    discoveries:
      'Los lugares que encontraste por tu cuenta no están en ninguna lista curada, así que no tienen peso que ganar. Suben tu puntuación de conocimiento local y nunca afectan al porcentaje explorado.',
    visitTitle: 'Qué cuenta como visita.',
    visit:
      'Una ubicación registrada dentro del lugar, una foto confirmada o una entrada manual. Cada lugar cuenta una sola vez, por muchas veces que vuelvas.',
    close: 'Entendido',
  },
};
