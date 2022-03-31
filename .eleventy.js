const CleanCSS = require("clean-css");
const elasticlunr = require('elasticlunr');

let markdown = require("markdown-it")({
  html: true
});

function arrayOrStringToParaShortcode(para, title, cls) {
  if (para && title && cls) {
    let code = `<h2>${title}</h2><div class="${cls}">`;
    if (Array.isArray(para)) {
      para.forEach(p=>{code+=`<p>${p}</p>`;});
    } else {
      code += `<p>${para}</p>`;
    }
    code += "</div>";
    return code;
  }
}

module.exports = function(eleventyConfig) {
    eleventyConfig.addFilter("dump", function(obj) { return JSON.stringify(obj, null, 2) });
    eleventyConfig.addFilter("markdownFilter", function(str){
      return markdown.render(str);
    })
    eleventyConfig.addFilter("mlbFilter", function(str){
      str = str.replace(/torchbearer\s+A1/gim,"<a href='http://google.com'>[torchbearer A1]</a>");
      return str;
    });
    eleventyConfig.addFilter("isarray", function(obj) { return Array.isArray(obj) });
    eleventyConfig.addFilter('eLunarIndex', function(...args) {
      let documents = args.shift();
      let index = elasticlunr(function () {
        args.forEach( function(field){ this.addField(field) }.bind(this) );
        this.saveDocument(false);
      });
      documents.forEach(d=>index.addDoc(d));
      return index.toJSON();
    });
    eleventyConfig.addNunjucksShortcode("arrayOrStringPara", arrayOrStringToParaShortcode);
    eleventyConfig.addNunjucksShortcode(
      "markdown",
      content => `<div class="md-block">${markdown.render(content)}</div>`
    );
    eleventyConfig.addPassthroughCopy({"src/js":"js"});
    eleventyConfig.addPassthroughCopy("src/.nojekyll");
    eleventyConfig.addPassthroughCopy("src/mlb/images");
    eleventyConfig.addPassthroughCopy("src/images");
    eleventyConfig.addFilter("cssmin", function(code) { return new CleanCSS({}).minify(code).styles; });
    
    return {
      dir: {
        input: "src",
        output: "build",
        data: "mlb"
      }
    }
  };