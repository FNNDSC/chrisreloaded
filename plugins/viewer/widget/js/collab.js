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

function Collab = {

	this.verson = 0.0;

}

// Collab.prototype.init = function(roomID){


// }

// Collab.prototype.connect = function(){


// }

// Collab.prototype.disconnet = function(){


// }

// Collab.prototype.sayHi = function(){

//   window.console.log('HI COLLAB');

// }

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

// _CHRIS_INTERACTIVE_PLUGIN_.togetherjsTestYO = function(threeD){
//   window.console.log('I am READY!');

//   // to be stopped when view closed
//   threeD.interactor.onTouchStart = threeD.interactor.onMouseDown = _CHRIS_INTERACTIVE_PLUGIN_.onTouchStart;
//   threeD.interactor.onTouchEnd = threeD.interactor.onMouseUp = _CHRIS_INTERACTIVE_PLUGIN_.onTouchEnd;
//  // ren3d.interactor.onMouseWheel = function(e) {
// //       setInterval(function(threeD){
// //         var myJsonString = JSON.stringify(threeD.camera.view);
// // TogetherJS.send({type: "viewChanged", view:myJsonString});
// // },1000,threeD);

//       TogetherJS.hub.on("viewChanged", function (msg) {
//         if (! msg.sameUrl) {
//           return;
//         }

//         window.console.log(msg);
//         var obj = JSON.parse(msg.view);
//         var arr = $.map(obj, function(el) { return el; });
//         threeD.camera.view = new Float32Array(arr);
//       });

//   //TogetherJS.send({type: "visibilityChange", isVisible: isVisible, element: element});
// //TogetherJS.hub.on("visibilityChange", function (msg) {
// //   var elementFinder = TogetherJS.require("elementFinder");
// //   // If the element can't be found this will throw an exception:
// //   var element = elementFinder.findElement(msg.element);
// //   MyApp.changeVisibility(element, msg.isVisible);
// // });
// }

// // _CHRIS_INTERACTIVE_PLUGIN_.RTpushCamera = function(renderer) {

// //   var _current_view = Array.apply([], eval(renderer).camera.view);

// //   if ( !arraysEqual(_current_view, RT._old_view) ) {

// //     RT._link.trigger('client-camera-sync', {
// //       'target' : renderer,
// //       'value' : _current_view
// //     });

// //     RT._old_view = _current_view;

// //   }

// // };