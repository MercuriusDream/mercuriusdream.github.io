// Registry of writings. Every doc module in this folder is picked up
// automatically (import.meta.glob) and becomes reachable at /writings/<slug>,
// listed at /writings. Newest first, sorted by the date in ./meta — adding a
// writing = adding one meta entry + one doc module, no edits here.
const modules = import.meta.glob('./*.jsx', { eager: true });

export const list = Object.values(modules)
  .map(m => m.default)
  .filter(d => d?.slug)
  .sort((a, b) => new Date(b.date) - new Date(a.date));

const docs = Object.fromEntries(list.map(d => [d.slug, d]));

export default docs;
