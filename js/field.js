(function(context, namespace) {
  var options = {
    "container" : null,
    "col"       : 9,
    "row"       : 40,
    "start"     : "4:4",
    "end"       : "4:35",
    "matchAvailable" : 2
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
    _initKeyBinding();
  }
  function _reset() {
    container.empty();
    init(options);
  }
  /* init the board pixels map */
  function _initFieldPixels() {
    var currentRow, currentPx, x, y;
    for (y = 0; y < options.row; y++) {
      currentRow = $('<div class="row" id="row' + y + '"></div>');
      container.prepend(currentRow);

      for (x = 0; x < options.col; x++) {
        currentPx = $('<div id="px' + x + '_' + y + '"></div>');
        currentPx.addClass('px');
        currentPx.data('x', x);
        currentPx.data('y', y);

        if(options.start === (x + ':' + y) ) {
          currentPx.addClass('px-start cpx');
        } else if (options.end === (x + ':' + y) ) {
          currentPx.addClass('px-end');
        } else {
          _decideTypeOfPx(currentPx);
        }

        currentRow.append(currentPx);
      }
    }
  }
  /* randomly decide the type of pixel
   * 0 : default
   * 1 : wall  10/50
   * 2 : bonus 1/50
   * 3 : malus 1/50
   */
  function _decideTypeOfPx(px) {
    var rand = Math.floor( Math.random() * 1001); // 0 <> 1000
    if (rand < 20) {
      px.data('type', 2);
      px.addClass('bonus');
    } else if (rand < 40) {
      px.data('type', 3);
      px.addClass('malus');
    } else if (rand < 240) {
      px.data('type', 1);
      px.addClass('wall');
    } else {
      px.data('type', 0);
    }
  }
  function _checkTypeOfPx(px) {
    var type = px.data('type');

    switch(type) {
      case 2:
        _lightAMatch(5);
        break;
      case 3:
        _matchFireOut();
        break;
      default:
        _lightAMatch(1);
        break;
    }
  }
  /* bind keys */
  function _initKeyBinding() {
    $(document).off('keypress').on('keypress', _keyPress);
  }
  function _keyPress(e) {
    switch(e.key.toLowerCase()) {
      case "up":
        e.preventDefault();
        _move(0, 1);
        break;
      case "down":
        e.preventDefault();
        _move(0, -1);
        break;

      case "right":
        e.preventDefault();
        _move(1, 0);
        break;
      case "left":
        e.preventDefault();
        _move(-1, 0);
        break;
      case "l": // light a match
        e.preventDefault();
        if(options.matchAvailable > 0) {
          options.matchAvailable --;
          _lightAMatch(6);
        }
        break;
      default:
        console.log(e);
        break;
    }
  }
  /* light a match to reveal the nearvy pixels */
  function _lightAMatch(range) {
    var currentPx = container.find('.cpx'),
        currentX  = currentPx.data('x'),
        currentY  = currentPx.data('y'),
        targetPx, targetX, targetY, x, y;
    console.log("light on");
    for (y = (range * -1); y <= range; y++) {
      for (x = (range * -1); x <= range; x++) {
        if( Math.abs(x) + Math.abs(y) > range + 1) {
          continue;
        }

        targetX  = x + currentX;
        targetY  = y + currentY;
        targetPx = container.find('#px' + targetX + '_' + targetY);
        targetPx.addClass('highlighted');
      }
    }

    //setTimeout(_matchFireOut, 5000);
  }
  function _matchFireOut() {
    console.log("light off");
    container.find('.highlighted').removeClass('highlighted');
  }

  /* move the curent pixels on x and y axis */
  function _move(x, y) {
    var currentPx = container.find('.cpx'),
        currentX  = currentPx.data('x'),
        currentY  = currentPx.data('y'),
        targetX   = currentX + x,
        targetY   = currentY + y,
        targetPx  = container.find('#px' + targetX + '_' + targetY);

    if(targetPx.length > 0) {
      if(targetPx.data("type") === 1) {
        // wall
        targetPx.addClass("visited");
      } else {
        currentPx.removeClass('cpx').addClass('visited');
        targetPx.addClass('cpx');
        _checkTypeOfPx(targetPx);
        _checkIfPxIsEnd(targetPx);
      }
    }
  }
  /* test if the coordiante are the end of the game */
  function _checkIfPxIsEnd(px) {
    var isEndPx  = px.hasClass('px-end');

    if (isEndPx) {
      alert("Congrats, you won this game.");
      _reset();
    }
  }


  // define the public methods and vars
  var field        = {};
      field.init   = init;

  _field                  = field;
  context[namespace]      = _field;

}(window, 'pxField'));
