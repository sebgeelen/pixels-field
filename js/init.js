$(function() {

  var flashsPerGame = 2;


  // init stats listener
  var stats = pxStats.init({
    'container'           : '#field',
    'ui'                  : '#ui',
    'achievementsDB'      : getADB()
  });
  // init user interface
  var ui = pxUi.init({
    'container'           : '#ui',
    'stats'               : stats,
    'flashsPerGame'       : flashsPerGame,
    'mainScreen'          : '#container',
    'achievementsScreen'  : '#achievements'

  });
  // init game field
  var field = pxField.init({
    'container'           : '#field',
    'flashAvailable'      : flashsPerGame
  });
});

function getADB() {
  return {
    "beta_tester" : {
      "label" : "Tester",
      "descr" : "You've been part of the beta test of this awesome game.",
      "conditions" : [
        {
          "value"     : "1",
          "operation" : "===",
          "reference" : "1"
        }
      ]
    },
    "neewbie" : {
      "label" : "Neewbie",
      "descr" : "You played 10 games.",
      "conditions" : [
        {
          "value"     : "Object.keys(gamesHistory).length",
          "operation" : ">=",
          "reference" : "10"
        }
      ]
    }
  };
}
