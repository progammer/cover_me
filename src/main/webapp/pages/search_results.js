let api_key = "AIzaSyCOMxTQ8uWeUUxYOaciOHRwEsaWCA0eQeQ";

let map;
let s_keywords, s_location, s_radius;

function initMap() {
    //First get search attributes
    let search_param = window.location.search.split("&");
    s_keywords = search_param[0].split("=")[1].split("+");
    s_location = search_param[1].split("=")[1];
    s_radius = search_param[2].split("=")[1];
    if (s_radius == "default") {
        s_radius = 25;
    } else {
        s_radius = parseInt(s_radius);
    }

    console.log(s_keywords);
    console.log(s_location);
    console.log(s_radius);

    var loc_json = JSON.parse(Get("https://maps.googleapis.com/maps/api/geocode/json?address=" + s_location + "&key=" + api_key));
    var geo_loc = loc_json.results[0].geometry.location;

    map = new google.maps.Map(document.getElementById("map"), {
        center: geo_loc,
        zoom: 8,
        mapTypeControlOptions: {
            mapTypeIds: ["roadmap", "satellite", "hybrid", "terrain"]
        },
    });

    addPostings()
}

function addPostings() {
    //GET PARAMS WITH FETCH, temp json:
    fetch_json = 
        [
            {
                title: "Help Me Hack! 1",
                description: "Please someone come help me",
                distance: 1,
                author: "Ethan Lao"
            },
            {
                title: "Help Me Hack! 2",
                description: "Please someone come help me",
                distance: 3.67,
                author: "Ethan Lao"
            },
            {
                title: "Help Me Hack! 3",
                description: "Please someone come help me",
                distance: 7,
                author: "Ethan Lao"
            },
        ];

    for (posting in fetch_json) {
        console.log(posting.title);
    }
}

function Get(yourUrl){
    var Httpreq = new XMLHttpRequest(); // a new request
    Httpreq.open("GET",yourUrl,false);
    Httpreq.send(null);
    return Httpreq.responseText;          
}