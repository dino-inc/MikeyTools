import {holonet} from './holonetdata.js';

let entryList = document.querySelector("#entryList");

// Load everything to the page from holonet data
loadEntries(holonet.npcs);

function loadEntries(json) {
    for (let i = 0; i < json.length; i++) {
        if (json[i].tags.includes("npc")){
            loadNpcData(json[i]);
        }
        else if (json[i].tags.includes("planet")) {
            console.log("planet");
        } else {
            console.log("Invalid entry" + json[i]);
            continue;
        }
    }
}

function loadNpcData(json) {
    const clonedEntry = document.querySelector("#npcEntry").content.cloneNode(true);
    entryList.appendChild(clonedEntry);
}