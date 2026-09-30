import { localMonthYear } from './dates';
import { Strings } from './strings';

export const ES: Strings = {
  locale: 'es',
  formatDate: (date) =>
    new Intl.DateTimeFormat('es', { day: 'numeric', month: 'short', year: 'numeric' }).format(date),
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

  table: {
    continent: 'Continente',
    country: 'País',
    logged: 'Registrado',
    byContinent: 'Por continente',
    worldSub: 'Los monumentos cuentan el doble que los barrios',
    continentSub: (n) => `${n} países en el catálogo`,
    countriesTouched: (touched, total) => `${touched} de ${total} países`,
    citiesLogged: (logged, total) => `${logged} de ${total} ciudades registradas`,
    noVisits: 'Aún sin visitas',
    emptyContinent: (continent, countries, t) =>
      `Aún no hay nada registrado en ${continent}. Ya hay ${countries} países y ${t} lugares ponderados en el catálogo, así que en cuanto llegues a algún sitio el porcentaje empezará a moverse.`,
  },

  addVisit: {
    lead: 'Entrada manual. La geolocalización y el reconocimiento de fotos rellenan este mismo formulario.',
    place: 'Lugar',
    coverageType: 'Tipo de cobertura',
    neighbourhood: 'Barrio',
    landmark: 'Monumento',
    discovery: 'Descubrimiento personal',
    hint: 'Un barrio cuenta 1 y un monumento cuenta 2. Los descubrimientos personales suben tu puntuación de conocimiento local en lugar del porcentaje.',
    name: 'Barrio o monumento',
    namePlaceholder: 'p. ej., La Floresta',
    date: 'Fecha de la visita',
    notes: 'Notas',
    notesPlaceholder: 'Opcional',
    save: 'Guardar visita',
    cancel: 'Cancelar',
    source: 'Origen: manual',
  },

  photo: {
    kicker: 'Reconocimiento de fotos',
    title: (place) => `¿Es ${place}?`,
    body: (city, date, metres) =>
      `Identificado a partir de una foto tomada en ${city} el ${date}, con una ubicación a ${metres} m. Si lo confirmas, se registra como monumento, con peso 2.`,
    confidence: 'Confianza',
    source: 'Origen',
    sourceValue: 'Foto + GPS',
    reject: 'No es este lugar',
    confirm: 'Confirmar visita',
  },

  left: {
    title: 'Lo que queda pendiente',
    lead: 'Ordenado según lo cerca que está cada lugar de completarse. Sin sugerencias ni empujones: solo lo que falta.',
    place: 'Lugar',
    open: 'Pendiente',
    discoveries: 'Descubrimientos',
  },

  timeline: {
    title: 'Historial de viajes',
    lead: 'Todas las visitas, de la más reciente a la más antigua, con cómo se registró cada una.',
    details: {
      'Neighbourhood walked end to end': 'Barrio recorrido de punta a punta',
      Neighbourhood: 'Barrio',
      Landmark: 'Monumento',
      'Personal discovery': 'Descubrimiento personal',
    },
    sources: { Geolocation: 'Geolocalización', Manual: 'Manual', Photo: 'Foto' },
    weights: { 'score +1': 'puntuación +1' },
  },

  leaderboard: {
    title: 'Clasificación',
    lead: 'Los diez viajeros con más países visitados y, después, más ciudades, con cuánto del mundo ha explorado cada uno. Tu fila siempre aparece.',
    rank: '#',
    traveller: 'Viajero',
    countries: 'Países',
    cities: 'Ciudades',
    you: 'Tú',
    yourRank: 'Tu posición',
    ofTravellers: (n) => `de ${n} viajeros`,
    aheadOf: 'Por delante de',
    aheadOfNote: 'del resto de viajeros',
    countriesNote: 'con al menos una visita',
    citiesNote: 'con al menos una visita',
    privateTag: 'Privado',
    gap: 'Viajeros entre los diez primeros y tú',
  },

  account: {
    title: 'Mi cuenta',
    lead: 'Tus ajustes y el perfil que ven los demás viajeros.',
    settings: 'Ajustes',
    settingsNote: 'Solo los ves tú',
    name: 'Nombre visible',
    nameRequired: 'Escribe un nombre visible',
    home: 'Ciudad de residencia',
    nationality: 'Nacionalidad',
    nationalityHint: 'Se muestra como una bandera junto a tu nombre.',
    language: 'Idioma',
    visibility: 'Perfil',
    isPublic: 'Público',
    isPrivate: 'Privado',
    visibilityHint: 'Si es público, los demás viajeros pueden ver el perfil de abajo.',
    save: 'Guardar cambios',
    discard: 'Descartar',
    saved: 'Guardado',
    publicHead: 'Perfil público',
    publicNote: 'Lo que ven los demás viajeros',
    privateNote: 'Privado: solo tú puedes verlo',
    rankNote: (n) => `de ${n} viajeros`,
    exploredNote: 'del mundo',
    citiesNote: 'con al menos una visita',
    privateProfile: (name) => `${name} mantiene su perfil privado.`,
    backToLeaderboard: '← Clasificación',
    notFound: 'No hay ningún viajero en esta dirección.',
    topCountries: 'Países más explorados',
    nothingYet: 'Aún no has explorado ningún país',
    neverShown: 'Tu cronología, tus notas y los nombres de tus descubrimientos personales nunca se muestran.',
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
    leaderboard: 'Clasificación',
    leaderboardCount: (n) => `${n} viajeros`,
    account: 'Mi cuenta',
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
