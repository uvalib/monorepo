import('./uvalib-header-cf4d478e.js');

window.addEventListener('load', ()=>{
    if(window.location.host.indexOf('avalon.lib.virginia.edu')>-1) {
      let newScript = document.createElement("script")
      newScript.setAttribute('type','module')
      newScript.setAttribute('src','https://static.lib.virginia.edu/js/controllers/components-build/uvalib-alerts-regional.js')
      document.head.append(newScript)
    
      let newEle = document.createElement('uvalib-alerts-regional');
      newEle.setAttribute('style','margin-top: 5px; display: none;')
      document.querySelector('.custom-header .container').prepend(newEle)
    }
  })
  
