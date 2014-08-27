(function(context, namespace) {
  var options = {
    'container'      : null,
    'stats'          : null,
    'matchesPerGame' : 2
  };

  var _ui    = context[namespace],
      container;

  if (_ui) { // singleton
    return;
  }

  var cGameMoves   = 0,
      cGameMatches = 0;

  // init the ui
  function init (opt) {

    if(opt !== undefined){
      jQuery.extend(options, opt);
    }

    container      = $(options.container);
    uiContainer    = $(options.ui);

    _initEventsListeners();
  }

  /* bind keys */
  function _initEventsListeners() {
    container.off('statsChanged').on('statsChanged', _updateAllDataBinded);
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


  // define the public methods and vars
  var ui    = {};

  ui.init   = init;

  _ui                  = ui;
  context[namespace]   = _ui;

}(window, 'pxUi'));
