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
  this.setButtonContent();
}

collab.Collab.prototype.setButtonContent = function(){
  var jButton = jQuery('.collaborate-btn > button');

  if(jButton.hasClass('collaborating')){
    jButton.addClass('collaborating');
    jButton.html('<i class="fa fa-sign-out"></i> Stop collaboration');
  }
  else{
    jButton.html('<i class="fa fa-sign-in"></i> Start collaboration');
  }
}

collab.Collab.prototype.init = function(){
  // connect callbacks
  var self = this;

  // additional togetherjs configuration
	TogetherJSConfig_findRoom =  "chris" + this.roomID;
  TogetherJSConfig_on = {
        ready: function(){
						self.id = TogetherJS.require('peers').Self.id;
						// togetherJS div style
        	  self.style();
            // togetherJS button style
            self.updateButton();
						TogetherJS.checkForUsersOnChannel('https://hub.togetherjs.com/hub/chris' + self.roomID, function(n){
							window.console.log('collabReady sent');
							// emit ready event
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
	var peers = TogetherJS.require('peers').getAllPeers();

	for (var i = 0; i < peers.length; i++) {
		if (peers[i].status != "bye") {
			window.console.log('Other is the owner!!!');
			return peers[i].id;
		}
	}
	window.console.log('I am the owner!!!');
	return this.id;
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
