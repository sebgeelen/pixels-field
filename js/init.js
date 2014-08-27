$(function() {

  var matchesPerGame = 2;


  // init stats listener
  var stats = pxStats.init({
    'container'       : '#field',
    'ui'              : '#ui'
  });
  // init user interface
  var ui = pxUi.init({
    'container'       : '#ui',
    'stats'           : stats,
    'matchesPerGame'  : matchesPerGame
  });
  // init game field
  var field = pxField.init({
    'container'       : '#field',
    'matchAvailable'  : matchesPerGame
  });
});
