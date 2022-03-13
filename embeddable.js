/*
 * Embeddable
 * =========
 * Version: 0.1
 * Author: Yeden Sherpa
 * Author URL: https://github.com/y3d3n
 * Plugin URL: https://github.com/y3d3n/embeddable
 * Description: JavaScript library to embed cubehall content without iframe and make it seo friendly
 * License: MIT
 */

!(function(){
    "use strict";
    var options ={
      target:"cubehall-embed-block",
      showMedia:true,
      showTitle:true,
      showDescription:false,
      _blank:true,
      showButton:false      
    },
    targetDOMs = [],
    permalink = "a[data-link]",
    domain = "http://192.168.1.85/api",
    messages = {
      missingTargetid: "Please specify element target id",
      missingTargetHtml: "HTML element with target class not fould",
      missingFeedUrl: "Embedable URL not found",
      errorFetching: "Error reading data from remote url"
    },
    identifiers = ['list', 'showoff', 'board', 'follow', 'parlor']
    ;
    embedInit();
    function embedInit(){
      let t = document.querySelectorAll("script[src*='embeddable.js']");
      let tl= t.length;
      for(let i = 0; i < tl; i++){
        if(i > 0){
          t[i].remove();
        }
      }
      if(validateOptions()){
      createFrame();
    }
  }

    function findTargets(){
      targetDOMs = document.querySelectorAll('.' + options.target);
    }

    function createFrame(){
      findTargets();
      targetDOMs.forEach(e => {
        var l = e.querySelector(permalink).getAttribute('href');
        e.querySelector(permalink).setAttribute("class", "cubehall-btn-link");
        if(validateUrl(l)){
          getIframe(createLink(l))
            .then(data => {
              embed(e, data);
            });
        }
        resizeFrame(e);
      });
      insertStylesheet();
    }

    function resizeFrame(e){
      var h, w;
      
      // h = e.getAttribute('height');
      // if(h){
      //   e.style.maxHeight = h;
      // } else {
      //   e.style.maxHeight = "100%";
      // }

      w = e.getAttribute('width');
      if(w){
        e.style.maxWidth = w;
      }else {
        e.style.maxWidth = "100%";
      }
    }

    function embed(e, data){
      e.insertAdjacentHTML('afterbegin', data);
    }

    function createLink(url){
      var paramlink="";
      var u = url.split('//');
      if(u[0] === "http:" || u[0] === "https:"){
        var keys = u[1].split('/');
        if(keys[0] === "cubehall.com"){           
           if(validateIdentifier(keys[1], identifiers)){
             paramlink = domain + '/embed/' + keys[1] + "/" +  keys[2];
             return paramlink;
           }
        }else{
          console.log(messages.missingFeedUrl);
          return;
        }
        return;
      }
    }

    function validateIdentifier(id, identifiers ){
      return (identifiers.indexOf(id) > -1);
    }

    function validateUrl(url=""){
      if(url){
        return true;
      }
      return false;
    }

    async function getIframe(url=""){
      const response = await fetch(url,{
        method: 'GET',
        mode: 'cors',
        credentials: 'same-origin',
        headers:{
          'Content-Type': 'application/json'
        },
        redirect: 'follow',
        cache: 'no-cache',
        referrerPolicy: 'no-referrer',
      });
      return response.text();
    }

    function validateOptions(){
      if(!options.target){
        console.log(messages.missingTargetid);
        return false;
      }
      return true;
    }

    function insertStylesheet(){
      var style = ".cubehall-embed-block { border-radius: 24px; overflow: hidden; border:solid 1px #c8c8c8; } .cubehall-btn-link { margin: 16px; display: flex; } ";
      var css = document.createElement('style');
      css.type = 'text/css';
   
      if (css.styleSheet)
          css.styleSheet.cssText = style;
      else
          css.appendChild(document.createTextNode(style));
       
      /* Append style to the tag name */
      document.getElementsByTagName("head")[0].appendChild(css);

    }
})();
