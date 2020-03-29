import messaging from "messaging";
import { View, $at } from './view'

const $ = $at( '#screen-1' );

import document from "document";

const tileList = document.getElementById("tile-list");
const tileItems = tileList.getElementsByClassName("tile-item");

export class Screen1 extends View {
    // Root view element used to show/hide the view.
    el = $(); // Extract #screen-1 element.

    // Ad-hoc $-queries must be avoided.
    // You've got dumb 120MHz MCU with no JIT in VM, thus everything you do is expensive.
    // Put all of your elements here, like this:

    // otherEl = $( '#other-el-id' );
    // elementsArray = $( '.other-el-class' );

    tileState = {} //{"0":false,"1":false,"2":false}


    /**
     * Lifecycle hook executed on `view.mount()`.
     * Setup events, call API's, initilize data, insert subviews here.
     * Remember: when setting up events call this.render() in the event.
     */
    onMount(){
        if(this.props != null){
            let index = 0;
            for (let light in this.props ){
                console.log(light)
                this.tileState[index] = { name:this.props[light].name,
                                         state: this.props[light].state.on,
                                         id: light
                                        }
                console.log(JSON.stringify(this.props[light]))
                index++;
            }      
            console.log("THE LIGHTS STATE FOR VIEW:")
            console.log(JSON.stringify(this.tileState));
        }
    }

    /**
     * put DOM manipulations here...
     * Call this.render() to update UI if required (watch out for inifinite recursion)
     */
    onRender(){       
        tileItems.forEach((element, index) => {
            element.firstChild.text = this.tileState[index].name
            element.firstChild.value = this.tileState[index].state ? 1 : 0;
            element.firstChild.onclick = (evt) => {
                this.tileState[index].state = !this.tileState[index].state
                if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
                    console.log(this.tileState.id)
                    const command = JSON.stringify(
                        {
                            command: "lightCommand",
                             payload: {
                                name:this.tileState[index].name,
                                state: this.tileState[index].state,
                                id: this.tileState[index].id
                            }
                        }    
                    );
                    console.log(command)
                    messaging.peerSocket.send(command);
                  }
                // this.render();
            };
        });
    }

    /**
     * Lifecycle hook executed on `view.unmount()`.
     * Unsubscribe from events in here just by setting them to null
     */
    onUnmount(){
    }
}