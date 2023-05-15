const CustomElementsPlugin = require("./eleventy-custom-elements-plugin");

module.exports = function(eleventyConfig) {
  // Add filters, etc.

  // Default page wrapper
//  eleventyConfig.addLayoutAlias('default', 'base.njk');

  // Passthrough copy for static assets
  eleventyConfig.addPassthroughCopy('src/static');

  eleventyConfig.addPlugin(new CustomElementsPlugin({
    version: "2.1.6",
  }));

  return {
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    dir: {
      input: 'src',
      output: '_site',
    },
    templateFormats: ["html", "md", "njk"],
    passthroughFileCopy: true,
  };
}
