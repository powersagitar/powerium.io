/** @type {import('prettier').Config} */
module.exports = {
  singleQuote: true,
  semi: true,
  trailingComma: 'all',

  importOrder: [
    '^(react|react-dom)(/.*)?$',
    '^(next)(/.*)?$',
    '<THIRD_PARTY_MODULES>',
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
    {
      files: '*.mdx',
      options: {
        printWidth: 80,
        proseWrap: 'always',
      },
    },
  ],

  plugins: [
    '@trivago/prettier-plugin-sort-imports',
    'prettier-plugin-tailwindcss',
  ],
};
