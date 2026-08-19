import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier";

const eslintConfig = [
  ...nextVitals,
  ...nextTypeScript,
  prettier,
  {
    ignores: [
      ".next/**",
      ".contentlayer/**",
      "lib/api/generated/schema.ts",
      "node_modules.pre-phase1/**",
    ],
  },
];

export default eslintConfig;
