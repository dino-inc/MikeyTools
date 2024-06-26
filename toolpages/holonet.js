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
    if (detectSort()) {
        loadEntries(holonet, "alph");
    } else {
        loadEntries(holonet, "year");
    }

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
            filteredHolonet = filterTagJson(filteredHolonet, "tags", categoryButtons[i].name);
        }
    }
    // Short circuit if no query
    if (searchBar.value == "") {
        if (detectSort()) {
            loadEntries(filteredHolonet, "alph");
        } else {
            loadEntries(filteredHolonet, "year");
        }
    } else {
        // Run search
        let results = search(filteredHolonet, searchBar.value, selectKeys, extendedSearch.value);
        let postArray = [];
        for (let i = 0; i < results.length; i++) {
            postArray.push(results[i].item);
        }
        //Load results
        loadEntries(postArray, "none");
    }
    // console.log("Entries loaded in "+(Date.now() - initialTimestamp)+ "ms")
}

function loadEntries(json, sort) {
    if (sort == "alph") {
        json = json.sort(compareNames);
    } else if (sort == "year") {
        json = json.sort(compareYears);
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


// Return an array of the selected option values
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

// Sort function for alphabetical order
function compareNames(a, b) {
    // sort alphabetically
    if(a.name > b.name) {
        return 1;
    } else if (b.name > a.name) {
        return -1;
    }
    return 0;
}

// Sort function for sorting by BTC/ATC year
function compareYears(a, b) {
    // Handle empty years
    console.log(b.year == "")
    if (a.year == "") {
        if (b.year == "") {
            return -1;
        }
        return 1;
    } else if (b.year == "") {
        if (a.year == "") {
            return 1;
        }
        return -1;
    }

    // Regex outputs in the format [Year, ATC/BTC]
    let yearRegEx = /([0-9,]*)\.*([0-9]*) (ATC|BTC)/;
    let yearA = yearRegEx.exec(a.year);
    let yearB = yearRegEx.exec(b.year);
    console.log(yearA)
    yearA[1] = parseInt(yearA[1].replace(",", ''));
    yearB[1] = parseInt(yearB[1].replace(",", ''));
    yearA[2] = parseInt(yearA[2]);
    yearB[2] = parseInt(yearB[2]);
    console.log(yearA)

    // BTC comes before ATC
    if(yearA[3] == "BTC" && yearB[3] == "ATC") {
        return -1;
    //ATC comes after BTC
    } else if (yearA[3] == "ATC" && yearB[3] == "BTC") {
        return 1;
    // Larger numbers come before in BTC
    } else if (yearA[3] == "BTC" && yearB[3] == "BTC") {
        if (yearA[1] > yearB[1]) {
            return -1;
        } else if (yearA[1] < yearB[1])  {
            return 1;
        } else {
            return compareDec(yearA[2], yearB[2]);
        }
    // Smaller numbers come before in ATC
    } else if (yearA[3] == "ATC" && yearB[3] == "ATC") {
        if (yearA[1] < yearB[1]) {
            return -1;
        } else if (yearA[1] > yearB[1])  {
            return 1;
        } else {
            return compareDec(yearA[2], yearB[2]);
        }
    }
    return 0;
}

function compareDec(a, b) {
    if (a > b) {
        return 1;
    } else if (a < b) {
        return -1;
    } else {
        return 0;
    }
}

// true if alphabetical sort, false if year sort
function detectSort () {
    let categoryButtons = document.querySelectorAll(".categoryButton")
    let alphSort = true;
    for (let i = 0; i < categoryButtons.length; i++) {
        if (categoryButtons[i].name != "history" && categoryButtons[i].value == "true") {
            alphSort = true;
            break;
        } else if (categoryButtons[i].name == "history" && categoryButtons[i].value == "true") {
            alphSort = false;
        }
    }
    return alphSort;
}