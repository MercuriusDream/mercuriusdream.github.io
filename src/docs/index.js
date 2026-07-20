// Registry of writings. Add a doc module here and it becomes reachable at
// /writings/<slug>, and listed at /writings. Newest first.
import minusTwo from './minus-two.jsx';

export const list = [minusTwo];

const docs = Object.fromEntries(list.map(d => [d.slug, d]));

export default docs;
