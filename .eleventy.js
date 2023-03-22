const CleanCSS = require("clean-css");
const Fuse = require('fuse.js');
const lunr = require('lunr');
const MiniSearch = require('minisearch');
const FlexSearch = require('flexsearch');
const _ = require('lodash');

const pathPrefix = process.env.PATH_PREFIX || "";

let markdown = require("markdown-it")({
  html: true,
  breaks: true
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
        md = md.replace(/(torchbearer\s+)([A-Z][1-9]?)/g,`<uvalib-modal-image-button alt='torchbearer' src='${pathPrefix}/mlb/images/torchbearers/$2.webp'>$1$2</uvalib-modal-image-button>`); 
      if (args.includes('notes'))
        md = md.replace(/(pub\. note )([A-Z]1?[0-9]a?)/g,`<uvalib-modal-image-button alt='publishers note' src='${pathPrefix}/mlb/images/notes/$2.webp'>$1$2</uvalib-modal-image-button>`);   
      if (args.includes('book'))
        md = md.replace(/^###\s+(\d\d\d)\s*\n/mg,`### <a href='${pathPrefix}/book/$1.html'>$1</a>\n`);
      if (args.includes('jacketType'))
        md = md.replace(/(Uniform typographic jacket (A|B1|B2|B|C|D|E|F))/gi,`<uvalib-modal-image-button alt='publishers note' src='${pathPrefix}/mlb/images/typejackets/Type_Jacket_$2.webp'>$1</uvalib-modal-image-button>`);
      if (args.includes('revision'))
        md = md.replace(/^####\s+([1-9a-z]+)\.\s+(.+)\s*\n/mg,`#### <a href='${pathPrefix}/revision/$1.html'>$1. $2</a>\n`);


      return md;
    });
    eleventyConfig.addFilter("dump", function(obj) { return JSON.stringify(obj, null, 2) });
    eleventyConfig.addFilter("isarray", function(obj) { return Array.isArray(obj) });

    eleventyConfig.addFilter('findEqual', function(docs, key, value) { 
      return docs.find( function(d){
        return d[key]==value
      })
    });

    eleventyConfig.addFilter('concatList', function(docs1, docs2){
      return [...docs1, ...docs2];
    });
    eleventyConfig.addFilter('pickList', function(...args){
      let documents = args.shift();
      return documents.map( d=>_.pick(d, args) );
    } );

    eleventyConfig.addFilter('fuseIndex', function(...args){
      let documents = args.shift();
      let index = Fuse.createIndex(args, documents);
      return index.toJSON();
    });
    eleventyConfig.addFilter('lunrIndex', function(...args) {
      let documents = args.shift();
      let index = lunr(function (){
        this.ref('id');
        args.forEach( field=>this.field(field), this );
        documents.forEach( doc=>this.add(doc), this );
      });
      return index;
    });
    eleventyConfig.addFilter('miniIndex', function(...args){
      let documents = args.shift();
      let index = new MiniSearch({ fields: args, storeFields: args });
      index.addAll(documents);
      return index.toJSON();
    });
    eleventyConfig.addNunjucksAsyncFilter('flexIndex', (documents,fields, callback)=>{
      let document = new FlexSearch.Document({
        id: "id",
        index: fields, //['title','year','full']
        store: "title"
      });
      documents.forEach( doc=>document.add(doc) );
      let result = {}
      document.export((key,data)=>{
//          let result = {};
          result[key] = data;
//          result.key = key;
//          result.fields = fields;  // need to know the fields in order to import the index
//          callback(null, result);
      })
      callback(null, result);      
    })

    eleventyConfig.addFilter('markdown', content=>markdown.render(content));
    eleventyConfig.addNunjucksShortcode("arrayOrStringPara", arrayOrStringToParaShortcode);
    eleventyConfig.addNunjucksShortcode("markdown",content => markdown.render(content));
    eleventyConfig.addPassthroughCopy({"src/js":"js"});
    eleventyConfig.addPassthroughCopy("src/.nojekyll");
    eleventyConfig.addPassthroughCopy("src/mlb/images");
    eleventyConfig.addPassthroughCopy("src/images");
    eleventyConfig.addPassthroughCopy("src/fonts");
    eleventyConfig.addFilter("cssmin", function(code) { return new CleanCSS({}).minify(code).styles; });
    
    return {
      dir: {
        input: "src",
        output: "build",
        data: "mlb"
      }
    }
  };
