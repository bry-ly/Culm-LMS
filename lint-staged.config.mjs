const lintStagedConfig = {
  "*.{js,jsx,ts,tsx,mjs}": ["eslint --fix", "prettier --write"],
  "*.{json,md,mdx,css,html,yml,yaml}": ["prettier --write"],
  "*.prisma": ["prettier --write"],
};

export default lintStagedConfig;
