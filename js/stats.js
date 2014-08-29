(function(context, namespace) {
  var options = {
    "container"    : null,
    "ui"           : null,
    "gamesCount"   : 0,
    "movesCount"   : 0,
    "flashsCount" : 2,
    "GamesHistory" : {},
    "badges"       : {}
  };

  var _stats    = context[namespace],
      container, uiContainer;

  if (_stats) { // singleton
    return;
  }

  var cGameMoves   = 0,
      cGameFlashs = 0;

  // init the stats
  function init (opt) {

    if(opt !== undefined){
      jQuery.extend(options, opt);
    }

    container      = $(options.container);
    uiContainer    = $(options.ui);

    _initEventsListeners();
    _statsChanged();

    return this;
  }

  function _statsChanged() {
    uiContainer.trigger('statsChanged');
  }

  /* bind keys */
  function _initEventsListeners() {
    container.off('newGame').on('newGame', _newGame);
    container.off('newMove').on('newMove', _incrementMove);
    container.off('newFlash').on('newFlash', _incrementFlash);

    container.off('gameWon').on('gameWon', _gameWon);
    container.off('gameLost').on('gameLost', _gameLost);
  }

  function _newGame(e) {
    console.log(options);
    console.log('cGameFlashs : ' + cGameFlashs);
    console.log('cGameMoves : ' + cGameMoves);
    console.log('----------------------------');

    cGameMoves   = 0;
    cGameFlashs = 0;

    options.gamesCount ++;

    _statsChanged();
  }
  function _incrementMove(e) {
    cGameMoves ++;
    options.movesCount ++;

    _statsChanged();
  }
  function _incrementFlash(e) {
    cGameFlashs ++;
    options.flashsCount ++;

    _statsChanged();
  }

  function _gameWon(e) {
    _storeGameInHistory(true);
    _statsChanged();
  }
  function _gameLost(e) {
    _storeGameInHistory(false);
    _statsChanged();
  }

  function _storeGameInHistory(isVictory) {
    var time = new Date().getTime();
    options.GamesHistory[time] = {
      "movesCount"   : cGameMoves,
      "flashsCount" : cGameFlashs,
      "victory"      : isVictory
    };
  }

  // define the public methods and vars
  function get(data) {
    return eval(data);
  }


  var stats     = {};

  stats.init    = init;
  stats.get     = get;

  _stats                  = stats;
  context[namespace]      = _stats;

}(window, 'pxStats'));
