// Page morphs. Every page on this origin loads this file in its head, with morph.css.
//
// The markup says what takes part:
//   data-morph="title"        a part of the page. It travels to the part with the same name on the other page.
//   data-morph-row            a link that opens a page on this origin, or a sibling site.
//   data-morph-part="title"   inside a row: a part only while its row is the one opening or closing.
//   data-morph-turn="180"     the way an arrow points, in degrees clockwise from right.
//
// The page being left writes a note: where its row is, and where each of its parts on screen sits.
// The page being shown reads the note, names its matching parts, and tells morph.css where the
// window starts or ends. A part that is off screen on either page stays out of it.
//
// A row may also open a sibling site: a site of mine one level down, like
// yukigumo.mercuriusdream.com. That is another origin, and the browser carries nothing across.
// The row's plane makes the trip by itself. See "Sibling sites" below.
//
// A morph starts when the next page has a frame to show, so the next page is made ready before
// its link is pressed. See "Ahead of the press" at the end.
(() => {
  const NOTE = 'morph';
  const EASE = 'cubic-bezier(0.2, 0, 0, 1)';
  const root = document.documentElement;
  const still = matchMedia('(prefers-reduced-motion: reduce)');
  let visit = 0;
  let running = null;
  let cut = null;

  const rect = r => [r.left, r.top, r.width, r.height];

  // How far a plane is from each edge of the screen, and how long it takes to cross that.
  // A larger change takes longer: the time grows with the distance the plane's edge travels.
  function reach([x, y, w, h]) {
    const inset = { top: y, right: innerWidth - x - w, bottom: innerHeight - y - h, left: x };
    const distance = Math.max(0, ...Object.values(inset));
    return { inset, duration: Math.round(Math.min(360, Math.max(180, 100 + 1.25 * distance ** 0.75))) };
  }

  const onScreen = ([x, y, w, h]) => w > 0 && h > 0 && x < innerWidth && x + w > 0 && y < innerHeight && y + h > 0;

  // Where a part sits, and where its ink starts. For text that is its first line, which may be
  // lower or shorter than the box around it. Two copies of a part are matched by their ink.
  function measure(el) {
    const box = rect(el.getBoundingClientRect());
    let ink = box;
    if (el instanceof HTMLElement && el.tagName !== 'IMG') {
      const range = document.createRange();
      range.selectNodeContents(el);
      const line = range.getClientRects()[0];
      if (line) ink = rect(line);
    }
    return { box, ink, turn: Number(el.dataset.morphTurn ?? 0) };
  }

  function rowFor(path) {
    return [...document.querySelectorAll('a[data-morph-row]')].find(
      a => a.origin === location.origin && a.pathname === path,
    );
  }

  function adopt(row) {
    for (const el of row.querySelectorAll('[data-morph-part]')) el.dataset.morph = el.dataset.morphPart;
  }

  function name(el) {
    el.style.setProperty('view-transition-name', el.dataset.morph);
    el.style.setProperty('view-transition-class', 'morph-part');
  }

  function clear() {
    for (const el of document.querySelectorAll('[data-morph]')) {
      el.style.removeProperty('view-transition-name');
      el.style.removeProperty('view-transition-class');
      if (!el.getAttribute('style')) el.removeAttribute('style');
      if (el.dataset.morphPart) delete el.dataset.morph;
    }
    for (const side of ['top', 'right', 'bottom', 'left', 'dur']) root.style.removeProperty(`--morph-${side}`);
    if (!root.getAttribute('style')) root.removeAttribute('style');
  }

  // The note lives for one change of page.
  function take() {
    try {
      const note = JSON.parse(sessionStorage.getItem(NOTE));
      sessionStorage.removeItem(NOTE);
      return note;
    } catch {
      return null;
    }
  }

  function leave(note) {
    try {
      sessionStorage.setItem(NOTE, JSON.stringify(note));
    } catch {}
  }

  // The old copy starts as it is and ends at the new copy's size and place. The new copy starts
  // at the old one's and ends as it is. Both move by the same rule, so they stay on top of each other.
  function travel(part, from, to, duration) {
    const k = to.ink[3] / from.ink[3];
    const fx = from.ink[0] - from.box[0];
    const fy = from.ink[1] - from.box[1];
    const tx = to.ink[0] - to.box[0];
    const ty = to.ink[1] - to.box[1];
    let turn = (to.turn - from.turn) % 360;
    if (turn > 180) turn -= 360;
    if (turn < -180) turn += 360;

    const pose = (x, y, scale, [, , w, h], degrees) =>
      `translate(${x}px, ${y}px) scale(${scale}) translate(${w / 2}px, ${h / 2}px) rotate(${degrees}deg) translate(${-w / 2}px, ${-h / 2}px)`;
    const timing = { duration, easing: EASE, fill: 'both' };

    root.animate(
      { transform: [pose(0, 0, 1, from.box, 0), pose(tx - k * fx, ty - k * fy, k, from.box, turn)] },
      { ...timing, pseudoElement: `::view-transition-old(${part})` },
    );
    root.animate(
      { transform: [pose(fx - tx / k, fy - ty / k, 1 / k, to.box, -turn), pose(0, 0, 1, to.box, 0)] },
      { ...timing, pseudoElement: `::view-transition-new(${part})` },
    );
  }

  addEventListener('pageswap', event => {
    visit += 1;
    clear();
    take();
    const to = event.activation?.entry?.url;
    if (!event.viewTransition || !to || still.matches) return;

    const row = rowFor(new URL(to).pathname);
    if (row) adopt(row);

    const parts = {};
    for (const el of document.querySelectorAll('[data-morph]')) {
      const place = measure(el);
      if (!onScreen(place.box)) continue;
      name(el);
      parts[el.dataset.morph] = place;
    }

    leave({
      from: location.pathname,
      to: new URL(to).pathname,
      row: row ? rect(row.getBoundingClientRect()) : null,
      parts,
    });
  });

  addEventListener('pagereveal', event => {
    const mine = (visit += 1);
    clear();
    const note = take();
    const transition = event.viewTransition;
    if (!transition) return;

    running = transition;
    const done = () => {
      if (running === transition) running = null;
      if (mine === visit) clear();
    };
    transition.finished.then(done, done);

    // From here on it is a morph. Without a note, or under reduced motion, the pages crossfade.
    if (!transition.types || !note || note.to !== location.pathname || still.matches) return;

    // The note has a row when the last page opened this one from it. If not, this page may hold
    // the row the last page came out of.
    let type = 'grow';
    let plane = note.row;
    if (!plane) {
      const row = rowFor(note.from);
      if (!row) return;
      adopt(row);
      plane = rect(row.getBoundingClientRect());
      type = 'collapse';
    }

    const { inset, duration } = reach(plane);
    for (const side in inset) root.style.setProperty(`--morph-${side}`, `${inset[side]}px`);
    root.style.setProperty('--morph-dur', `${duration}ms`);
    transition.types.add(type);

    const pairs = [];
    for (const el of document.querySelectorAll('[data-morph]')) {
      const from = note.parts[el.dataset.morph];
      const to = measure(el);
      if (!from || !onScreen(to.box)) continue;
      name(el);
      pairs.push([el.dataset.morph, from, to]);
    }

    transition.ready.then(
      () => pairs.forEach(pair => travel(...pair, duration)),
      () => {},
    );
  });

  // Nobody waits for a change of page. While one runs, the browser gives every press to the page as
  // a whole, not to what is under the pointer. So a press ends it at once, and its click is passed
  // on to whatever it landed on.
  addEventListener(
    'pointerdown',
    () => {
      if (!running) return;
      cut = running.finished;
      running.skipTransition();
    },
    true,
  );

  addEventListener(
    'click',
    event => {
      const ended = cut;
      cut = null;
      if (!ended || event.target !== root) return;
      const { clientX, clientY, ctrlKey, metaKey, shiftKey, altKey } = event;
      const pass = () => {
        const under = document.elementFromPoint(clientX, clientY);
        if (!under || under === root) return;
        under.dispatchEvent(
          new MouseEvent('click', { bubbles: true, cancelable: true, composed: true, view: window, clientX, clientY, ctrlKey, metaKey, shiftKey, altKey }),
        );
      };
      ended.then(pass, pass);
    },
    true,
  );

  // Sibling sites.
  //
  // Leaving for one, the row's plane grows over this page and turns the sibling's colour. The
  // sibling starts on that colour and brings its contents in. Coming back, this page starts under
  // that colour, and the plane collapses into the row it came from.
  //
  // The plane is html::before. It is drawn while data-veil holds the sibling's name, and morph.css
  // gives each sibling its colour. Under reduced motion it fades where it is.
  const COVER = '::before';
  let covering = [];
  let going = null; // 'out' while the plane grows and the visit is under way, 'back' while it collapses

  // The sibling a url belongs to: "yukigumo" for yukigumo.mercuriusdream.com. Null for anything else.
  function sibling(url) {
    try {
      const { protocol, hostname } = new URL(url);
      const tail = `.${location.hostname}`;
      return protocol === location.protocol && hostname.endsWith(tail) ? hostname.slice(0, -tail.length) : null;
    } catch {
      return null;
    }
  }

  function lift() {
    for (const animation of covering) animation.cancel();
    covering = [];
    going = null;
    root.removeAttribute('data-veil');
  }

  function cover(row, opening) {
    for (const animation of covering) animation.cancel();
    const target = { pseudoElement: COVER, fill: 'both' };
    const fade = { opacity: opening ? [0, 1] : [1, 0] };

    if (still.matches) {
      covering = [root.animate(fade, { ...target, duration: 160 })];
    } else {
      const { inset, duration } = reach(rect(row.getBoundingClientRect()));
      const radius = getComputedStyle(row).borderTopLeftRadius;
      const atRow = {
        clipPath: `inset(${inset.top}px ${inset.right}px ${inset.bottom}px ${inset.left}px round ${radius})`,
        backgroundColor: getComputedStyle(row, '::before').backgroundColor,
      };
      const atScreen = {
        clipPath: `inset(0px round ${radius})`,
        backgroundColor: getComputedStyle(root, COVER).backgroundColor,
      };
      covering = [
        root.animate(opening ? [atRow, atScreen] : [atScreen, atRow], { ...target, duration, easing: EASE }),
        // It takes the row's place at the start, and gives it back at the end.
        opening
          ? root.animate(fade, { ...target, duration: duration * 0.15 })
          : root.animate(fade, { ...target, duration: duration * 0.3, delay: duration * 0.7 }),
      ];
    }
    return Promise.all(covering.map(animation => animation.finished));
  }

  function uncover() {
    const name = root.dataset.veil;
    if (name === undefined || going === 'back') return;
    const row = [...document.querySelectorAll('a[data-morph-row]')].find(a => sibling(a.href) === name);
    if (!row) return lift();
    going = 'back';
    try {
      cover(row, false).then(lift, () => {});
    } catch {
      lift();
    }
  }

  addEventListener('click', event => {
    const row = event.target.closest?.('a[data-morph-row]');
    const name = row && sibling(row.href);
    if (!name || event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (going === 'out') return;
    going = 'out';
    root.dataset.veil = name;
    const go = () => {
      location.assign(row.href);
      // If the visit is cancelled, the page comes back.
      setTimeout(uncover, 3000);
    };
    try {
      cover(row, true).then(go, () => {});
    } catch {
      go();
    }
  });

  // Arriving from a sibling, the page starts under the sibling's colour. The plane collapses as
  // soon as its row is on the page, which is the first frame: it does not wait for the scripts.
  const from = sibling(document.referrer);
  if (from && performance.getEntriesByType('navigation')[0]?.type === 'navigate') {
    root.dataset.veil = from;
    const arrive = () => {
      const parsed = [...document.querySelectorAll('a[data-morph-row]')].some(a => sibling(a.href) === from);
      if (parsed || document.readyState !== 'loading') uncover();
      else requestAnimationFrame(arrive);
    };
    requestAnimationFrame(arrive);
  }

  // The browser's back button restores this page as it was left: covered.
  addEventListener('pageshow', event => {
    if (event.persisted) uncover();
  });

  // Ahead of the press.
  //
  // A morph cannot start before the next page has a frame to show. If that page still has to be
  // fetched, the press waits for the network and the morph comes late. So every page a link here
  // opens with a morph is made ready beforehand: once when this page has settled, and again when
  // the pointer or the focus reaches the link, because what was fetched goes stale in minutes.
  //
  // Ready is two things. A page on this origin is drawn ahead of time where the browser does that
  // (speculation rules), and the press swaps it in whole. And for every page, sibling sites
  // included, the page and what its first frame waits for are fetched into the cache: its
  // stylesheets, its scripts, and what it preloads.
  const FIRST_FRAME = 'link[rel~="stylesheet"][href], link[rel~="preload"][href], link[rel~="modulepreload"][href], script[src]';
  const AGAIN_AFTER = 5000;
  const readied = new Map();
  let ahead = null;

  // The page a link opens with a morph. Null for every other link.
  function opens(a) {
    if (!(a instanceof HTMLAnchorElement) || a.target === '_blank' || a.hasAttribute('download')) return null;
    if (a.origin === location.origin) return a.pathname === location.pathname ? null : a.origin + a.pathname;
    return a.matches('[data-morph-row]') && sibling(a.href) !== null ? a.href : null;
  }

  async function ready(page) {
    if (navigator.connection?.saveData || Date.now() - readied.get(page) < AGAIN_AFTER) return;
    readied.set(page, Date.now());
    try {
      const response = await fetch(page);
      if (!response.ok) return;
      const markup = new DOMParser().parseFromString(await response.text(), 'text/html');
      for (const el of markup.querySelectorAll(FIRST_FRAME)) {
        if (el.media && !matchMedia(el.media).matches) continue;
        const url = new URL(el.getAttribute('href') ?? el.getAttribute('src'), response.url);
        fetch(url, { mode: 'no-cors' }).catch(() => {});
      }
    } catch {}
  }

  function drawAhead(pages) {
    ahead?.remove();
    ahead = null;
    if (!pages.length || !HTMLScriptElement.supports?.('speculationrules')) return;
    ahead = document.createElement('script');
    ahead.type = 'speculationrules';
    ahead.textContent = JSON.stringify({ prerender: [{ source: 'list', urls: pages }] });
    document.head.append(ahead);
  }

  function readyAll() {
    const pages = [...new Set([...document.links].map(opens).filter(Boolean))];
    drawAhead(pages.filter(page => new URL(page).origin === location.origin));
    pages.forEach(ready);
  }

  // After this page's own loading, and after its own morph or its plane's collapse, so that
  // nothing here competes with them. A page that is itself only drawn ahead, or sits in a tab
  // nobody is looking at, has no frames: it waits here until it is shown.
  async function settled() {
    if (document.readyState !== 'complete') await new Promise(done => addEventListener('load', done, { once: true }));
    await new Promise(requestAnimationFrame);
    await running?.finished.catch(() => {});
    await Promise.allSettled(covering.map(animation => animation.finished));
    await new Promise(done => (window.requestIdleCallback ?? setTimeout)(done));
  }

  settled().then(readyAll);

  function nearing(event) {
    const page = opens(event.target.closest?.('a[href]'));
    if (page) ready(page);
  }

  addEventListener('pointerover', nearing, { passive: true });
  addEventListener('focusin', nearing);

  // The browser's back button restores this page with what it had made ready, however long ago.
  addEventListener('pageshow', event => {
    if (event.persisted) settled().then(readyAll);
  });
})();
