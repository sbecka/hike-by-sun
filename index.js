'use strict';

///////HTML Geolocation API for getting coordinates of a user's location and return trails and sun times 
let x = document.getElementById("demo");

function getLocation() {
  if (navigator.geolocation) {

    navigator.geolocation.getCurrentPosition(showPosition);

  } else { 

    x.innerHTML = "Geolocation is not supported by this browser.";

  };

};

function showPosition(position) {
    //x.innerHTML = "Latitude: " + position.coords.latitude + 
    //"<br>Longitude: " + position.coords.longitude;

    latitude = position.coords.latitude;
    longitude = position.coords.longitude;

    //console.log(latitude);
    //console.log(longitude);
    
    $(".js-city-name").text(`Trails around your area`);
    $(".js-city-to-do").empty();
    findTrails(latitude, longitude);
    findTodaySun(latitude, longitude);
};
//////////////////

//ipgeolocation Astronomy API https://api.ipgeolocation.io/astronomy offers times based on time zones with latitude and longitude

const geoAstronomyAPIKey = "170fa59d1a2c41ecbd0058cee382b898";

const geoLocationAstronomyUrl = "https://api.ipgeolocation.io/astronomy";

function findTodaySun(latitude, longitude) {

    const params = {
        apiKey: geoAstronomyAPIKey,
        lat: latitude,
        long: longitude
    };

    const sunQueryString = formatQuery(params);

    const url = geoLocationAstronomyUrl + "?" + sunQueryString;

    console.log(url);

    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => {
            let sunRiseTime = responseJson.sunrise;
            let newSunTime = removeLeadingZero(sunRiseTime);
            let militaryTime = responseJson.sunset;
            let newHour = militaryTimeConverter(militaryTime);
            console.log(responseJson);
            let today = responseJson.date;
            console.log(today);
            formatDate(today);
            $(".js-city-to-do").text(`Today is`)
            $(".js-daytime").text(`${responseJson.day_length} hours`);
            $(".js-sunrise").text(`${newSunTime} AM`);
            $(".js-sunset").text(`${newHour} PM`);
        })
        .catch(error => {
            return $(".js-error-message").text(`${error.message}`);
        });
};

function findSunTimes(latitude, longitude, dateYearMonthDay) {

    const params = {
        apiKey: geoAstronomyAPIKey,
        lat: latitude,
        long: longitude,
        date: dateYearMonthDay
    };

    const sunQueryString = formatQuery(params);

    const url = geoLocationAstronomyUrl + "?" + sunQueryString;

    console.log(url);

    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => {
            let sunRiseTime = responseJson.sunrise;
            let newSunTime = removeLeadingZero(sunRiseTime);
            let militaryTime = responseJson.sunset;
            let newHour = militaryTimeConverter(militaryTime);
            console.log(responseJson);
            $(".js-daytime").text(`${responseJson.day_length} hours`);
            $(".js-sunrise").text(`${newSunTime} AM`);
            $(".js-sunset").text(`${newHour} PM`);
        })
        .catch(error => {
            return $(".js-error-message").text(`${error.message}`);
        });
};

function removeLeadingZero(sunRiseTime) {

    let indexZero = sunRiseTime.indexOf("0");

    if (indexZero === 0) {
        let newTime = sunRiseTime.slice(1);
        sunRiseTime = newTime;
        //console.log(sunRiseTime);
    }

    return sunRiseTime;
};

function militaryTimeConverter(militaryTime) {
    let hourTime = militaryTime.split(":");
    let hourTarget = hourTime.shift();
    let hourNumber = parseInt(hourTarget);
    
    if (hourNumber === 13) {
        hourNumber = 1;
    } else if (hourNumber === 14) {
        hourNumber = 2;
    } else if (hourNumber === 15) {
        hourNumber = 3;
    } else if (hourNumber === 16) {
        hourNumber = 4;
    } else if (hourNumber === 17) {
        hourNumber = 5;
    } else if (hourNumber === 18) {
        hourNumber = 6;
    } else if (hourNumber === 19) {
        hourNumber = 7;
    } else if (hourNumber === 20) {
        hourNumber = 8;
    } else if (hourNumber === 21) {
        hourNumber = 9;
    } else if (hourNumber === 22) {
        hourNumber = 10;
    } else if (hourNumber === 23) {
        hourNumber = 11;
    } else if (hourNumber === 24) {
        hourNumber = 12;
    };
    
    let turnBackToString = hourNumber.toString();
    hourTime.unshift(turnBackToString);
    let normalHour = hourTime.join(":");
    //console.log(normalHour);
    return normalHour;
};

