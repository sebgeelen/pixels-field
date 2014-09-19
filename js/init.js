$(function() {

  var flashsPerGame = 2;


  // init stats listener
  var stats = pxStats.init({
    'container'           : '#field',
    'ui'                  : '#ui',
    'achievementsScreen'  : '#achievements',
    'achievementsDB'      : getADB()
  });
  // init user interface
  var ui = pxUi.init({
    'container'           : '#ui',
    'stats'               : stats,
    'flashsPerGame'       : flashsPerGame,
    'mainScreen'          : '#container',
    'achievementsScreen'  : '#achievements',
    'achievementsDB'      : getADB()

  });
  // init game field
  var field = pxField.init({
    'container'           : '#field',
    'flashAvailable'      : flashsPerGame
  });
});


// achiements data. might be put in a json file
/*
* X nbr of win / loose ( 3 to 5 of each type ) exponetials
* win after X nbr of moves (low and high)
* Win without using flash
* Win without bonus / Malus
* win With more than X bonus / malus / mix
* win / loose / played X game in X minutes
* reveal X % of the pixels on the fields
* reveal all the pixels on the fields
* win into the darkness
* surounded by wall at the spawn
*/
function getADB() {
  return {
    "beta_tester" : {
      "label" : "Tester",
      "descr" : "You've been part of the beta test of this awesome game.",
      "conditions" : true
    },
    "neewbie" : {
      "label" : "Neewbie",
      "descr" : "You have played 10 games.",
      "conditions" : "playedMoreThanGame(10)"
    },
    "senior" : {
      "label" : "Senior",
      "descr" : "You have played 100 games.",
      "conditions" : "playedMoreThanGame(100)"
    },
    "hardcore_gamer" : {
      "label" : "H4rdc0re Gam3rz",
      "descr" : "You have played 1000 games.",
      "conditions" : "playedMoreThanGame(1000)"
    },
    "looser" : {
      "label" : "Looser",
      "descr" : "You have lost 10 games.",
      "conditions" : "lostMoreThanGame(10)"
    },
    "senior_looser" : {
      "label" : "Mega looser",
      "descr" : "You have lost 50 games.",
      "conditions" : "lostMoreThanGame(100)"
    },
    "hardcore_looser" : {
      "label" : "Looser of the apocalipse",
      "descr" : "You have lost 200 games. But you did that on purpose didn't you?",
      "conditions" : "lostMoreThanGame(1000)"
    }
  };
}
