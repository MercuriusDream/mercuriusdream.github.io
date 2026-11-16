import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles.css';

const root = document.getElementById('root');
const app = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// The built page arrives with its markup in place (scripts/prerender.js). The dev server's root is empty.
if (root.firstElementChild) ReactDOM.hydrateRoot(root, app);
else ReactDOM.createRoot(root).render(app);

// Arriving from a sibling site, index.html starts the page veiled. Lift the veil once it has painted.
// Returning with the browser's back button restores the page as it was left: veiled.
const unveil = () => document.documentElement.removeAttribute('data-veil');
requestAnimationFrame(() => requestAnimationFrame(unveil));
addEventListener('pageshow', event => {
  if (event.persisted) unveil();
});
