const CustomElementsPlugin = require("./eleventy-custom-elements-plugin");

module.exports = function(eleventyConfig) {
  // Add filters, etc.

  // Passthrough copy for static assets
  eleventyConfig.addPassthroughCopy('src/static');

  eleventyConfig.addPlugin(new CustomElementsPlugin({
    version: "2.1.6",
  }));

  return {
    dir: {
      input: 'src',
      output: '_site',
    },
  };
}