//The Hiking Project https://www.hikingproject.com/data/get-trails

const apiHikingKey = "200636207-5a82966238be9f41a852d676740cfcdf";

const hikingProjectUrl = "https://www.hikingproject.com/data/get-trails";

function findTrails(latitude, longitude, maxResults=10, minLength=0, maxDistance=30) {

    const params = {
        key: apiHikingKey,
        lat: latitude,
        lon: longitude,
        maxResults,
        minLength,
        maxDistance 
    };

    const trailsQueryString = formatQuery(params);

    const url = hikingProjectUrl + "?" + trailsQueryString;

    console.log(url);

    fetch(url)
        .then(response => {

            if(response.ok) {

                return response.json();

            }
            throw new Error(response.statusText);
        })
        .then(responseJson => {
           
            if (responseJson.trails.length == 0) {

                $(".js-city-name").text(`No trails in ${cityName}`);
                $(".view-trails-submit").addClass("hide-results");
                $(".js-trail-results").empty();
                
                return $(".js-error-message").text(`No trails found there. Try another place or plan your day.`);
            
            } else if (responseJson.trails.length > 0) {
                
                $(".js-error-message").empty();
                $(".js-trail-results").empty();

                for (let i = 0; i < responseJson.trails.length; i++) {

                    let trailPhoto = responseJson.trails[i].imgSmallMed;

                    if (trailPhoto === "") { //check if a trail has a photo with it or no photo

                        $(".view-trails-submit").removeClass("hide-results");
                        
                        $(".js-trail-results").append(`
                        
                        <li class="trail js-trail">
                        <div class="trail-heading">

                            <a href="${responseJson.trails[i].url}" target="_blank" class="trail-website">
                                
                                <h4 class="trail-name">${responseJson.trails[i].name}</h4>
                            
                            </a>
                       
                       
                            <button class="add-trail js-add-trail">
                                
                                <span class="add-label">
                                    <i class="fas fa-plus-circle"></i> Add Trail
                                </span>
                            
                            </button>
                           
                        </div>
                        
                        <p>${responseJson.trails[i].location}</p>
                        
                        <div class="trail-details">
                            
                            <p class="rating">Rating: ${responseJson.trails[i].stars} / 5</p>
                            <p class="trail-length">Trail Length: ${responseJson.trails[i].length} mi</p>
                        
                        </div>
                        
                        <p>${responseJson.trails[i].summary}</p>
                    
                    </li>`);

                    } else if (trailPhoto !== "") {
                        
                        $(".view-trails-submit").removeClass("hide-results");
                        
                        $(".js-trail-results").append(`
                        
                        <li class="trail js-trail">

                            <div class="trail-heading">

                                <a href="${responseJson.trails[i].url}" target="_blank" class="trail-website">
                                    
                                    <h4 class="trail-name">${responseJson.trails[i].name}</h4>
                                
                                </a>
                        
                            
                                <button class="add-trail js-add-trail">
                                    
                                    <span class="add-label">
                                        <i class="fas fa-plus-circle"></i> Add Trail 
                                    </span>
                                
                                </button>
                                
                            </div>
                            
                            <img class="trail-photo" src="${responseJson.trails[i].imgSmallMed}" alt="Photo from ${responseJson.trails[i].name}"></img>
                            <p>${responseJson.trails[i].location}</p>
                            
                            <div class="trail-details">
                                
                                <p class="rating">Rating: ${responseJson.trails[i].stars} / 5</p>
                                <p class="trail-length">Trail Length: ${responseJson.trails[i].length} mi</p>
                            
                            </div>
                            
                            <p>${responseJson.trails[i].summary}</p>
                        
                        </li>`);
                    }
                }
            };
            
        })
        .catch(error => {

            return $(".js-error-message").text(`${error.message} trail data. Server is down.`);
        
        });
};

//Location IQ API https://us1.locationiq.com/v1/search.php?key=YOUR_PRIVATE_TOKEN&q=SEARCH_STRING&format=json

const apiToken = "f4e25901c1a5fc";

const locationIqUrl = "https://us1.locationiq.com/v1/search.php";

const jsonFormat = "json";

//format query parameters for a url to make get requests to APIs
function formatQuery(params) {

    const queryItems = Object.keys(params)
        .map(key => `${key}=${params[key]}`);
    
    return queryItems.join("&");
};

