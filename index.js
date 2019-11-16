'use strict';

//ipgeolocation Astronomy API https://api.ipgeolocation.io/astronomy offers times based on time zones with latitude and longitude

const geoAstronomyAPIKey = "170fa59d1a2c41ecbd0058cee382b898";

const geoLocationAstronomyUrl = "https://api.ipgeolocation.io/astronomy";

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
            $(".js-daytime").text(`Day Length: ${responseJson.day_length} hours`);
            $(".js-sunrise").text(`Sunrise: ${newSunTime} AM`);
            $(".js-sunset").text(`Sunset: ${newHour} PM`);
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

function findTrails() {

    const params = {
        key: apiHikingKey,
        lat: latitude,
        lon: longitude
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
                return $(".js-error-message").text(`No trails found there. Try another place?`);
            } else if (responseJson.trails.length > 0) {
                
                $(".js-error-message").empty();
                $(".js-trail-results").empty();

                for (let i = 0; i < responseJson.trails.length; i++) {

                    $(".js-trail-results").append(`
                    <li class="trail js-trail">
                        <h4 class="trail-name">${responseJson.trails[i].name}</h4>
                        <div class="add-trail-buttons">
                            <button class="add-trail js-add-trail">
                                <span class="add-label">
                                    Add Trail
                                </span>
                            </button>
                        </div>
                        <p>${responseJson.trails[i].location}</p>
                        <p>Rating: ${responseJson.trails[i].stars} / 5</p>
                        <p>Trail Length: ${responseJson.trails[i].length} mi</p>
                        <p>${responseJson.trails[i].summary}</p>
                        <a href="${responseJson.trails[i].url}" target="_blank">${responseJson.trails[i].url}</a>
                    </li>
                    `);
                }
            };
            
        })
        .catch(error => {
            return $(".js-error-message").text(`${error.message}`);
        });
};

//Location IQ API https://us1.locationiq.com/v1/search.php?key=YOUR_PRIVATE_TOKEN&q=SEARCH_STRING&format=json

const apiToken = "f4e25901c1a5fc";

const locationIqUrl = "https://us1.locationiq.com/v1/search.php";

const jsonFormat = "json";

function formatQuery(params) {

    const queryItems = Object.keys(params)
        .map(key => `${key}=${params[key]}`);
    
    return queryItems.join("&");
};

//const x = function callbackGeoCode(data) {
//    console.log(data[0].display_name);
//};
let latitude = null;
let longitude = null;
let cityName = null;

function getCityGeoCode(userCity) {

    const params = {
        key: apiToken,
        q: userCity,
        format: jsonFormat
        //json_callback: x
    };

    const locationQueryString = formatQuery(params);

    const url = locationIqUrl + "?" + locationQueryString;
    console.log(url);
    
    fetch(url)
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
            $(".js-city-name").text(`Trails in ${cityName}`);
            $(".js-city-timeline").text(`${cityName}`);
            console.log(latitude);
            console.log(longitude);
            console.log(cityName);
       
            let dateYearMonthDay = $("#date").val();
    
            console.log(dateYearMonthDay);
            findTrails(latitude, longitude);
            findSunTimes(latitude, longitude, dateYearMonthDay);
        })
        .catch(error => {
            return $(".js-error-message").text(`${error.message}`);
        });

};

function formatDate(userDate) {
    let newDate = userDate.split("-");
    console.log(newDate);
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
    console.log(newDate);

    $(".js-date").text(`${newDate}`);


};

function clickAddTrail() {

    $(".js-trail-results").on("click", ".js-add-trail", function(event) {

        $(this).closest("li").find(".add-label").text(`Added!`);
        let trailName = $(this).closest("li").find(".trail-name").html();
        
        console.log(trailName);
        $(".activities").append(
            `<li>
                <span class="activity-item">${trailName}</span>

                <div class="times-for-item">
                    <span class="times"></span>
                </div>

                <button class="edit-button">Edit</button>

                <div class="edit-activity hide-edit">

                    <label for="activity-title">Activity Title</label>
                    <input type="text" name="activity-title" id="activity-title">
                    
                    <label for="start-time">Start Time</label>
                    <input type="time" name="start-time" id="start-time">

                    <label for="end-time">End Time</label>
                    <input type="time" name="end-time" id="end-time">

                    <button class="done-button">Done</button>
                    <button class="delete-button">Delete</button>
                
                </div>
            </li>`);
    });
                    
};

let userActivity = null;

function addActivity() {

    $(".adding-activity").submit(event => {
        event.preventDefault();
        userActivity = $("#activity").val();
        $(".activities").append(
            `<li>
                <span class="activity-item">${userActivity}</span>

                <div class="times-for-item">
                    <span class="times"></span>
                </div>

                <button class="edit-button">Edit</button>

                <div class="edit-activity hide-edit">

                    <label for="activity-title">Activity Title</label>
                    <input type="text" name="activity-title" id="activity-title">
                    
                    <label for="start-time">Start Time</label>
                    <input type="time" name="start-time" id="start-time">

                    <label for="end-time">End Time</label>
                    <input type="time" name="end-time" id="end-time">

                    <button class="done-button">Done</button>
                    <button class="delete-button">Delete</button>
        
                </div>
            </li>`);
        $("#activity").val("");
    });
};

function clickEditDeleteActivity() {

    $(".activities").on("click", ".edit-button", function(event) {

        $(this).closest("li").find(".edit-activity").toggleClass("hide-edit");
        title = null;
        $("#activity-title").val("");
        
        startTime = null;
        endTime = null;
    
    });

    $(".activities").on("click", ".delete-button", function(event) {

        $(this).closest("li").remove();

    });
};

let title = null;
let startTime = null;
let endTime = null;

function updateEditActivity() {

    $(".activities").on("click", ".done-button",function(event) {
        event.preventDefault();

        title = $(this).closest("li").find("#activity-title").val();
        console.log(title);

        if (title !== "" || title !== title){

            $(this).closest("li").find(".activity-item").text(`${title}`);
        
        };

        startTime = $(this).closest("li").find("#start-time").val();
        endTime = $(this).closest("li").find("#end-time").val();

        console.log(startTime);
        console.log(endTime);

        $(this).closest("li").find(".times").text(`${startTime} to ${endTime}`);
        
        $(this).closest("li").find(".edit-activity").toggleClass("hide-edit");
    });
    
};



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
};


$(listenForEvents);