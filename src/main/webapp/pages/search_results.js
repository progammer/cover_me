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

    document.getElementById("search-disp").innerHTML = "Search results near " + s_location.split("+").join(" ");

    var loc_json = JSON.parse(Get("https://maps.googleapis.com/maps/api/geocode/json?address=" + s_location + "&key=" + api_key));
    var geo_loc = loc_json.results[0].geometry.location;

    map = new google.maps.Map(document.getElementById("map"), {
        center: geo_loc,
        zoom: 12,
        mapTypeControlOptions: {
            mapTypeIds: ["roadmap", "satellite"]
        },
    });

    addPostings()
}

function addPostings() {
    //GET PARAMS WITH FETCH, temp json:
    fetch_json = 
        [
            {
                "title": "Help Me Hack! 1",
                "description": "Please someone come help me",
                "location": {"lat": 30.27235125, "lng": -97.7150332},
                "price": [10, 20],
                "author": "Ethan Lao"
            },
            {
                "title": "Help Me Hack! 2",
                "description": "Please someone come help me",
                "location": {"lat": 30.2439245, "lng": -97.7412125},
                "price": [10, 20],
                "author": "Caleb Park"
            },
            {
                "title": "Help Me Hack! 3",
                "description": "Please someone come help me",
                "location": {"lat": 30.26232355, "lng": -97.723523},
                "price": [10, 20],
                "author": "Helen Fang"
            },
            {
                "title": "Help Me Hack! 4",
                "description": "Please someone come help me",
                "location": {"lat": 30.245126, "lng": -97.73125241},
                "price": [10, 20],
                "author": "Edward Zhou"
            },
            {
                "title": "Help Me Hack! 5",
                "description": "Please someone come help me",
                "location": {"lat": 30.2825125, "lng": -97.75125152},
                "price": [10, 20],
                "author": "Ethan Lao"
            },
        ];

    var postings = document.getElementById("postings");

    for (posting of fetch_json) {
        //add div
        console.log(posting);

        let post_div = document.createElement("div");
        post_div.classList.add("posting");

        post_div.addEventListener("mouseover", mouseover_post);
        post_div.addEventListener("mouseout", mouseout_post);

        let post_row = document.createElement("div");
        post_row.classList.add("post-row")

        let post_title = document.createElement("div");

        postings.appendChild(post_div);

        //draw onto the map
        let marker = new google.maps.Marker({
            position: posting.location,
            map,
            draggable: true,
            animation: google.maps.Animation.DROP,
            title: posting.title,
        });

        console.log(marker);
        marker.addListener("click", markerClick);
    }
}

function get_distance(loc1, loc2) {

}

function markerClick() {
  if (this.getAnimation() !== null) {
    this.setAnimation(null);
  } else {
    this.setAnimation(google.maps.Animation.BOUNCE);
  }
}

function mouseover_post() {
    console.log("mouseover");
}

function mouseout_post() {
    console.log('mouseout');
}

function Get(yourUrl){
    var Httpreq = new XMLHttpRequest(); // a new request
    Httpreq.open("GET",yourUrl,false);
    Httpreq.send(null);
    return Httpreq.responseText;          
}

