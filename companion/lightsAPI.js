import { localStorage } from "local-storage";


async function getAllLights(sendLightsData){
    let lights = await apiCall('/lights')
    sendLightsData(lights);
}

async function changeLightState(light){
  console.log(JSON.stringify(light))
  //{"id": 3, "name":"Jo and Col Boudoir","state":true}
  let thing = await apiCall(`/lights/${light.id}/state`, 'PUT', {on: light.state})
}

async function apiCall(URI, method = 'GET', body = null){
  const token = localStorage.getItem("authToken");
  const ip = localStorage.getItem("hueHubIP");
  const url = `http://${ip}/api/${token}${URI}`;
  
  console.log("calling lights API:");
  console.log(url)

 let options = {  
    method: method,
    headers:{'Content-Type': 'application/json'},
  }
  if (body){
    options.body = JSON.stringify(body)
  }
  let response = await fetch(url, options);
  let data = await response.json();
  return data;
}

export { getAllLights, changeLightState };