// app.js – shared utilities
window.App = {
  // Parse query string into object
  getQueryParams: function(){
    const params = {};
    const query = window.location.search.substring(1);
    if(!query) return params;
    query.split('&').forEach(pair=>{
      const [key,val] = pair.split('=');
      params[decodeURIComponent(key)] = decodeURIComponent(val||'');
    });
    return params;
  }
};