//JSONP data inside function
let call = function callbackGeoCode(data) {
    console.log(data);
};

let latitude = null;
let longitude = null;
let cityName = null;

function getCityGeoCode(userCity) {

    const params = {
        key: apiToken,
        q: userCity,
        format: jsonFormat,
        json_callback: call
    };

    const locationQueryString = formatQuery(params);

    const url = locationIqUrl + "?" + locationQueryString;
    console.log(url);
    
    fetchJsonp(url, { //using fetch jsonp callback
        jsonpCallback: 'json_callback', jsonpCallbackFunction: 'callBackGeoCode' 
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => {

            latitude = responseJson[0].lat;
            longitude = responseJson[0].lon;
            cityName = responseJson[0].display_name;

            cityName = formatCityName(cityName);

            //console.log(latitude);
            //console.log(longitude);
            //console.log(cityName);

            $(".js-city-name").text(`Trails around ${cityName}`);
            $(".js-city-to-do").text(`${cityName}`);
            
       
            let dateYearMonthDay = $("#date").val();
            let maxResults= $("#max-results").val();
            let minLength = $("#min-length").val();
            let maxDistance = $("#max-length").val();
    
            //console.log(dateYearMonthDay); 2019-11-18
            findTrails(latitude, longitude, maxResults, minLength, maxDistance);
            findSunTimes(latitude, longitude, dateYearMonthDay);
        })
        .catch(error => {
            return $(".js-error-message").text(`${error.message}`);
        });

};

//removing county from a city's name to make city name appear shorter on page
function formatCityName(cityName) {

    let getCounty = cityName.split(",");

    
    for (let i = 0; i < getCounty.length; i++) {
        
        if (getCounty[i].includes("County")) {

            let county = getCounty.splice(i, 1);
            
            console.log(county); //Marion County    
        };
    };

    let removedCounty = getCounty.join(",");

    cityName = removedCounty;

    return cityName;
    
};

//changing date input format to appear on the page as a normal date with month day, year format
function formatDate(date) {

    let newDate = date.split("-");
    //console.log(newDate); ["2019", "11", "18"]

    if (newDate[1] === "01") {
        newDate[1] = "January";
    } else if (newDate[1] === "02") {
        newDate[1] = "February";
    } else if (newDate[1] === "03") {
        newDate[1] = "March";
    } else if (newDate[1] === "04") {
        newDate[1] = "April";
    } else if (newDate[1] === "05") {
        newDate[1] = "May";
    } else if (newDate[1] === "06") {
        newDate[1] = "June";
    } else if (newDate[1] === "07") {
        newDate[1] = "July";
    } else if (newDate[1] === "08") {
        newDate[1] = "August";
    } else if (newDate[1] === "09") {
        newDate[1] = "September";
    } else if (newDate[1] === "10") {
        newDate[1] = "October";
    } else if (newDate[1] === "11") {
        newDate[1] = "November";
    } else if (newDate[1] === "12") {
        newDate[1] = "December";
    };

    let year = newDate.shift();
    let day = newDate.join(" ");
    newDate = day + ", " + year;
    //console.log(newDate); November 18, 2019

    $(".js-date").text(`${newDate}`);

};

//when use clicks add trail button, the trail's name will be added to the list
function clickAddTrail() {

    $(".js-trail-results").on("click", ".js-add-trail", function(event) {

        $(this).closest("li").find(".add-label").text(`Added!`);

        let trailName = $(this).closest("li").find(".trail-name").html();
        
        console.log(trailName);

        $(".activities").append(
            `<li class="list-item">

                <div class="act-and-times">

                    <span class="activity-item">${trailName}</span>

                    <div class="edit-delete-buttons">

                        <button class="edit-button"><i class="far fa-edit" aria-hidden="true"></i> Edit</button>
                        <button class="delete-button"><i class="far fa-trash-alt" aria-hidden="true"></i> Delete</button>
                    
                    </div>  

                </div>

                <div class="times-or-notes">

                    <span class="times-notes"></span>

                </div>

                <div class="edit-activity hide-edit">

                    <label for="activity-title">Activity Title</label>
                    <input type="text" name="activity-title" id="activity-title">
                    
                    <label for="time-note">How much time or notes for activity?</label>
                    <input type="text" name="time-note" id="time-note" placeholder="30 min">

                    <button class="save-button">Save</button>
                
                </div>
                
            </li>`);

    });
                    
};

//alow user to add new items to list and input a value as the title of the item
let userActivity = null;

function addActivity() {

    $(".adding-activity").submit(event => {

        event.preventDefault();
        userActivity = $("#activity").val();

        $(".activities").append(

            `<li class="list-item">

                <div class="act-and-times">
                    
                    <span class="activity-item">${userActivity}</span>

                    <div class="edit-delete-buttons">
                        
                        <button class="edit-button"><i class="far fa-edit" aria-hidden="true"></i> Edit</button>
                        <button class="delete-button"><i class="far fa-trash-alt" aria-hidden="true"></i> Delete</button>
                    
                    </div>  
                
                </div>
    
                <div class="times-or-notes">
                    
                    <span class="times-notes"></span>
                
                </div>

                <div class="edit-activity hide-edit">

                    <label for="activity-title">Activity Title</label>
                    <input type="text" name="activity-title" id="activity-title">
                    
                    <label for="time-note">How much time or notes for activity?</label>
                    <input type="text" name="time-note" id="time-note" placeholder="30 min">

                    <button class="save-button">Save</button>
                  
                </div>

            </li>`);

        $("#activity").val(""); //empty input value
    });
};

//user can click edit button to open editing for a list item or delete button
function clickEditDeleteActivity() {

    //edit list item
    $(".activities").on("click", ".edit-button", function(event) {

        $(this).closest("li").find(".edit-activity").toggleClass("hide-edit");
    
    });
    
    //delete list item
    $(".activities").on("click", ".delete-button", function(event) {

        $(this).closest("li").remove();

    });
};

//Allow user to change and save a list item's title and add notes
let title = null;
let timeOrNote = null;

function updateEditActivity() {

    $(".activities").on("click", ".save-button", function(event) {

        event.preventDefault();

        title = $(this).closest("li").find("#activity-title").val();
        console.log(title);

        if (title !== "" || title !== title) { //if title doesn't equal an empty input or doesn't equal itself

            $(this).closest("li").find(".activity-item").text(`${title}`);
        
        };

        timeOrNote = $(this).closest("li").find("#time-note").val();

        console.log(timeOrNote);

        if (timeOrNote !== "") { //if note is not an empty input, then let new user input be the note

            $(this).closest("li").find(".times-notes").text(`Notes: ${timeOrNote}`);

        };
        
        $(this).closest("li").find(".edit-activity").toggleClass("hide-edit");
    
    });
    
};

//open and close hamburger or bar icon for navigation menu
function toggleHamburgerIcon() {
 
    $(".hamburger-icon").click(event => {
        $(".nav-links").toggleClass("responsive")
        $(".nav-list").toggleClass("respond-to-hamburger")
    });

    $(".hamburger-icon").keypress(event => {
        $(".nav-links").toggleClass("responsive")
        $(".nav-list").toggleClass("respond-to-hamburger")
    });
};

//open and close add to list section
function openAddToList() {

    $(".add-an-activity-button").click(event => {
        $(".adding-activity").toggleClass("hide-add-activity");
    });

    $(".close-activity-button").click(event => {
        $(".adding-activity").toggleClass("hide-add-activity");
    });

    $(".close-activity-button").keypress(event => {
        $(".adding-activity").toggleClass("hide-add-activity");
    });
};

//Open and close search section
function openSearchTrails() {

    $(".search-button").click(event => {
        $("#search").toggleClass("hide-search");
    });

    $(".close-search-button").click(event => {
        $("#search").toggleClass("hide-search");
    });

    $(".close-search-button").keypress(event => {
        $("#search").toggleClass("hide-search");
    });

    $(".search").click(event => {
        $("#search").toggleClass("hide-search");
    });
};

//open and close seach filter section in search section
function refineSearch() {
    $("legend").click(event => {
        $(".refine-search").toggleClass("hide-refine-search")
    });

    $("legend").keypress(event => {
        $(".refine-search").toggleClass("hide-refine-search")
    });
};

//listen when user submits a search and get the input values for city/place and date
function listenToSubmit() {

    $(".search-city-date").submit(event => {
        event.preventDefault();
        const userCity = $("#city").val();
        getCityGeoCode(userCity);
        const userDate = $("#date").val();
        formatDate(userDate);
    });
};

function listenForEvents() {

    listenToSubmit();
    clickAddTrail();
    addActivity();
    clickEditDeleteActivity();
    updateEditActivity();
    toggleHamburgerIcon();
    openAddToList();
    openSearchTrails();
    refineSearch();

};


$(listenForEvents);