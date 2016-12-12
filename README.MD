#jQuery IdleDetection

jQuery plugin that detects when user went idle based on mouse movement, window focus and document.hasFocus().

##Usage

Add jQuery and jQuery IdleDetection in your HTML or Javascript bundle. This is how you add it in the HTML.


```html
<script src="//ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>
<script type="text/javascript" src="jquery.idledetection.js"></script>
```

Call the idleDetection function on the element you want to track. Can be ```$(window)```, ```$(document)``` or any other jQuery element.

```js
$(document).idleDetection({
  onIdle: function() {
  	alert('User has become Idle, do something!')
  },
  onHide: function() {
  	alert('Window/tab is not active anymore, do something else')
  },
  onActive: function() {
    alert('User is active again. Hello user!')
  },
  onShow: function() {
  	alert('Window is active again. Hey there window ;)')
  },
  onStatusChange: function(isIdle) {
  	alert('User or window event has changed. The idle status is: ' + isIdle);
  	// isIdle = false means user is active
  	// isIdle = true means user is idle
  },
  idleCheckPeriod: 10000
});
```

Keep in mind that the ```onStatusChange``` function will be triggered when window/tab hide show events are triggered. This means that when a user will switch tabs, the ```onStatusChange``` will be called. If you want to use only the idle actions based on events ```mousemove mousedown keydown keypress keyup ...etc``` use only the ```onIdle``` and ```onActive``` callbacks or ```onHide``` and ```onShow``` for window/tab events.


##Options

```
idleCheckPeriod: 60000, // default idle time in ms
trackEvents: 'mousemove mousedown keydown keypress keyup submit change mouseenter scroll resize touchstart', // events that will trigger the idle reset
onIdle: $.noop(), // callback function to be executed after idle time
onActive: $.noop(), // callback function to be executed after back from idleness
onHide: $.noop(), // callback function to be executed when window is hidden
onShow: $.noop(), // callback function to be executed when window is visible
onStatusChange: $.noop(), // called when idleStatus has changed
keepTracking: true, // false (tracking only first time)
idleStatus: !document.hasFocus() // default idle status
```