$(function() {

  var flashsPerGame = 2;


  // init stats listener
  var stats = pxStats.init({
    'container'           : '#field',
    'ui'                  : '#ui'
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
