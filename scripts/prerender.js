// Write the app's markup into the built page, so the page is whole in its first frame.
// A page morph draws that frame: with an empty root, the essay would collapse into nothing.
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import App from '../src/App.jsx';

const file = new URL('../dist/index.html', import.meta.url);
const html = await Bun.file(file).text();
const root = '<div id="root"></div>';
if (!html.includes(root)) throw new Error('dist/index.html has no empty root to fill');
await Bun.write(file, html.replace(root, () => `<div id="root">${renderToString(createElement(App))}</div>`));
