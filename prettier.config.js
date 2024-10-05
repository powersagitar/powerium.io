const styleguide = require('@vercel/style-guide/prettier');

module.exports = {
  ...styleguide,

  "importOrder": ["^server-only", "(?!server-only)^\\w", "^@[^/]", "^@\/(?!app)", "^@/", "^[./]"],
  "importOrderSeparation": true,
  "importOrderSortSpecifiers": true,

  plugins: [...styleguide.plugins, 'prettier-plugin-tailwindcss', '@trivago/prettier-plugin-sort-imports'],
};
