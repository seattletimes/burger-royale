// require("./lib/ads");
// var track = require("./lib/tracking");

var $ = require("./lib/qsa");
var closest = require("./lib/closest");
var dot = require("./lib/dot");
var jsonp = require("./lib/jsonp");
var memory = require("./memory");
var scroll = require("./lib/animateScroll");

var versusTemplate = dot.compile(require("./_versus.html"));
var listTemplate = dot.compile(require("./_list.html"));

var server = "https://script.google.com/macros/s/AKfycbzfbV5LQ9eH1dCzjLnYpNnEHcdfNgRvW7A01fsrRwmhGI52Oulo/exec";

var roundLookup = {};
var candidateLookup = {};
candidateData.forEach(c => candidateLookup[c.name] = c);
bracketData.rounds.forEach(r => {
  roundLookup[r.id] = r;
  var history = memory.getVotes(r.id);
  r.active = r.id == bracketData.current;
  r.matchups.forEach((m, i) => {
    m.active = history[i] ? false : r.active;
    m.options.forEach(o => o.data = candidateLookup[o.name]);
  });
});

var state = {
  selectedRound: roundLookup[bracketData.current]
};

state.selectedMatchup = state.selectedRound.matchups[0];

var versusContainer = $.one(".selected-matchup");
var listContainer = $.one(".round-matchups");
var roundNav = $.one("nav.choose-round");
var fact = $.one(".burger-fact");

var updateRound = function() {
  var selected = roundNav.querySelector("input:checked").value;
  var round = state.selectedRound = roundLookup[selected];
  console.log(round);
  listContainer.innerHTML = listTemplate(round);
  fact.innerHTML = `<b>Burger fact</b>: ${round.fact} (<a href="${round.link}">${round.source}</a>)`;
  updateSelection();
};

var updateSelection = function(e) {
  var selected = listContainer.querySelector("input:checked");
  if (!selected) return versusContainer.innerHTML = "";
  state.selectedMatchup = state.selectedRound.matchups[selected.value];
  versusContainer.innerHTML = versusTemplate(state.selectedMatchup);
  if (e) scroll(versusContainer);
};

var submitVote = function(e) {
  switch (e.target.className) {
    case "vote":
      var buttons = $(".vote", versusContainer)
      buttons.forEach(b => b.disabled = true);
      var name = e.target.value;
      var index = e.target.getAttribute("data-index");
      jsonp(server, { vote: name }, function(data) {
        if (data.error) {
          buttons.forEach(b => b.disabled = false);
          return console.log(data.error);
        }
        e.target.classList.add("success");
        memory.setVote(bracketData.current, index);
      });
      break;

    case "show-more":
      closest(e.target, ".column").classList.add("expanded");
      break;
  }
};

listContainer.addEventListener("change", updateSelection);
roundNav.addEventListener("change", updateRound);

versusContainer.addEventListener("click", submitVote);

updateRound();