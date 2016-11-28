/**
 *  JQuery Idle Detection.
 *  jQuery plugin that detects when user went idle based on mouse movement, window focus and document.hasFocus()
 *  About: Author
 *  Bogdan Teodoru (me@bogdanteodoru.com).
 *  About: Version
 *  1.0.0
 **/

(function ($) {
  'use strict';
  
  var defaults = {
      idleCheckPeriod: 60000, // default idle time in ms
      windowCheckPeriod: 10000, // default check for windows focus
      trackEvents: 'mousemove mousedown keydown keypress keyup submit change mouseenter scroll resize touchstart', // events that will trigger the idle reset
      onIdle: $.noop(), // callback function to be executed after idle time
      onActive: $.noop(), // callback function to be executed after back from idleness
      onHide: $.noop(), // callback function to be executed when window is hidden
      onShow: $.noop(), // callback function to be executed when window is visible
      keepTracking: true, // false (tracking only first time)
      idleStatus: false // default idle status
  },
    
  options = {
    lastCheckedTrackId: null,
    windowCheckTimer: null,
    windowActiveStatus: false // default window status
  },
    
  api = {
      init: function(userOptions) {
          options = $.extend({}, defaults, options, userOptions);
  
          // fix for when calling the plugin multiple times thus attaching multiple events on the same
          // document / element
          _destroy(this);
  
          // start window focus tracking
          _windowFocusTimeout();
    
          return this.each(function() {
              options.lastCheckedTrackId = _timeout();
              $(this).on(options.trackEvents, function(event) {
                  options.lastCheckedTrackId = _timeoutReset();
              });
          });
      },
    
      destroy: function() {
        _destroy(this);
      }
  },
  
  _timeoutReset = function() {
      if (options.idleStatus) {
          options.onActive.call();
          options.idleStatus = false;
      }
    
      clearTimeout(options.lastCheckedTrackId);
    
      if (options.keepTracking) {
          return _timeout();
      }
  },
  
  _timeout = function() {
      var timer = (options.keepTracking ? setInterval : setTimeout), checkTimerId;
      checkTimerId = timer(function() {
          options.idleStatus = true;
          options.onIdle.call();
      }, options.idleCheckPeriod);
      return checkTimerId;
  },
    
  _windowFocusTimeout = function() {
      options.windowCheckTimer = setInterval(function(){
        _initWindowVisibilityTracking();
      }, options.windowActiveStatus);
  },
    
  _initWindowVisibilityTracking = function() {
      // if document has focus (this checks if the user loaded the page and has focus on the document)
      // rather than something else (any other element)
      if (document.hasFocus()) {
          _onWindowVisible();
      } else {
          _onWindowHidden();
      }
    
      // on visibility change
      $(document).on('visibilitychange webkitvisibilitychange mozvisibilitychange msvisibilitychange', function () {
          return (document.hidden || document.webkitHidden || document.mozHidden || document.msHidden) ?
            _onWindowHidden() : _onWindowVisible();
      });
    
      // when changed focus from window
      $(window)
        .on('blur', _onWindowHidden)
        .on('focus', _onWindowVisible);
  },
    
  _onWindowHidden = function() {
      if (options.onHide) options.onHide.call();
    
      if (options.windowActiveStatus) {
        options.windowActiveStatus = false;
      }
  },
    
  _onWindowVisible = function() {
      if (options.onShow) options.onShow.call();
      
      if (!options.windowActiveStatus) {
        options.windowActiveStatus = true;
      }
  
      options.lastCheckedTrackId = _timeoutReset();
  },
    
  _destroy = function(element) {
      $(element).off(options.trackEvents);
      $(window).off('visibilitychange webkitvisibilitychange mozvisibilitychange msvisibilitychange blur focus');
      options.keepTracking = true;
      clearTimeout(options.lastCheckedTrackId);
      clearTimeout(options.windowCheckTimer);
  },
    
  name = 'idleDetection';
  
  $.fn[name] = function (method) {
      if (api[method]) {
          return api[method].apply(this, Array.prototype.slice.call(arguments, 1));
      } else if (typeof method === 'object' || !method) {
          return api.init.apply(this, arguments);
      } else {
          $.error('Method ' + method + 'does not exist');
      }
  };
}(jQuery));
