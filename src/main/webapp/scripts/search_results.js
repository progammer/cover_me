let api_key = "AIzaSyCOMxTQ8uWeUUxYOaciOHRwEsaWCA0eQeQ";

let map;
let s_keywords, s_location, s_radius;
let s_latlng;

function initSearch() {
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
    var postings = document.getElementById("postings");
    postings.textContent = '';

    let search_header = document.createElement('h3');
    search_header.id = 'search-disp';
    search_header.innerHTML = "Search results near " + s_location.split("+").join(" ");
    postings.appendChild(search_header);

    displayMap(s_location);

    addPostingsFromSearch();
}

function initMy() {
    let location = "Austin+TX"; // change this later as needed
    let search_header = document.createElement('h3');
    search_header.id = 'search-disp';
    search_header.innerHTML = 'My posted jobs';

    var postings = document.getElementById("postings");
    postings.textContent = '';
    postings.appendChild(search_header);

    displayMap(location);

    displayMyPostings();
}

function initView() {
    let location = document.getElementById('job-address').innerText;
    let title = document.getElementById('job-name').innerText;

    let geo_loc = displayMap(location.split(' ').join('+'));
    addMarker(geo_loc, title);

}

function displayMap(location) {
    var loc_json = JSON.parse(Get("https://maps.googleapis.com/maps/api/geocode/json?address=" + location + "&key=" + api_key));
    var geo_loc = loc_json.results[0].geometry.location;
    s_latlng = geo_loc;

    map = new google.maps.Map(document.getElementById("map"), {
        center: geo_loc,
        zoom: 12,
        mapTypeControlOptions: {
            mapTypeIds: ["roadmap", "satellite"]
        },
    });
    return geo_loc;
}

//GET PARAMS WITH FETCH, temp json:
let fetch_json = 
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
                "author": "Ethan Lao"
            },
        ];


/* display options for individual postings */
const display_search = 0;
const display_mine = 1;

function displayMyPostings(fetch_json) {
    var postings = document.getElementById("postings");

    for (posting of fetch_json) {
        console.log(posting);

        createPosting(posting, postings, display_mine)
        addMarker(posting.location, posting.title);
    }
}

function addPostingsFromSearch() {
    var postings = document.getElementById("postings");
    var count = 1;
    for (posting of fetch_json) {
        // posting.distance = get_distance(s_latlng, posting.location);
        posting.distance = count;
        count ++;
    }

    // sort in order of distance
    fetch_json.sort((a, b) => (a.distance > b.distance) ? 1 : -1)

    for (posting of fetch_json) {
        console.log(posting);

        createPosting(posting, postings, display_search);

        addMarker(posting.location, posting.title);
    }
}

// creates a posting item from JSON and adds it to posting list
function createPosting(posting, postingsList, option) {
    let post_div = document.createElement("div");
    post_div.classList.add("posting");

    post_div.addEventListener("mouseover", mouseover_post);
    post_div.addEventListener("mouseout", mouseout_post);

    /* create box w/ title and description */
    let post_title = document.createElement('div');
    post_title.classList.add('posting-title');
    post_title.innerText = posting.title;
    let post_desc = document.createElement('div');
    post_desc.classList.add('posting-desc');
    post_desc.innerText= posting.description;
    let post_details = document.createElement("div");
    post_details.classList.add('posting-details');
    post_details.appendChild(post_title);
    post_details.appendChild(post_desc);

    let post_dist = document.createElement('div');
    post_dist.classList.add('posting-distance');
    let post_price = document.createElement('div');
    post_price.classList.add('posting-price');

    let price = 'Negotiable';
    if (posting.price != null) {
        price = '$' + posting.price[0] + ' - ' + '$' + posting.price[1];
    }
    
    if(option == display_search) {
        // display distance and then price
        if (posting.distance)
            post_dist.innerText = posting.distance + ' miles away';
        else
            post_dist.innerText = 'Remote job';
        post_price.innerText = price;
    } else if (option == display_mine) {
        post_dist.innerText = price;
        post_price.innerText = 'Remove Listing';
        post_price.onclick = function() {
            // remove listing
        };
    }

    post_div.appendChild(post_details);
    post_div.appendChild(post_dist);
    post_div.appendChild(post_price);
    postingsList.appendChild(post_div);
}

function addMarker(location, title) {
    let marker = new google.maps.Marker({
        position: location,
        map,
        draggable: true,
        animation: google.maps.Animation.DROP,
        title: title,
    });

    console.log(marker);
    marker.addListener("click", markerClick);
}

function get_distance(loc1, loc2) {
    let lat1 = loc1.lat;
    let lng1 = loc1.lng;
    let lat2 = loc2.lat;
    let lng2 = loc2.lng;
    
    return Math.sqrt(Math.pow(lat1 - lat2, 2) + Math.pow (lng1 - lng2, 2));
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
    Httpreq.open("GET", yourUrl, false);
    Httpreq.send(null);
    return Httpreq.responseText;          
}

