
'use strict';

 //require('es6-promise').polyfill(); promise polyfill for Internet Explorer
//Location IQ https://us1.locationiq.com/v1/search.php?key=YOUR_PRIVATE_TOKEN&q=SEARCH_STRING&format=json

//The Hiking Project https://www.hikingproject.com/data/get-trails
const apiHikingKey = "200636207-5a82966238be9f41a852d676740cfcdf";

const hikingProjectUrl = "https://www.hikingproject.com/data/get-trails";


function findTrails() {

    const params = {
        key: apiHikingKey,
        lat: latitude,
        lon: longitude
    }

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
                    <li>
                        <h4>${responseJson.trails[i].name}</h4>
                        <p>${responseJson.trails[i].location}</p>
                        <p>Rating: ${responseJson.trails[i].stars} / 5</p>
                        <p>Trail Length: ${responseJson.trails[i].length} mi</p>
                        <p>${responseJson.trails[i].summary}</p>
                        <a href="${responseJson.trails[i].url}">${responseJson.trails[i].url}</a>
                    </li>
                    `);
                }
            };
            
        })
        .catch(error => {
            return $(".js-error-message").text(`${error.message}`);
        });
};

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
    }

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
            
            
            
            findTrails(latitude, longitude);
        })
        .catch(error => {
            return $(".js-error-message").text(`${error.message}`);
        });

};


function listenToSubmit() {

    $("form").submit(event => {
        event.preventDefault();
        const userCity = $("#city").val();
        getCityGeoCode(userCity);
        
       
    });
};


$(listenToSubmit);