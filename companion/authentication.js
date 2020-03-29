
import { localStorage } from "local-storage";


function isAuthed(){
  const token = localStorage.getItem("authToken");
  console.log("found stored token: ", token);
  if (token === "" || token == undefined || token == null){
    return false;
  }
  return true;
}

function getToken(){
  const token = localStorage.getItem("authToken");
  return token;
}

function detectHueHubIP(){
  console.log("detecting hub IP")
  fetch("https://discovery.meethue.com/")
    .then((response) => {
      
      return response.json();
    })
    .then((data) => {
        localStorage.setItem("hueHubIP", data[0].internalipaddress);
    });
}
  
  // need to press button on hub first
function authenticate(callback, onFail){
  console.log("AUTHENTICATING...")

  const ip  = localStorage.getItem("hueHubIP");
  const body = {devicetype: "my_hue_app#watch"}
  
  const url = `http://${ip}/api`;
  console.log(url);


  fetch(url, {
    method: 'POST',
    headers:{'Content-Type': 'application/json'},
    body: JSON.stringify(body)
  })
  .then((response) => {
    console.log("called auth api")
    return response.json();
  })
  .then((data) => {
    console.log("response from auth api")
    console.log(data);
    if ('success' in data[0]){
      console.log("SUCCESS: watch found hue")
      console.log(data[0].success.username);
      localStorage.setItem("authToken",data[0].success.username )
      callback();
    } else if ('error' in data[0]){
      console.log("FAIL: watch didn't find hue - did you press pair?")
      onFail();
    }

    //console.log(data[0][0].success.username);
    /* example response SUCCESS
    [
      {
        "success": {
          "username": "uUPZBgUXFS5mndpnAsuL11RdRaacfyfareCg08U4"
        }
      }
    ]
    FAIL:
    [
      {
        error: { address: '', description: 'link button not pressed', type: 101 }
      }
    ] 
    */

    }).catch(error => {
      console.log("caught error");
      console.log(error)
    });
  
  
  
}

export {isAuthed, getToken, detectHueHubIP, authenticate};