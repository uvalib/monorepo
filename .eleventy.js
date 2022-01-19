const CleanCSS = require("clean-css");
module.exports = function(eleventyConfig) {
    eleventyConfig.addDataExtension("xml", contents => { return {contents: contents}; });
    eleventyConfig.addPassthroughCopy({"src/js":"js"});
    eleventyConfig.addPassthroughCopy("src/.nojekyll");
    eleventyConfig.addFilter("cssmin", function(code) { return new CleanCSS({}).minify(code).styles; });
    return {
      dir: {
        input: "src",
        output: "build",
        data: "mlb"
      }
    }
  };