import {holonet} from './holonetdata.js';

let entryList = document.querySelector("#entryList");

// Load everything to the page from holonet data
loadEntries(holonet.npcs);
loadEntries(holonet.planets);

function loadEntries(json) {
    // Select the type of post to generate
    for (let i = 0; i < json.length; i++) {
        if (json[i].tags.includes("npc") || json[i].tags.includes("planet")){
            loadData(json[i]);
        } else {
            console.log("Invalid entry" + json[i]);
            continue;
        }
    }
}

// Clone the entry template and insert data
function loadData(json) {
    let clonedEntry = document.querySelector("#entry").content.cloneNode(true);

    // Universal Properties
    clonedEntry.querySelector(".name").innerHTML = json.name;
    clonedEntry.querySelector(".affiliation + td").innerHTML = json.affiliation;
    clonedEntry.querySelector(".campaign + td").innerHTML = json.campaign;
    clonedEntry.querySelector(".bio").innerHTML = json.bio;

    // NPC specific
    if(json.tags.includes("npc")) {
        if (json.living) {
            clonedEntry.querySelector(".living + td").innerHTML = "Alive";
        } else {
            clonedEntry.querySelector(".living + td").innerHTML = "Dead";
        }
        clonedEntry.querySelector(".species + td").innerHTML = json.species;
        clonedEntry.querySelector(".planet + td").innerHTML = json.planet;
    } 
    // Planet specific
    else if (json.tags.includes("planet")) {
        clonedEntry.querySelector(".living+ td").remove();
        clonedEntry.querySelector(".living").remove();
        clonedEntry.querySelector(".species + td").remove();
        clonedEntry.querySelector(".species").remove();
        clonedEntry.querySelector(".planet + td").remove();
        clonedEntry.querySelector(".planet").remove();
    }

    entryList.appendChild(clonedEntry);
}