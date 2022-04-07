const CleanCSS = require("clean-css");
const elasticlunr = require('elasticlunr');
const Fuse = require('fuse.js');

const pathPrefix = process.env.PATH_PREFIX || "";

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
    eleventyConfig.addFilter("addLinks", function(...args) {
      let md = args.shift();
      if (args.includes('torchbearer'))
        md = md.replace(/(torchbearer\s+)([A-Z][1-9]?)/g,`<uvalib-modal-image-button alt=' ' src='${pathPrefix}/mlb/images/torchbearers/$2.webp'>$1$2</uvalib-modal-image-button>`); 
      if (args.includes('book'))
        md = md.replace(/^###\s+(\d\d\d)\s*\n/mg,`### <a href='${pathPrefix}/book/$1.html'>$1</a>\n`);
      if (args.includes('revision'))
        md = md.replace(/^####\s+([1-9a-z]+)\.\s+(.+)\s*\n/mg,`#### <a href='${pathPrefix}/revision/$1.html'>$1. $2</a>\n`);
      return md;
    });
    eleventyConfig.addFilter("dump", function(obj) { return JSON.stringify(obj, null, 2) });
    eleventyConfig.addFilter("isarray", function(obj) { return Array.isArray(obj) });
    eleventyConfig.addFilter('fuseIndex', function(...args){
      let documents = args.shift();
      let index = Fuse.createIndex(args, documents);
      return index.toJSON();
    });
    eleventyConfig.addFilter('eLunarIndex', function(...args) {
      let documents = args.shift();
      let index = elasticlunr(function () {
        args.forEach( function(field){ this.addField(field) }.bind(this) );
        this.saveDocument(false);
      });
      documents.forEach(d=>index.addDoc(d));
      return index.toJSON();
    });
    eleventyConfig.addFilter('markdown', content=>markdown.render(content));
    eleventyConfig.addNunjucksShortcode("arrayOrStringPara", arrayOrStringToParaShortcode);
    eleventyConfig.addNunjucksShortcode("markdown",content => markdown.render(content));
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