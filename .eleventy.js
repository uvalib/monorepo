const CleanCSS = require("clean-css");
const { XMLParser } = require("fast-xml-parser");
const parser = new XMLParser();

module.exports = function(eleventyConfig) {
    eleventyConfig.addDataExtension("xml", contents => { 
        let jObj = parser.parse(contents);
        return {
            contents: contents,
            books: jObj.TEI.BOOK
        }; 
    });
    eleventyConfig.addPassthroughCopy({"src/js":"js"});
    eleventyConfig.addPassthroughCopy("src/.nojekyll");
    eleventyConfig.addPassthroughCopy({"src/mlb/TransmogXML":"items"});
    eleventyConfig.addFilter("cssmin", function(code) { return new CleanCSS({}).minify(code).styles; });
    return {
      dir: {
        input: "src",
        output: "build",
        data: "mlb"
      }
    }
  };