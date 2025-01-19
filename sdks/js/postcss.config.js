const postcssPrefixSelector = require("postcss-prefix-selector");

module.exports = {
  plugins: [
    require("postcss-import")(),
    require("tailwindcss")(),
    require("autoprefixer")(),
    postcssPrefixSelector({
      prefix: ".sai", // Unique class for scoping
      // transform: (prefix, selector, prefixedSelector) => {
      //   if (selector.startsWith(":root")) {
      //     return prefix; // Keep `:root` styles scoped
      //   }
      //   return prefixedSelector;
      // },
    }),
  ],
};
