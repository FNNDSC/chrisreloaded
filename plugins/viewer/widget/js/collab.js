/**
 * This object takes care of all the communication between the collaborators:
 *
 * FEATURES
 * - Start/End an interactive session
 * - Send events
 * - Receive events
 *
 * TECHNOLOGY
 * - TogetherJS
 */

// TOGETHERJS CONFIGURATION
TogetherJSConfig_suppressJoinConfirmation = true;
TogetherJSConfig_suppressInvite = true;
TogetherJSConfig_dontShowClicks = true;
TogetherJSConfig_noAutoStart = true;

// Declare (or re-declare) the single global variable
var collab = collab || {};

collab.Collab = function(roomID) {

	this.version = 0.0;
	this.roomID = roomID;
	this.id = '';
	this.init();

}

collab.Collab.prototype.updateButton = function(){
    // apply style
    var jButton = jQuery('.collaborate-btn > button');

    if(jButton.hasClass('collaborating')){

        jButton.removeClass('collaborating');

    }
    else{

        jButton.addClass('collaborating');

    }

    // set content
    // false because TogetherJS is still true but we want to change style/content
    this.setButtonContent(false);
}

collab.Collab.prototype.setButtonContent = function(force){

    var test = typeof force !== 'undefined' ? force : (typeof(TogetherJS) != 'undefined' && TogetherJS != null && TogetherJS.running);

    var jButton = jQuery('.collaborate-btn > button');

    if(jButton.hasClass('collaborating') ||  test){

      // if togetherjs running
         if(test){
            jButton.addClass('collaborating');
         }

         jButton.html('<i class="fa fa-sign-out"></i> Stop collaboration');

    }
    else{

        jButton.html('<i class="fa fa-sign-in"></i> Start collaboration');

    }

}

collab.Collab.prototype.init = function(){

  //style button with appropriate content
  this.setButtonContent();
  // connect callbacks
  var self = this;

  // additional togetherjs configuration
	TogetherJSConfig_findRoom =  "chris" + this.roomID;
  TogetherJSConfig_on = {
        ready: function(){
						self.id = TogetherJS.require('peers').Self.id;
        	  self.style();
            // for is running (reload page with open collab)
            self.setButtonContent();
						window.console.log('collabReady sent');
						// emit ready event
						TogetherJS.checkForUsersOnChannel('https://hub.togetherjs.com/hub/chris' + self.roomID, function(n){
							var ev = document.createEvent('Event');
							ev.initEvent('CollaboratorReady', true, true);
							window.dispatchEvent(ev);
							window.console.log('Users on chanel!!!: ', n)
						});
        },
        close:function(){
            // clean up callbacks
            // required if not next time we will have 2 ready & close callbacks
            TogetherJS._listeners = {};
            // cleanup room ID
            // required, if not tries to go to previous room
            self.updateButton();
            var store = TogetherJS.require('storage');
            store.tab.set('status').then(function(saved){saved = null;});
        }
    };
}

collab.Collab.prototype.style = function(){

    $('#togetherjs-dock').css('background-color', '#353535');
    $('.togetherjs .togetherjs-window > header').css('background-color', '#353535');

}

// register action name with a handler callback
collab.Collab.prototype.register = function(actionName, callback){
  TogetherJS.hub.on(actionName, function (msg) {
	  if (! msg.sameUrl) {
		 	return;
	  }
	  callback(msg);
  });
}

// send action name and associated data object
collab.Collab.prototype.send = function(actionName, dataObj){
	if(typeof(TogetherJS) != 'undefined' && TogetherJS != null){
		if(TogetherJS.running){
      var myJsonString = JSON.stringify(dataObj);
			TogetherJS.send({type: actionName, data: myJsonString});
    }
  }
}


collab.Collab.prototype.getRoomOwnerId = function(){
	var peers = TogetherJS.require('peers').getAllPeers('live');

	if (peers.length) {
			window.console.log('Other is the owner!!!');
			return peers[0].id;
	} else {
			window.console.log('I am the owner!!!');
			return this.id;
	}
}


collab.Collab.prototype.disconnet = function(){

    window.console.log('disconnect events');

}

collab.Collab.prototype.destroy = function(){

	if(typeof(TogetherJS) != 'undefined' && TogetherJS != null){
		if(TogetherJS.running){
         TogetherJS();
		}
	}
}

// _CHRIS_INTERACTIVE_PLUGIN_.togetherjsYO = function(feedID, threeD){

//   TogetherJSConfig_findRoom =  "chris" + feedID;

// window.console.log(TogetherJSConfig_findRoom);

//   TogetherJSConfig_on = {
//     ready: function(){_CHRIS_INTERACTIVE_PLUGIN_.togetherjsTestYO(threeD);}
//   };
// }

// _CHRIS_INTERACTIVE_PLUGIN_.onTouchStart = function(){
//   window.console.log('Touch Start');

//   _CHRIS_INTERACTIVE_PLUGIN_._updater = setInterval(function(){
//                 var myJsonString = JSON.stringify(threeD.camera.view);
//                 TogetherJS.send({type: "viewChanged", view:myJsonString});
//               }
//               , 150);
// }

// _CHRIS_INTERACTIVE_PLUGIN_.onTouchEnd = function(){

//   window.console.log('TouchEnd');
//   clearInterval(_CHRIS_INTERACTIVE_PLUGIN_._updater);

// }

/*_CHRIS_INTERACTIVE_PLUGIN_.togetherjsTestYO = function(threeD){
  window.console.log('I am READY!');

  // to be stopped when view closed
  threeD.interactor.onTouchStart = threeD.interactor.onMouseDown = _CHRIS_INTERACTIVE_PLUGIN_.onTouchStart;
  threeD.interactor.onTouchEnd = threeD.interactor.onMouseUp = _CHRIS_INTERACTIVE_PLUGIN_.onTouchEnd;
 // ren3d.interactor.onMouseWheel = function(e) {
//       setInterval(function(threeD){
//         var myJsonString = JSON.stringify(threeD.camera.view);
// TogetherJS.send({type: "viewChanged", view:myJsonString});
// },1000,threeD);

      TogetherJS.hub.on("viewChanged", function (msg) {
        if (! msg.sameUrl) {
          return;
        }

        var obj = JSON.parse(msg.view);
        var arr = $.map(obj, function(el) { return el; });
        threeD.camera.view = new Float32Array(arr);
      });

  //TogetherJS.send({type: "visibilityChange", isVisible: isVisible, element: element});
//TogetherJS.hub.on("visibilityChange", function (msg) {
//   var elementFinder = TogetherJS.require("elementFinder");
//   // If the element can't be found this will throw an exception:
//   var element = elementFinder.findElement(msg.element);
//   MyApp.changeVisibility(element, msg.isVisible);
// });
}*/

// _CHRIS_INTERACTIVE_PLUGIN_.RTpushCamera = function(renderer) {

//   var _current_view = Array.apply([], eval(renderer).camera.view);

//   if ( !arraysEqual(_current_view, RT._old_view) ) {

//     RT._link.trigger('client-camera-sync', {
//       'target' : renderer,
//       'value' : _current_view
//     });

//     RT._old_view = _current_view;

//   }

// };
