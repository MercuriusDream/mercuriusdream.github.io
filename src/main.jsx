import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// Arriving from a sibling site, index.html starts the page veiled. Lift the veil once it has painted.
// Returning with the browser's back button restores the page as it was left: veiled.
const unveil = () => document.documentElement.removeAttribute('data-veil');
requestAnimationFrame(() => requestAnimationFrame(unveil));
addEventListener('pageshow', event => {
  if (event.persisted) unveil();
});
