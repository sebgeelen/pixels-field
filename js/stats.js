(function(context, namespace) {
  var options = {
    "container"    : null,
    "gamesCount"   : 0,
    "movesCount"   : 0,
    "matchesCount" : 2,
    "GamesHistory" : {},
    "badges"       : {}
  };

  var _stats    = context[namespace],
      container;

  if (_stats) { // singleton
    return;
  }

  var cGameMoves   = 0,
      cGameMatches = 0;

  // init the stats
  function init (opt) {

    if(opt !== undefined){
      jQuery.extend(options, opt);
    }

    container      = $(options.container);

    _initEventsListeners();
  }

  /* bind keys */
  function _initEventsListeners() {
    container.off('newGame').on('newGame', _newGame);
    container.off('newMove').on('newMove', _incrementMove);
    container.off('newMatch').on('newMatch', _incrementMatch);

    container.off('gameWon').on('gameWon', _gameWon);
    container.off('gameLost').on('gameLost', _gameLost);
  }

  function _newGame(e) {
    console.log(options);
    console.log('cGameMatches : ' + cGameMatches);
    console.log('cGameMoves : ' + cGameMoves);
    console.log('----------------------------');

    cGameMoves   = 0;
    cGameMatches = 0;

    options.gamesCount ++;
  }
  function _incrementMove(e) {
    cGameMoves ++;
    options.movesCount ++;
  }
  function _incrementMatch(e) {
    console.log('m++');
    cGameMatches ++;
    options.matchesCount ++;
  }

  function _gameWon(e) {
    _storeGameInHistory(true);
  }
  function _gameLost(e) {
    _storeGameInHistory(false);
  }
  function _storeGameInHistory(won) {
    var time = new Date().getTime();
    options.GamesHistory[time] = {
      "movesCount"   : cGameMoves,
      "matchesCount" : cGameMatches,
      "victory"      : won
    };
  }


  // define the public methods and vars
  var stats        = {};
      stats.init   = init;

  _stats                  = stats;
  context[namespace]      = _stats;

}(window, 'pxStats'));
