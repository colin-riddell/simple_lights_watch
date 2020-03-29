import clock from "clock";
import messaging from "messaging";
import document from "document";
import { Application } from './view'
import { Screen1 } from './screen1'
import { Screen2 } from './screen2'


class MultiScreenApp extends Application {
  // List all screens
  screens = { Screen1, Screen2 }



  constructor(){
    // Listen for the onopen event
    messaging.peerSocket.onopen = function() {      
      console.log("on open triggered")
    }

    // // Listen for the onmessage event
    messaging.peerSocket.onmessage = function(evt) {
      let message = JSON.parse(evt.data);
      switch(message.command){
        case  "askForAuth":
         // show the ask for auth screen which should send an "askForAuthResponse" when pressed
          console.log("ASKED FOR AUTH");
          Application.switchTo('Screen2');
          break;
        case "renderLights":
          console.log("asked to render lights")
          console.log(JSON.stringify(message.payload));
          Application.switchTo('Screen1', message.payload );

      }
    }

    // Listen for the onerror event
    messaging.peerSocket.onerror = function(err) {
      // Handle any errors
      console.log("errors!!!")
    }
  }
}

MultiScreenApp.start( 'Screen1' );



