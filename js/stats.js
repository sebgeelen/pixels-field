(function(context, namespace) {
  var options = {
    "container"       : null,
    "ui"              : null,
    "gamesCount"      : 0,
    "movesCount"      : 0,
    "flashsCount"     : 2,
    "badges"          : {},
    "achievementsDB"  : {}
  };

  var _stats    = context[namespace],
      container, uiContainer, gamesHistory, achievements, achievementsScreen;

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

    container           = $(options.container);
    uiContainer         = $(options.ui);
    achievementsScreen  = $(options.achievementsScreen);

    _initLocalStorageData();

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
    gamesHistory[time] = {
      "movesCount"   : cGameMoves,
      "flashsCount"  : cGameFlashs,
      "victory"      : isVictory
    };

    _calculAchievements();
    _saveCurrentData();
  }
  function _initLocalStorageData() {

    gamesHistory = JSON.parse(localStorage.getItem("pxf_gamesHistory"));
    if (typeof gamesHistory !== "object" || gamesHistory === null) {
      gamesHistory = {};
    }

    achievements = JSON.parse(localStorage.getItem("pxf_achievementss"));
    if (typeof achievements !== "object" || achievements === null) {
      achievements = {};
    }
  }

  function _saveCurrentData() {
    // add a  onBeforeUnload event save this
    // to reduce cheat
    localStorage.setItem("pxf_gamesHistory", JSON.stringify(gamesHistory));
    localStorage.setItem("pxf_achievementss", JSON.stringify(achievements));
  }

  function _calculAchievements() {
    for (var slug in options.achievementsDB) {
      var achievementData   = options.achievementsDB[slug],
          achievementGet    = true,
          conditions;

      if(typeof achievementData.conditions === "string") {
        conditions = [achievementData.conditions];
      } else {
        conditions = achievementData.conditions;
      }

      while ( conditions.length > 0 ) {
        var condition    = conditions.pop();
        if(!eval(condition)) {
          achievementGet = false;
          break;
        }
      }

      if(achievementGet) {
        achievementsScreen.find("#a_" + slug).addClass('unlock');
        console.log(slug + ' achievement unlock. ');
      }
    }
  }

  // achievements method
  function playedMoreThanGame(x) {
    return Object.keys(gamesHistory).length >= x;
  }

  function lostMoreThanGame(x) {
    var lostCount = 0;
    for(var i in gamesHistory) {
      if(!gamesHistory[i].victory) {
        lostCount++;
      }
    }
    return lostCount >= x;
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
