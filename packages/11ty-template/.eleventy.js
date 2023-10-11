const CustomElementsPlugin = require("./eleventy-custom-elements-plugin");
const _ = require('lodash');
const CleanCSS = require("clean-css");

module.exports = function(eleventyConfig) {
  // Add filters, etc.
  eleventyConfig.addFilter('pickList', function(...args){
    let documents = args.shift();
    return documents.map( d=>_.pick(d, args) );
  } );

  eleventyConfig.addFilter('concatList', function(docs1, docs2){
    return [...docs1, ...docs2];
  });

  eleventyConfig.addFilter("cssmin", function(code) { 
    return new CleanCSS({}).minify(code).styles; 
  });

  // Add a filter that sorts an array of objects by a specified property
  eleventyConfig.addFilter("sortByProperty", function(array, propertyName) {
      return array.slice().sort(function(a, b) {
          // Convert the properties to string for alphanumeric comparison
          const propA = String(a[propertyName]);
          const propB = String(b[propertyName]);

          // Compare the two properties
          if (propA < propB) {
              return -1;
          }
          if (propA > propB) {
              return 1;
          }
          return 0;
      });
  });

  let markdown = require("markdown-it")({
    html: true,
    breaks: true
  });

  eleventyConfig.addFilter('markdown', content=>markdown.render(content));
  eleventyConfig.addNunjucksShortcode("markdown",content => markdown.render(content));

  // Default page wrapper
//  eleventyConfig.addLayoutAlias('default', 'base.njk');

  // Passthrough copy for static assets
  eleventyConfig.addPassthroughCopy('src/static');

  eleventyConfig.addPlugin(new CustomElementsPlugin({
    version: "latest",
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
