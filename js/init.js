$(function() {
  // init stats listener
  pxStats.init({
    'container' : '#field',
    'ui'        : '#ui'
  });
  // init user interface
  pxUi.init({
    'container' : '#ui'
  });
  // init game field
  pxField.init({
    'container' : '#field'
  });
});
