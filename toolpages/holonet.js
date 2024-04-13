import {holonet} from './holonetdata.js';

// Load everything to the page from holonet data
loadEntries(holonet.planets);

function loadEntries(json) {
    for (let i = 0; i < json.length; i++) {
        if (json[i].tags.includes("npc")){
            console.log("npc");
        }
        else if (json[i].tags.includes("planet")) {
            console.log("planet");
        } else {
            console.log("Invalid entry" + json[i]);
            continue;
        }
    }
}
