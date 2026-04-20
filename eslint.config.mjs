import { defineConfig } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

export default defineConfig([
    {
        ignores: ["src/app/(payload)/**", "src/payload-types.ts"],
    },
    {
        extends: [...nextCoreWebVitals, ...nextTypescript],
    },
]);
