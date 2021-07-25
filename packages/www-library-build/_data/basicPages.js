const Cache = require("@11ty/eleventy-cache-assets");
const Image = require("@11ty/eleventy-img");

module.exports = async ()=>{

  // Basic Pages API: https://drupal.lib.virginia.edu/pages?_format=json
  let json = await Cache("https://drupal.lib.virginia.edu/pages?_format=json", {
    duration: "5m", // 5 minutes
    type: "json"
  });

  var _getValue = (v,k='value')=>{
    return v && Array.isArray(v) && v.length>0? 
      v.map(i=>i[k]): 
      [];
  };

  let results = [];
  for (let i=0; i<json.length; i++) {
    let e = json[i];

    let obj = {
        'uuid': _getValue(e.uuid)[0],
        'created': _getValue(e.created)[0],
        'changed': _getValue(e.changed)[0],
        'sticky': _getValue(e.sticky)[0],
        'promote': _getValue(e.promote)[0],
        'title': _getValue(e.title)[0],
        'body': _getValue(e.body)[0],
        'path': _getValue(e.field_path)[0],
        'noBots': _getValue(e.field_advanced_no_bots)[0],
        'parent': _getValue(e.field_parent_page, 'target_uuid')[0],
        'iframe': _getValue(e.field_serve_via_iframe)[0],
        'sidebar': _getValue(e.field_sidebar, 'target_uuid')[0],
        'subnav': _getValue(e.field_subnav, 'target_uuid')[0]
    };

    results.push(obj);    
    
  }
  return results;
  
};