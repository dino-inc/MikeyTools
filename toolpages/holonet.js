import {holonet} from './holonetdata.js';

const allFields = ["name", "tags", "species", "affiliation", "living", "planet", "campaign", "bio"]
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
    loadEntries(holonet, true);
}

// Execute once enter is pressed on the search
function runQuery () {
    // Clear
    clearTerminal();
    // Read settings
    let searchBar = document.querySelector("#searchBar");
    let searchCategories = document.querySelector("#searchCategory");
    let extendedSearch = document.querySelector("#extendedSearch");
    let selectKeys = getSelectValues(searchCategories);
    if(selectKeys.includes("all")) {
        selectKeys = allFields;
    }

    // Short circuit if no query
    if (searchBar.value == "") {
        loadEntries(holonet);
        return;
    }
    // Run search
    let results = search(holonet, searchBar.value, selectKeys, extendedSearch.value);
    let postArray = [];
    for (let i = 0; i < results.length; i++) {
        postArray.push(results[i].item);
    }
    //Load results
    loadEntries(postArray, false);
}

function loadEntries(json, sort) {
    function compareNames(a, b) {
        // sort alphabetically
        if(a.name > b.name) {
            return 1;
        } else if (b.name > a.name) {
            return -1;
        }
        return 0;
    }
    if (sort) {
        json = json.sort(compareNames);
    }
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
    if (json.hasOwnProperty("image")) {
        clonedEntry.querySelector("img").src = "../images/" + json.image;
    }

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

function clearTerminal () {
    document.querySelector("#entryList").innerHTML = '';
}

// Basic search on provided json and keys
function search(json, query, keysArray, extended) {
    let options = {
        includeScore: false,
        useExtendedSearch: extended,
        threshold: .4,
        distance: 1000,
        keys: keysArray
    };
    const fuse = new Fuse (json, options);
    return fuse.search(query)
}


// Return an array of the selected opion values
// select is an HTML select element
function getSelectValues(select) {
    var result = [];
    var options = select && select.options;
    var opt;
  
    for (var i=0, iLen=options.length; i<iLen; i++) {
      opt = options[i];
  
      if (opt.selected) {
        result.push(opt.value || opt.text);
      }
    }
    return result;
  }