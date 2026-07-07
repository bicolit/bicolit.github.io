import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = [
  { ignores: [".next/**", "node_modules/**", "docs/**"] },
  ...nextCoreWebVitals,
];

export default eslintConfig;
