import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';

const eslintConfig = [
  { ignores: ['**/.next/**', '.claude/worktrees/**'] },
  ...nextCoreWebVitals,
];

export default eslintConfig;
