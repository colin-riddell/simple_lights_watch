import { me } from "companion";
import * as messaging from "messaging";
import { settingsStorage } from "settings";
import {isAuthed, detectHueHubIP, getToken, authenticate} from "./authentication.js";
import { getAllLights, changeLightState } from "./lightsAPI.js";

function sendLightsData(lights){
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send(JSON.stringify({command: "renderLights", payload: lights}));
  }
}


settingsStorage.onchange = function(evt) {
  console.log("Settings were changed event!");
  // getFromApiAndRespond();
}


// Listen for the onopen event
messaging.peerSocket.onopen = function() {
  detectHueHubIP();

  if (!isAuthed()){
    // send message to show authenticate screen - handle authenticate event
    if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
      console.log("asking for auth!!!")
      messaging.peerSocket.send(JSON.stringify({command: "askForAuth"}));
    }
  } else {
    console.log("authed");
    getAllLights(sendLightsData);
  }
}

// // Listen for the onmessage event
messaging.peerSocket.onmessage = function(evt) {

  const message = JSON.parse(evt.data);
  switch(message.command){
    case "askForAuthResponse":
      authenticate(function(){
        JSON.stringify({command: "authenticated"})
        getAllLights(sendLightsData);
        // sendLightsData(lights)
      })
      break;
    case "getRocketData":
      getFromApiAndRespond();
      break;
    case "lightCommand":
      //{"command":"lightCommand","payload":{"name":"Jo and Col Boudoir","state":true}}
      console.log(JSON.stringify(message.payload))
      changeLightState(message.payload)
      // console.log("GOT LIGHT COMMAND")
    default:
      break;
  }

  
}


function getFromApiAndRespond() {
  
   fetch("https://api.spacexdata.com/v3/launches/1")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
        messaging.peerSocket.send(JSON.stringify(data.rocket));
      // sendData(data[0])
    });
  
}


