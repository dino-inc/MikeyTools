import {conditions} from './medcenterdata.js';

let entryList = document.querySelector("#entryList");
let urlParams = new URLSearchParams(window.location.search);

// Add event to search bar
document.querySelector("#searchBar").addEventListener ('keypress', function (e) {
    if (e.key === 'Enter') {
      runQuery();
    }
    });
// Default to everything if no url params specified
if (urlParams.size == 0) {
    loadEntries(conditions);
}

// Execute once enter is pressed on the search
function runQuery () {
    // Clear
    clearTerminal();
    // Read settings
    let searchBar = document.querySelector("#searchBar");

    // Run search
    let results = search(conditions, searchBar.value, ["name"]);
    let postArray = [];
    for (let i = 0; i < results.length; i++) {
        postArray.push(results[i].item);
    }
    //Load results
    loadEntries(postArray);
}

function loadEntries(json) {
    // Select the type of post to generate
    for (let i = 0; i < json.length; i++) {
        loadData(json[i]);
    }
}

// Clone the entry template and insert data
function loadData(json) {
    let clonedEntry = document.querySelector("#entry").content.cloneNode(true);

    clonedEntry.querySelector(".name").innerHTML = json.name;

    // Load effects array
    let effectNode = clonedEntry.querySelector(".effect");
    let effectList = clonedEntry.querySelector(".entryTable");
    for (let i = 0; i < json.effects.length; i++) {
        let copyNode = effectNode.cloneNode(true);
        if(i == 0) {
            copyNode = clonedEntry.querySelector(".effect");
        }
        let innerRow = clonedEntry.querySelector(".effect td");
        innerRow.innerHTML = json.effects[i];
        console.log("Adding "+copyNode+" with "+ json.effects[i])
        effectList.appendChild(copyNode);
    }
    entryList.appendChild(clonedEntry);
}

function clearTerminal () {
    document.querySelector("#entryList").innerHTML = '';
}

// Basic search on provided json and keys
function search(json, query, keysArray) {
    let options = {
        includeScore: false,
        threshold: .4,
        distance: 100,
        keys: keysArray
    };
    const fuse = new Fuse (json, options);
    return fuse.search(query)
}

