import { fixupConfigRules } from "@eslint/compat";
import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat();

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
    ...fixupConfigRules(compat.extends("next/core-web-vitals", "prettier")),
    { ignores: [".next"] },
];
