const styleguide = require('@vercel/style-guide/prettier');

module.exports = {
  ...styleguide,

  importOrder: [
    '^server-only',
    '(?!server-only)^\\w',
    '^@[^/]',
    '^@/(?!app)',
    '^@/',
    '^[./]',
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,

  overrides: [
    {
      files: '*.md',
      options: {
        printWidth: 80,
        proseWrap: 'always',
      },
    },
  ],

  // some prettier plugins may conflict with each other
  // see https://github.com/tailwindlabs/prettier-plugin-tailwindcss/issues/31#issuecomment-1319130168
  plugins: [
    ...styleguide.plugins,
    '@trivago/prettier-plugin-sort-imports',
    'prettier-plugin-tailwindcss',
  ],
};
