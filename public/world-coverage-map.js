// <world-coverage-map data='{"Ecuador":34.2,...}'> — Natural Earth geometry via d3-geo + topojson.
(function () {
  const LIBS = [
    { src: 'https://unpkg.com/d3@7.9.0/dist/d3.min.js', integrity: 'sha384-CjloA8y00+1SDAUkjs099PVfnY2KmDC2BZnws9kh8D/lX1s46w6EPhpXdqMfjK6i', check: () => window.d3 },
    { src: 'https://unpkg.com/topojson-client@3.1.0/dist/topojson-client.min.js', integrity: 'sha384-Ukv1p/xTma6P4/2bY5KzWBw+ydSpXmhCMtyciIQVDJ1RmOxtCYNMF1uXT9T63H67', check: () => window.topojson },
  ];
  const ATLAS = 'https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json';

  function loadLib(lib) {
    if (lib.check()) return Promise.resolve();
    const existing = document.querySelector('script[data-wcm="' + lib.src + '"]');
    if (existing) return existing.__p;
    const s = document.createElement('script');
    s.src = lib.src;
    s.integrity = lib.integrity;
    s.crossOrigin = 'anonymous';
    s.dataset.wcm = lib.src;
    s.__p = new Promise((res, rej) => { s.onload = res; s.onerror = rej; });
    document.head.appendChild(s);
    return s.__p;
  }

  let worldP = null;
  async function world() {
    for (const l of LIBS) await loadLib(l);
    if (!worldP) worldP = fetch(ATLAS).then((r) => r.json());
    const topo = await worldP;
    return window.topojson.feature(topo, topo.objects.countries).features;
  }

  const ALIAS = {
    'United States': 'United States of America',
    Netherlands: 'Netherlands',
  };

  // [west, south, east, north] — the frame each continent view is fitted to.
  const BBOX = {
    'South America': [-82, -56, -34, 13],
    Europe: [-25, 34, 45, 71],
    Asia: [26, -11, 147, 55],
    'North America': [-170, 7, -52, 72],
    Africa: [-19, -35, 52, 38],
    Oceania: [110, -48, 179, -8],
  };

  function fill(pct) {
    // Steps 400–700 read as increasing contrast against the ground in BOTH
    // themes (the ramps invert in dark mode), so one scale serves each.
    if (pct == null) return 'var(--color-neutral-400, #bab6b6)';
    if (pct <= 0) return 'var(--color-neutral-500, #9b9797)';
    if (pct < 5) return 'var(--color-accent-400, #ff9783)';
    if (pct < 15) return 'var(--color-accent-500, #ff563c)';
    if (pct < 25) return 'var(--color-accent-600, #dd2b0f)';
    return 'var(--color-accent-700, #ae1800)';
  }

  class WorldCoverageMap extends HTMLElement {
    static get observedAttributes() { return ['data', 'height', 'fit', 'country', 'cities']; }
    connectedCallback() { this.style.display = 'block'; this.render(); }
    attributeChangedCallback() { if (this.isConnected) this.render(); }

    async render() {
      if (this.__busy) { this.__dirty = true; return; }
      this.__busy = true;
      this.__dirty = false;
      const h = Number(this.getAttribute('height') || 260);
      let data = {};
      try { data = JSON.parse(this.getAttribute('data') || '{}'); } catch (e) { data = {}; }
      const byName = {};
      Object.keys(data).forEach((k) => { byName[ALIAS[k] || k] = data[k]; });

      let feats;
      try { feats = await world(); } catch (e) {
        this.textContent = '';
        this.__busy = false;
        return;
      }
      const w = Math.round(this.getBoundingClientRect().width)
        || (this.parentNode && Math.round(this.parentNode.getBoundingClientRect().width))
        || 640;
      const region = this.getAttribute('fit') || '';
      const box = BBOX[region];
      const cname = this.getAttribute('country') || '';
      const focusName = cname ? (ALIAS[cname] || cname) : '';
      const focusFeat = focusName
        ? feats.find((f) => f.properties && f.properties.name === focusName) || null
        : null;
      let cityPts = [];
      try { cityPts = JSON.parse(this.getAttribute('cities') || '[]'); } catch (e) { cityPts = []; }

      let projection;
      if (focusFeat) {
        projection = window.d3.geoMercator().fitExtent([[18, 18], [w - 18, h - 18]], focusFeat);
      } else if (box) {
        projection = window.d3.geoMercator().fitExtent([[10, 10], [w - 10, h - 10]], {
          type: 'MultiPoint',
          coordinates: [[box[0], box[1]], [box[2], box[1]], [box[2], box[3]], [box[0], box[3]]],
        });
      } else {
        projection = window.d3.geoNaturalEarth1().fitSize([w, h], { type: 'Sphere' });
      }
      const path = window.d3.geoPath(projection);

      const svgNS = 'http://www.w3.org/2000/svg';
      const svg = document.createElementNS(svgNS, 'svg');
      svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
      svg.setAttribute('width', '100%');
      svg.setAttribute('height', String(h));
      svg.style.display = 'block';

      const self = this;
      self.__hi = null;
      const setHi = (p) => {
        if (self.__hi === p) return;
        if (self.__hi) {
          self.__hi.setAttribute('stroke', 'var(--color-bg, #f3f2f2)');
          self.__hi.setAttribute('stroke-width', '0.6');
        }
        self.__hi = p;
        if (p) {
          p.setAttribute('stroke', 'var(--color-text, #201e1d)');
          p.setAttribute('stroke-width', '1.6');
        }
      };
      svg.addEventListener('mouseleave', () => setHi(null));

      feats.forEach((f) => {
        const p = document.createElementNS(svgNS, 'path');
        const d = path(f);
        if (!d) return;
        p.setAttribute('d', d);
        const name = f.properties && f.properties.name;
        if (focusFeat) {
          const isF = f === focusFeat;
          p.setAttribute('fill', isF ? 'var(--color-neutral-400, #bab6b6)' : 'var(--color-neutral-200, #eae7e7)');
          p.setAttribute('stroke', isF ? 'var(--color-text, #201e1d)' : 'var(--color-bg, #f3f2f2)');
          p.setAttribute('stroke-width', isF ? '1.4' : '0.6');
          svg.appendChild(p);
          return;
        }
        // In a continent view, anything whose centroid falls outside the focus
        // frame is context only — drawn dim, not shaded, not clickable.
        let inFocus = true;
        if (box) {
          const c = window.d3.geoCentroid(f);
          inFocus = c[0] >= box[0] && c[0] <= box[2] && c[1] >= box[1] && c[1] <= box[3];
        }
        if (!inFocus) {
          p.setAttribute('fill', 'var(--color-neutral-200, #eae7e7)');
          p.setAttribute('stroke', 'var(--color-bg, #f3f2f2)');
          p.setAttribute('stroke-width', '0.6');
          p.addEventListener('mouseenter', () => setHi(null));
          svg.appendChild(p);
          return;
        }
        const pct = Object.prototype.hasOwnProperty.call(byName, name) ? byName[name] : null;
        p.setAttribute('fill', fill(pct));
        p.setAttribute('stroke', 'var(--color-bg, #f3f2f2)');
        p.setAttribute('stroke-width', '0.6');
        p.addEventListener('mouseenter', () => setHi(pct != null ? p : null));
        if (pct != null) {
          const t = document.createElementNS(svgNS, 'title');
          t.textContent = name + ' — ' + pct.toFixed(1) + '% explored';
          p.appendChild(t);
          p.style.cursor = 'pointer';
          p.addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('country-select', { detail: { name: name }, bubbles: true, composed: true }));
          });
        }
        svg.appendChild(p);
      });

      if (focusFeat) {
        cityPts.forEach((ct) => {
          const xy = projection([ct.lon, ct.lat]);
          if (!xy) return;
          const g = document.createElementNS(svgNS, 'g');
          const dot = document.createElementNS(svgNS, 'circle');
          dot.setAttribute('cx', String(xy[0]));
          dot.setAttribute('cy', String(xy[1]));
          dot.setAttribute('r', ct.visited ? '5.5' : '4');
          dot.setAttribute('fill', ct.visited ? 'var(--color-accent, #ec3013)' : 'var(--color-bg, #f3f2f2)');
          dot.setAttribute('stroke', ct.visited ? 'var(--color-bg, #f3f2f2)' : 'var(--color-text, #201e1d)');
          dot.setAttribute('stroke-width', '1.4');
          const t = document.createElementNS(svgNS, 'title');
          t.textContent = ct.name + (ct.visited ? ' — ' + (ct.pct || 0).toFixed(1) + '% explored' : ' — saved, nothing logged');
          dot.appendChild(t);
          const label = document.createElementNS(svgNS, 'text');
          label.setAttribute('x', String(xy[0] + 9));
          label.setAttribute('y', String(xy[1] + 4));
          label.setAttribute('font-size', '11');
          label.setAttribute('font-weight', ct.visited ? '700' : '500');
          label.setAttribute('fill', 'var(--color-text, #201e1d)');
          label.setAttribute('paint-order', 'stroke');
          label.setAttribute('stroke', 'var(--color-bg, #f3f2f2)');
          label.setAttribute('stroke-width', '3');
          label.setAttribute('stroke-linejoin', 'round');
          label.textContent = ct.name;
          g.appendChild(dot);
          g.appendChild(label);
          svg.appendChild(g);
        });
      }

      this.textContent = '';
      this.appendChild(svg);
      this.__busy = false;
      if (this.__dirty) this.render();
    }
  }
  if (!customElements.get('world-coverage-map')) customElements.define('world-coverage-map', WorldCoverageMap);
})();
