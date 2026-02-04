const lintStagedConfig = {
  "*.{js,jsx,ts,tsx,mjs}": ["eslint --fix", "prettier --write"],
  "*.{json,md,mdx,css,html,yml,yaml}": ["prettier --write"],
  "*.prisma": () => "npx prisma format --schema prisma/schema.prisma",
};

export default lintStagedConfig;
