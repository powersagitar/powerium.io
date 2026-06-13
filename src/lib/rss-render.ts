import 'server-only';

// This module is intentionally separate from the app/ directory so that
// `react-dom/server` can be imported without triggering Next.js / Turbopack's
// "You're importing a component that imports react-dom/server" build error,
// which fires on any file inside app/ that directly or transitively imports it.

const { renderToStaticMarkup } =
  require('react-dom/server') as typeof import('react-dom/server');

export { renderToStaticMarkup };
