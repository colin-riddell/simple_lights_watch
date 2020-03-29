import { View, $at } from './view'
import messaging from "messaging";

// Create the root selector for the view...
const $ = $at( '#screen-2' );

export class Screen2 extends View {
    el = $();

    authedButton = $('#mybutton')

    onMount(){
    }

    onUnmount(){
    }

    onRender(){
        this.authedButton.onactivate = function(evt) {
            if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
                messaging.peerSocket.send(JSON.stringify({command: "askForAuthResponse"}));
              }
        }
    }
}