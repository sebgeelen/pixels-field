(function(context, namespace) {
  var options = {
    'container'      : null,
    'stats'          : null,
    'flashsPerGame' : 2,
    'messageBox'     : null
  };

  var _ui    = context[namespace],
      container, mainScreen, achievementsScreen;

  if (_ui) { // singleton
    return;
  }

  var cGameMoves   = 0,
      cGameFlashs = 0;

  // init the ui
  function init (opt) {

    if(opt !== undefined){
      jQuery.extend(options, opt);
    }

    container           = $(options.container);

    mainScreen          = $(options.mainScreen);
    achievementsScreen  = $(options.achievementsScreen);

    _initEventsListeners();
  }

  /* bind keys */
  function _initEventsListeners() {
    container.off('statsChanged').on('statsChanged', _updateAllDataBinded);
    container.find('.button').on('click', _buttonPressed);
    achievementsScreen.find('.button').on('click', _buttonPressed);
  }

  function _buttonPressed(e) {
    button = $(this);
    target = button.data("target");
    if(target) {
      console.log(target);
      eval(target);
    }
  }

  function _toggleAchievementsScreen() {
    mainScreen.toggleClass('current');
    achievementsScreen.toggleClass('current');
  }

  function _updateAllDataBinded() {
    container.find('.data-binded').each(_updateDataBinded);
  }

  function _updateDataBinded() {
    var obj           = $(this),
        dataDefault   = obj.data("default") || false,
        dataOperation = obj.data("operation") || '+',
        dataBinded    = obj.data("binded"),
        value         = options.stats.get(dataBinded);

    if (dataDefault) {
      if (dataOperation == '-') {
        value = options[dataDefault] - value;
      } else {
        value = options[dataDefault] + value;
      }
    }

    obj.text(value);
  }

  function displayBigMessage(message, type, delay) {
    messageBox = $(".message-box");

    messageBox.addClass('open').html(message);

    if(type !== undefined) {
      messageBox.addClass(type);
    } else {
      type = "";
    }
    if(delay === undefined) {
      delay = 1000;
    }

    window.setTimeout(function() {
      messageBox.addClass("fade");
      window.setTimeout(function() {
        messageBox.removeClass("open fade " + type);
      }, 1000);
    }, delay);

  }


  // define the public methods and vars
  var ui    = {};

  ui.init              = init;
  ui.displayMessage    = displayBigMessage;

  _ui                  = ui;
  context[namespace]   = _ui;

}(window, 'pxUi'));
