// Page morphs. Every page on this origin loads this file in its head, with morph.css.
//
// The markup says what takes part:
//   data-morph="title"        a part of the page. It travels to the part with the same name on the other page.
//   data-morph-row            a link that opens a page on this origin.
//   data-morph-part="title"   inside a row: a part only while its row is the one opening or closing.
//   data-morph-turn="180"     the way an arrow points, in degrees clockwise from right.
//
// The page being left writes a note: where its row is, and where each of its parts on screen sits.
// The page being shown reads the note, names its matching parts, and tells morph.css where the
// window starts or ends. A part that is off screen on either page stays out of it.
(() => {
  const NOTE = 'morph';
  const EASE = 'cubic-bezier(0.2, 0, 0, 1)';
  const root = document.documentElement;
  const still = matchMedia('(prefers-reduced-motion: reduce)');
  let visit = 0;
  let running = null;
  let cut = null;

  const rect = r => [r.left, r.top, r.width, r.height];
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
    if (!transition?.types || !note || note.to !== location.pathname || still.matches) return;

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

    const [x, y, w, h] = plane;
    const inset = { top: y, right: innerWidth - x - w, bottom: innerHeight - y - h, left: x };
    for (const side in inset) root.style.setProperty(`--morph-${side}`, `${inset[side]}px`);

    // A larger change takes longer: the time grows with the distance the plane's edge travels.
    const distance = Math.max(0, ...Object.values(inset));
    const duration = Math.round(Math.min(360, Math.max(180, 100 + 1.25 * distance ** 0.75)));
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
    running = transition;
    const done = () => {
      if (running === transition) running = null;
      if (mine === visit) clear();
    };
    transition.finished.then(done, done);
  });

  // Nobody waits for a morph. While one runs, the browser gives every press to the page as a whole,
  // not to what is under the pointer. So a press ends the morph at once, and its click is passed on
  // to whatever it landed on.
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
})();
