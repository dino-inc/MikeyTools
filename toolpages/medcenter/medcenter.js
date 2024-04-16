import {conditions} from './medcenterdata.js';

let entryList = document.querySelector("#entryList");
let urlParams = new URLSearchParams(window.location.search);

// Add event to search bar
document.querySelector("#searchBar").addEventListener ('keyup', function (e) {
      runQuery();
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

    // Short circuit if no query
    if (searchBar.value == "") {
        loadEntries(conditions);
        return;
    }

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
        let innerRow = copyNode.querySelector(".effect td");

        // Add a templated table if the entry is an array
        if (Array.isArray(json.effects[i])) {
            let tableTemplate = document.querySelector("#effectTable").content.cloneNode(true);
            for (let j = 0; j < json.effects[i].length; j++) {
                let copyRow = tableTemplate.querySelector(".tableEntry").cloneNode(true);
                copyRow.querySelector("td:nth-child(1)").innerHTML = json.effects[i][j][0];
                copyRow.querySelector("td:nth-child(2)").innerHTML = json.effects[i][j][1];
                tableTemplate.querySelector("tbody").append(copyRow);
            }
            // Remove the empty template
            tableTemplate.querySelector(".tableEntry").remove();
            innerRow.append(tableTemplate);
        } else {
        // Otherwise just add the effect to the inner HTML
            innerRow.innerHTML = json.effects[i];
        }
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

