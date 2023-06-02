const templateConfig = require("@uvalib/11ty-template");
const Fuse = require('fuse.js');
const _ = require('lodash');

const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const pathPrefix = process.env.PATH_PREFIX || "";

module.exports = function(eleventyConfig) {
  // Use the configuration from the template
  let config = templateConfig(eleventyConfig);

  eleventyConfig.addFilter('yearSearchPick', function(...args){
    let document = args.shift();
    return _.pickBy(document, (value,key)=>{ 
      return !key.match(/^\d+$/) && key!=="full" && key!=="plainText";
    });
  });

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

  eleventyConfig.addFilter("addAnchors", function(...args){
    let html = args.shift();
    const dom = new JSDOM(html);
    [...dom.window.document.querySelectorAll('h3')].forEach(el=>{
      const anchorName = _.camelCase(el.textContent);
      const anchor = dom.window.document.createElement('a')
      anchor.setAttribute("name",anchorName);
      el.appendChild(anchor);
    })
    return dom.serialize();
  })

  // For example, add a passthrough copy for additional static assets
  eleventyConfig.addPassthroughCopy('src/my-assets');

  config.dir = {
    input: "src",
    output: "build",
    data: "mlb"
  };

  return config;
}

/*



const lunr = require('lunr');
const MiniSearch = require('minisearch');
const FlexSearch = require('flexsearch');
const _ = require('lodash');





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

  // Add your own additional configuration here
  eleventyConfig.addFilter('fuseIndex', function(...args){
    let documents = args.shift();
    let index = Fuse.createIndex(args, documents);
    return index.toJSON();
  });

module.exports = function(eleventyConfig) {

    eleventyConfig.addFilter("reformatName", function (...args) {
      let name = args.shift();
      let nameParts = name.split(' ');
      if (nameParts.length != 2) {
          return 'Error: Name does not consist of exactly 2 parts';
      }
      return nameParts.reverse().join(', ');
    });

    eleventyConfig.addFilter("dump", function(obj) { return JSON.stringify(obj, null, 2) });
    eleventyConfig.addFilter("isarray", function(obj) { return Array.isArray(obj) });

    eleventyConfig.addFilter('findEqual', function(docs, key, value) { 
      return docs.find( function(d){
        return d[key]==value
      })
    });



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
        store: true
      });
      documents.forEach( doc=>document.add(doc) );
      let result = {}
      document.export((key,data)=>{
          result[key] = data;
      })
      callback(null, result);      
    })

    eleventyConfig.addNunjucksShortcode("arrayOrStringPara", arrayOrStringToParaShortcode);
    
    eleventyConfig.addPassthroughCopy({"src/js":"js"});
    eleventyConfig.addPassthroughCopy("src/.nojekyll");
    eleventyConfig.addPassthroughCopy("src/mlb/images");
    eleventyConfig.addPassthroughCopy("src/images");
    eleventyConfig.addPassthroughCopy("src/fonts");
    eleventyConfig.addFilter("cssmin", function(code) { return new CleanCSS({}).minify(code).styles; });
    
    return {
      
    }
  };


*/