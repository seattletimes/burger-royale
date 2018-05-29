// require("./lib/ads");
// var track = require("./lib/tracking");

require("component-responsive-frame/child");

var server = "https://script.google.com/macros/s/AKfycbzfbV5LQ9eH1dCzjLnYpNnEHcdfNgRvW7A01fsrRwmhGI52Oulo/exec";

var jsonp = require("./lib/jsonp");

jsonp(server, { vote: "Bent Burgers" }, function(data) {
  console.log(data);
});