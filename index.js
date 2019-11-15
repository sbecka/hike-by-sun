'use strict';

// Sunrise Sunset API https://api.sunrise-sunset.org/json

const sunRiseSunSetUrl = "https://api.sunrise-sunset.org/json";

function findSunTimes(latitude, longitude, dateYearMonthDay) {

    const params = {
        lat: latitude,
        lng: longitude,
        date: dateYearMonthDay
    };

    const sunQueryString = formatQuery(params);

    const url = sunRiseSunSetUrl + "?" + sunQueryString;

    console.log(url);

    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => {
            console.log(responseJson);
        })
        .catch(error => {
            return $(".js-error-message").text(`${error.message}`);
        });
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
                        <h4>${responseJson.trails[i].name}</h4>
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
    
    fetchJsonp(url, {
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
            $(".js-city-name").text(`Trails in ${cityName}`);
            $(".js-city-timeline").text(`${cityName}`);
            console.log(latitude);
            console.log(longitude);
            console.log(cityName);
            
            
            const dateYearMonthDay = $("#date").val();
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



function listenToSubmit() {

    $("form").submit(event => {
        event.preventDefault();
        const userCity = $("#city").val();
        getCityGeoCode(userCity);
        const userDate = $("#date").val();
        formatDate(userDate);
    });
};


$(listenToSubmit);