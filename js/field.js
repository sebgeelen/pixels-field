(function(context, namespace) {
  var options = {
    "container"         : null,
    "col"               : 9,
    "row"               : 40,
    "start"             : "4:4",
    "end"               : "4:35",
    "matchAvailable"    : 2,
    "torchRange"        : 1
  };

  var _field    = context[namespace],
      container;

  if (_field) { // singleton
    return;
  }

  var matchAvailable, torchRange;

  // init the field
  function init (opt) {

    if(opt !== undefined){
      jQuery.extend(options, opt);
    }

    container      = $(options.container);
    torchRange     = options.torchRange;
    matchAvailable = options.matchAvailable;

    _initFieldPixels();
    _initKeyBinding();

    container.trigger('newGame');
  }
  function _reset(won) {
    if (won) {
      container.trigger('gameWon');
    } else{
      container.trigger('gameLost');
    }

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
    _buildWall();
    // light around the start
    _lightAMatch(1);
    // light around the end
    _lightAMatch(2, container.find('.px-end'));

  }
  /* randomly decide the type of pixel */
  function _buildWall() {
    var x, y, randX, randY, currentPx;

    for (var i = 0; i < 20; i++) { // build x walls
      x = Math.floor( Math.random() * (options.col));
      y = Math.floor( Math.random() * (options.row));
      while (1) { // break manulay when meet an incompatible px
        currentPx = container.find('#px' + x + '_' + y);
        if(currentPx.length === 0 || currentPx.hasClass('wall') || currentPx.data('type') !== 0) {
          break;
        }
        currentPx.addClass('wall');

        if(Math.random() > 0.6 || randX === undefined) { // direction don't always change
          randX = Math.floor( Math.random() * 3) - 1; // between -1 and 1
          randY = Math.floor( Math.random() * 3) - 1;
        }
        x += randX;
        y += randY;
      }
    }
  }
  /* randomly decide the type of pixel
   * 0 : default
   * 1 : unused for now
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
    } else {
      px.data('type', 0);
    }
  }
  function _checkTypeOfPx(px) {
    var type = px.data('type');

    switch(type) {
      case 2:
        _applyBonus(px);
        break;
      case 3:
        _applyMalus(px);
        break;
      default:
        _lightAMatch(torchRange);
        break;
    }
  }

  function _applyBonus(px) {
    var r = Math.random();
    if(r > 0.4) {
      _lightAMatch(torchRange + 2);
    } else if(r > 0.2) {
      _lightAMatch(torchRange + 4);
    } else {
      torchRange ++;
      _lightAMatch(torchRange);
    }
    px.data('type', 0).data("oldType", 2);
  }

  function _applyMalus(px) {
    var r = Math.random();
    if(r > 0.2) {
      _matchFireOut();
    } else {
      // karma is a bitch
      _matchFireOut();
      _removeVisited();
      torchRange --;
    }

    if(torchRange < 0) {
      //prevent range to become negative
      torchRange = 0;
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
      case " ":
        _reset();
        break;
      case "l": // light a match
        e.preventDefault();
        if(matchAvailable > 0) {
          matchAvailable --;
          _lightAMatch(6);
          container.trigger('newMatch');
        }
        break;
      case "g": // god light used for debug
        e.preventDefault();
        //_lightAMatch(50);
        break;
      default:
        console.log(e);
        break;
    }
  }
  /* light a match to reveal the nearvy pixels */
  function _lightAMatch(range, currentPx) {
    if(currentPx === undefined) {
      currentPx = container.find('.cpx');
    }
    var currentX  = currentPx.data('x'),
        currentY  = currentPx.data('y'),
        targetPx, targetX, targetY, x, y;

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
    container.find('.highlighted').removeClass('highlighted');
    // keep light around the end
    _lightAMatch(2, container.find('.px-end'));
  }

  function _removeVisited() {
    container.find('.visited').removeClass('visited');
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
      container.trigger('newMove');

      if(targetPx.hasClass("wall")) {
        // don't move ibto wall wall
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
      _reset(true);
    }
  }


  // define the public methods and vars
  var field        = {};
      field.init   = init;

  _field                  = field;
  context[namespace]      = _field;

}(window, 'pxField'));
