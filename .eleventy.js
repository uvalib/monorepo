module.exports = function(eleventyConfig) {
    eleventyConfig.addDataExtension("xml", contents => { return {contents: contents}; });
    eleventyConfig.addPassthroughCopy({"src/js":"js"});
    return {
      dir: {
        input: "src",
        output: "docs",
        data: "mlb"
      }
    }
  };