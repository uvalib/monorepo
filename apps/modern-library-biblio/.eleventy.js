const templateConfig = require("@uvalib/11ty-template");

module.exports = function(eleventyConfig) {
  // Use the configuration from the template
  templateConfig(eleventyConfig);

  // Add your own additional configuration here

  // For example, add a passthrough copy for additional static assets
  eleventyConfig.addPassthroughCopy('src/my-assets');
}