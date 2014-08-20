(function(context, namespace) {
  var options = {
    "container" : null,
    "col"       : 9,
    "row"       : 40,
    "start"     : "5:5",
    "end"       : "5:35"
  };

  var _field    = context[namespace],
      container;

  if (_field) { // singleton
    return;
  }

  // init the field
  function init (opt) {

    if(opt !== undefined){
      jQuery.extend(options, opt);
    }

    container = $(options.container);

    _initFieldPixels();
  }

  function _initFieldPixels() {
    console.log(container);
    var currentRow, currentCol;
    for (var i = 0; i < options.row; i++) {
      currentRow = $('<div class="row" id="row' + i + '"></div>');
      container.prepend(currentRow);

      for (var j = 0; j < options.col; j++) {
        currentCol = $('<div class="px" id="px' + i + ':' + j + '"></div>');
        currentRow.append(currentCol);
      }
    }
  }


  // define the public methods and vars
  var field        = {};
      field.init   = init;

  _field                  = field;
  context[namespace]      = _field;

}(window, 'pxField'));
