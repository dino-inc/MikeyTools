import {holonet} from './holonetdata.js';

const allFields = ["name", "tags", "species", "affiliation", "living", "planet", "campaign", "bio", "region", "location", "year", "description", "era"]
let entryList = document.querySelector("#entryList");
let urlParams = new URLSearchParams(window.location.search);

// Add event to search bar
document.querySelector("#searchBar").addEventListener ('keyup', function (e) {
    runQuery();
});
// Toggleable category buttons
let catButtons = document.querySelectorAll(".categoryButton")
for (let i = 0; i < catButtons.length; i++) {
    catButtons[i].addEventListener ('click', function (e) {
        if (this.value == "true") {
            this.value = "false";
        } else {
            this.value = "true";
        };
        runQuery();
    });
}

// Default to everything if no url params specified
if (urlParams.size == 0) {
    loadEntries(holonet, true);
}

// Execute once enter is pressed on the search
function runQuery () {
    // let initialTimestamp = Date.now();
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
    // Apply tag filters
    let categoryButtons = document.querySelectorAll(".categoryButton")
    let filteredHolonet = holonet;
    for (let i = 0; i < categoryButtons.length; i++) {
        if (categoryButtons[i].value == "false") {
            console.log("filtering "+ categoryButtons[i].name)
            filteredHolonet = filterTagJson(filteredHolonet, "tags", categoryButtons[i].name);
        }
    }
    console.log("done")
    // Short circuit if no query
    if (searchBar.value == "") {
        loadEntries(filteredHolonet);
    } else {
        // Run search
        let results = search(filteredHolonet, searchBar.value, selectKeys, extendedSearch.value);
        let postArray = [];
        for (let i = 0; i < results.length; i++) {
            postArray.push(results[i].item);
        }
        //Load results
        loadEntries(postArray, false);
    }
    // console.log("Entries loaded in "+(Date.now() - initialTimestamp)+ "ms")
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
        if (json[i].tags.includes("npc")) {
            loadNPC(json[i]);
        } else if (json[i].tags.includes("planet")){
            loadPlanet(json[i]);
        } else if (json[i].tags.includes("history")) {
            loadHistory(json[i]);
        } else {
            console.log("Invalid entry" + json[i]);
            continue;
        }
    }
}

// NPC card
function loadNPC(json) {
    let clonedEntry = document.querySelector("#npc").content.cloneNode(true);

    clonedEntry.querySelector(".name").innerHTML = json.name;
    clonedEntry.querySelector(".affiliation + td").innerHTML = json.affiliation;
    clonedEntry.querySelector(".campaign + td").innerHTML = formatCampaign(json.campaign);
    clonedEntry.querySelector(".bio").innerHTML = json.bio;
    if (json.hasOwnProperty("image")) {
        clonedEntry.querySelector("img").src = "../images/" + json.image;
    }
    if (json.living) {
        clonedEntry.querySelector(".living + td").innerHTML = "Alive";
    } else {
        clonedEntry.querySelector(".living + td").innerHTML = "Dead";
    }
    clonedEntry.querySelector(".species + td").innerHTML = json.species;
    clonedEntry.querySelector(".planet + td").innerHTML = json.planet;

    entryList.appendChild(clonedEntry);
}

// Planet card
function loadPlanet(json){
    let clonedEntry = document.querySelector("#planet").content.cloneNode(true);

    clonedEntry.querySelector(".name").innerHTML = json.name;
    clonedEntry.querySelector(".region + td").innerHTML = json.region;
    clonedEntry.querySelector(".affiliation + td").innerHTML = json.affiliation;
    clonedEntry.querySelector(".campaign + td").innerHTML = formatCampaign(json.campaign);
    clonedEntry.querySelector(".bio").innerHTML = json.bio;
    if (json.hasOwnProperty("image")) {
        clonedEntry.querySelector("img").src = "../images/" + json.image;
    }

    entryList.appendChild(clonedEntry);
}

function loadHistory(json) {
    let clonedEntry = document.querySelector("#history").content.cloneNode(true);

    clonedEntry.querySelector(".name").innerHTML = json.name;
    clonedEntry.querySelector(".year + td").innerHTML = json.year;
    clonedEntry.querySelector(".era+ td").innerHTML = json.era;
    clonedEntry.querySelector(".location + td").innerHTML = json.location;
    clonedEntry.querySelector(".description").innerHTML = json.description;
    
    if (json.hasOwnProperty("image")) {
        clonedEntry.querySelector("img").src = "../images/" + json.image;
    }

    entryList.appendChild(clonedEntry);
}

// Nicely format the campaign array with newlines
function formatCampaign(array) {
    let formattedString = "";
    for (let i = 0; i < array.length; i++) {
        formattedString = formattedString.concat('\n', array[i]);
    }

    return formattedString;
}

function clearTerminal () {
    document.querySelector("#entryList").innerHTML = "";
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

// Filter out the specified value
  function filterTagJson(array, field, val) {
    return array.filter(function (el) {
        return !el[field].includes(val);
    });
  }