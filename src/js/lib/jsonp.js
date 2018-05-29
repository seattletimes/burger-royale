var guid = 0;

var jsonp = function(url, params, callback) {
  var nonce = "_jsonp" + Date.now() + guid++;
  if (typeof params == "function") {
    callback = params;
    params = {};
  }
  params.callback = nonce;
  var query = [];
  for (var k in params) {
    var v = params[k];
    query.push(k + "=" + v);
  }
  var script = document.createElement("script");
  window[nonce] = function(data) {
    document.body.removeChild(script);
    callback(data);
  }
  script.src = url + "?" + query.join("&");
  document.body.appendChild(script);
}

module.exports = jsonp;