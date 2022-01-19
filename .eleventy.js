module.exports = function(eleventyConfig) {
    eleventyConfig.addDataExtension("xml", contents => { return {contents: contents}; });
    eleventyConfig.addPassthroughCopy({"src/js":"js"});
    eleventyConfig.addPassthroughCopy("src/.nojekyll");
    return {
      dir: {
        input: "src",
        output: "docs",
        data: "mlb"
      }
    }
  };