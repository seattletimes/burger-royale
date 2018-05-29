// require("./lib/ads");
// var track = require("./lib/tracking");

var $ = require("./lib/qsa");
var jsonp = require("./lib/jsonp");
var dot = require("./lib/dot");

var versusTemplate = dot.compile(require("./_versus.html"));
var listTemplate = dot.compile(require("./_list.html"));

var server = "https://script.google.com/macros/s/AKfycbzfbV5LQ9eH1dCzjLnYpNnEHcdfNgRvW7A01fsrRwmhGI52Oulo/exec";

var roundLookup = {};
bracketData.rounds.forEach(r => roundLookup[r.id] = r);

var state = {
  selectedRound: roundLookup[bracketData.current]
};

state.selectedMatchup = state.selectedRound.matchups[0];

var versusContainer = $.one(".selected-matchup");
var listContainer = $.one(".round-matchups");
var roundNav = $.one("nav.choose-round");

var updateRound = function() {
  var selected = roundNav.querySelector("input:checked").value;
  state.selectedRound = roundLookup[selected];
  listContainer.innerHTML = listTemplate(state.selectedRound);
  updateSelection();
}

var updateSelection = function() {
  var selected = listContainer.querySelector("input:checked");
  if (!selected) return;
  state.selectedMatchup = state.selectedRound.matchups[selected.value];
  versusContainer.innerHTML = versusTemplate(state.selectedMatchup);
}


listContainer.addEventListener("change", updateSelection);
roundNav.addEventListener("change", updateRound);

updateRound();

// jsonp(server, { vote: "Bent Burgers" }, function(data) {
//   console.log(data);
// });