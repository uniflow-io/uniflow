module.exports = {
    parser: `@typescript-eslint/parser`,
    extends: [
        "google",
        "eslint:recommended",
        "plugin:flowtype/recommended",
        "plugin:react/recommended",
        "prettier",
        "prettier/flowtype",
        "prettier/react",
    ],
    plugins: ["flowtype", "prettier", "react", "filenames"],
    parserOptions: {
      ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
      sourceType: "module", // Allows for the use of imports
      ecmaFeatures: {
        jsx: true,
      },
    },
    env: {
      browser: true,
      es6: true,
      node: true,
    },
    rules: {
      quotes: "off",
      "@typescript-eslint/quotes": [
        2,
        "backtick",
        {
          avoidEscape: true,
        },
      ],
      indent: ["error", 2, { SwitchCase: 1 }],
      "prettier/prettier": [
        "error",
        {
          trailingComma: "es5",
          semi: false,
          singleQuote: false,
          printWidth: 120,
        },
      ],
    },
  }