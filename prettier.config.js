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

  plugins: [
    ...styleguide.plugins,
    'prettier-plugin-tailwindcss',
    '@trivago/prettier-plugin-sort-imports',
  ],
};
