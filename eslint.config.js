module.exports = {
  overrides: [
    {
      files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
      plugins: {
        js: require("@eslint/js"),
      },
      extends: ["plugin:js/recommended"],
    },
    {
      files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
      languageOptions: {
        globals: require("globals").browser,
      },
    },
    require("typescript-eslint").configs.recommended,
    require("eslint-plugin-react").configs.flat.recommended,
  ],
};