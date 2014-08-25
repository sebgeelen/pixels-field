(function(context, namespace) {
  var options = {
    "container"    : null
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
    var obj        = $(this),
        dataBinded = obj.data("binded"),
        value      = pxStats.get(dataBinded);

    obj.text(value);
  }


  // define the public methods and vars
  var ui    = {};

  ui.init   = init;

  _ui                  = ui;
  context[namespace]   = _ui;

}(window, 'pxUi'));
