
'use strict';

 //require('es6-promise').polyfill(); promise polyfill for Internet Explorer
//Location IQ https://us1.locationiq.com/v1/search.php?key=YOUR_PRIVATE_TOKEN&q=SEARCH_STRING&format=json

const apiToken = "f4e25901c1a5fc";

const locationIqUrl = "https://us1.locationiq.com/v1/search.php";

const jsonFormat = "json";

function formatGeoCodeQuery(params) {

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

    const queryString = formatGeoCodeQuery(params);

    const url = locationIqUrl + "?" + queryString;
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
            $(".city-name").append(`${cityName}`);
            console.log(latitude);
            console.log(longitude);
            console.log(cityName);
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