// Brand-accurate SVG glyphs — canonical paths from Simple Icons (CC0).
// Non-brand glyphs use compact custom SVGs tuned for this footer.

const base = {
  width: 22,
  height: 22,
  viewBox: '0 0 24 24',
  fill: 'currentColor',
  'aria-hidden': true,
  focusable: false,
};

// GitHub Octocat — official simplified mark
export const IconGitHub = (p) => (
  <svg {...base} {...p}>
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.305-5.467-1.334-5.467-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.4 3-.405 1.02.005 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

// X (formerly Twitter) — official mark
export const IconX = (p) => (
  <svg {...base} {...p}>
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.847h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.831L0 1.153h7.594l5.243 6.932zm-1.292 19.49h2.039L6.486 3.24H4.298z" />
  </svg>
);

// Google "G" — the Google brand mark in monochrome (used for Google VRP / bughunters)
export const IconVRP = (p) => (
  <svg {...base} {...p}>
    <path d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972a6.033 6.033 0 110-12.064c1.498 0 2.866.549 3.921 1.453l2.814-2.814A9.969 9.969 0 0012.545 2C7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c5.518 0 9.166-3.879 9.166-9.337 0-.811-.077-1.586-.231-2.424h-8.935z" />
  </svg>
);

// Mail — filled mailbox silhouette; no envelope flap or @ symbol.
export const IconMail = (p) => (
  <svg {...base} {...p}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10 3h4a7 7 0 0 1 7 7v8H3v-8a7 7 0 0 1 7-7Zm0 4a3 3 0 0 0-3 3v4h10v-4a3 3 0 0 0-3-3h-4Zm8-3h4v3h-4V4Zm-8 15h4v4h-4v-4Z"
    />
  </svg>
);

// Blog — RSS-like filled broadcast mark for a heavier footer silhouette.
export const IconBlog = (p) => (
  <svg {...base} {...p}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3.25 17.1a3.25 3.25 0 1 1 0 6.5 3.25 3.25 0 0 1 0-6.5ZM0 8.05c8.8 0 15.95 7.15 15.95 15.95h-4.8C11.15 17.85 6.15 12.85 0 12.85v-4.8ZM0 0c13.25 0 24 10.75 24 24h-4.8C19.2 13.4 10.6 4.8 0 4.8V0Z"
    />
  </svg>
);

// Kaomoji >_<
export const KaomojiIcon = ({ alt = '', blink = false, ...p }) => (
  <img src={blink ? '/logo-blink.svg' : '/logo.svg'} alt={alt} {...p} />
);
