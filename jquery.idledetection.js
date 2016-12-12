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

	if (!(typeof document.hasFocus === "function")){
		document.hasFocus = function() {
			return false;
		}
	}

	var defaults = {
			idleCheckPeriod: 60000, // default idle time in ms
			trackEvents: 'mousemove mousedown keydown keypress keyup submit change mouseenter scroll resize touchstart', // events that will trigger the idle reset
			onIdle: $.noop(), // callback function to be executed after idle time
			onActive: $.noop(), // callback function to be executed after back from idleness
			onHide: $.noop(), // callback function to be executed when window is hidden
			onShow: $.noop(), // callback function to be executed when window is visible
			onStatusChange: $.noop(), // called when idleStatus has changed
			keepTracking: true, // false (tracking only first time)
			idleStatus: !document.hasFocus() // default idle status
		},

		options = {
			lastCheckedTrackId: null
		},

		api = {
			init: function(userOptions) {
				options = $.extend({}, defaults, options, userOptions);

				// fix for when calling the plugin multiple times thus attaching multiple events on the same
				// document / element
				_destroy(this);

				// start window focus tracking
				_initWindowVisibilityTracking();

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
				_onStatusChange(false);
			}

			clearTimeout(options.lastCheckedTrackId);

			if (options.keepTracking) {
				return _timeout();
			}
		},

		_timeout = function() {
			var timer = (options.keepTracking ? setInterval : setTimeout), checkTimerId;
			checkTimerId = timer(function() {
				_onStatusChange(true);
				options.onIdle.call();
			}, options.idleCheckPeriod);
			return checkTimerId;
		},

		_initWindowVisibilityTracking = function() {
			// on visibility change
			$(document).on('visibilitychange webkitvisibilitychange mozvisibilitychange msvisibilitychange', function () {
				return (document.hidden || document.webkitHidden || document.mozHidden || document.msHidden) ?
					_onWindowHidden() : _onWindowVisible();
			});
		},

		_onWindowHidden = function() {
			if (options.onHide) options.onHide.call();
			_onStatusChange(true);
		},

		_onWindowVisible = function() {
			if (options.onShow) options.onShow.call();

			_onStatusChange(false);
			options.lastCheckedTrackId = _timeoutReset();
		},

		_onStatusChange = function(status) {
			if (options.onStatusChange) {
				// true means user is idle, false means user is active
				if (status !== options.idleStatus) {
					options.idleStatus = status;
					options.onStatusChange.call(null, status);
				}
			} else {
				options.idleStatus = status;
			}
		},

		_destroy = function(element) {
			$(element).off(options.trackEvents);
			options.keepTracking = true;
			clearTimeout(options.lastCheckedTrackId);
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
