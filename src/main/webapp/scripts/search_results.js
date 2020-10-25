let api_key = "AIzaSyCOMxTQ8uWeUUxYOaciOHRwEsaWCA0eQeQ";

let map;
let s_keywords, s_location, s_radius;
let s_latlng;

function initSearch() {
    //First get search attributes
    let search_param = window.location.search.split("&");
    s_keywords = search_param[0].split("=")[1].split("+");
    s_location = search_param[1].split("=")[1];
    
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
    getMyPosts();

}

function getMyPosts() {
    fetch('/my_posts').then((response) => response.json())
    .then(function(responseJson) {
        if (responseJson) {
            displayMyPostings(responseJson);
        } else {
            document.getElementById('no-posts').innerHTML = "ree";
        }
    });
}

function initView() {
    let location = document.getElementById('job-address').innerText;
    let title = document.getElementById('job-name').innerText;

    let budget = document.getElementById('pay').innerText.replace("\$", "");

    let geo_loc = displayMap(location.split(' ').join('+'));
    addMarker(geo_loc, title, budget, true);

    document.getElementById('pay').innerText = '$' + budget;

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
                "lat": 30.27235125, "lng": -97.7150332,
                "location": {"lat": 30.27235125, "lng": -97.7150332},
                "pay": 10,
                "author": "Ethan Lao"
            },
            {
                "title": "Help Me Hack! 2",
                "description": "Please someone come help me",
                "location": {"lat": 30.2439245, "lng": -97.7412125},
                "pay": 40,
                "author": "Caleb Park"
            },
            {
                "title": "Help Me Hack! 3",
                "description": "Please someone come help me",
                "location": {"lat": 30.26232355, "lng": -97.723523},
                "pay": 45,
                "author": "Helen Fang"
            },
            {
                "title": "Help Me Hack! 4",
                "description": "Please someone come help me",
                "location": {"lat": 30.245126, "lng": -97.73125241},
                "pay": 59.50,
                "author": "Edward Zhou"
            },
            {
                "title": "Help Me Hack! 5",
                "description": "Please someone come help me",
                "location": {"lat": 30.2825125, "lng": -97.75125152},
                "pay": 51.25,
                "author": "Ethan Lao"
            },
        ];


/* display options for individual postings */
const display_search = 0;
const display_mine = 1;

function displayMyPostings(fetch_json) {
    var postings = document.getElementById("postings");

    for (posting of fetch_json) {
        let corr_mark = addMarker(posting.location, posting.title, posting.pay);
        createPosting(posting, postings, display_mine, corr_mark)
    }
}

function addPostingsFromSearch() {
    var postings = document.getElementById("postings");

    let rec_json;
    const params = new URLSearchParams();
    params.append('keywords', s_keywords);
    params.append('lat', s_latlng.lat);
    params.append('lng', s_latlng.lng);
    fetch(new Request('/search', {method: 'POST', body: params})).then(response => response.json())
        .then(function(responseJson) {
            console.log(responseJson);
            rec_json = responseJson;

            // for (posting of rec_json) {
            //     posting.distance = get_distance(s_latlng, posting.location);
            // }

            // sort in order of distance
            // rec_json.sort((a, b) => (a.distance > b.distance) ? 1 : -1)

            for (posting of rec_json) {
                let corr_mark = addMarker(posting.location, posting.title, posting.pay);
                createPosting(posting, postings, display_search, corr_mark);
            }
    });

    
}

// creates a posting item from JSON and adds it to posting list
function createPosting(posting, postingsList, option, corr_mark) {
    let post_div = document.createElement("div");
    post_div.classList.add("posting");

    d3.select(post_div).data([corr_mark])

    post_div.addEventListener("mouseover", mouseover_post);
    post_div.addEventListener("mouseout", mouseout_post);
    post_div.addEventListener("click", click_post);

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
    if (posting.pay != null) {
        if(String(posting.pay).indexOf('$') >= 0)
            price = posting.pay;
        else price = '$' + posting.pay;
    }
    
    if(posting.id == null) {
        posting.id = 1234; // dummy id
    }

    if(option == display_search) {
        // display distance and then price
        if (posting.distance === undefined)
            post_dist.innerText = 'Remote job';
        else
            post_dist.innerText = posting.distance + ' mi';
        post_price.innerText = price;
        post_price.onclick = function() {
            window.location.href = '/show?id=' + posting.id;
        };
        
    } else if (option == display_mine) {
        post_dist.innerText = price;
        post_price.innerText = 'Remove Listing';
        post_price.onclick = function() {
            // remove listing
            fetch('/delete?id=' + posting.id).then(window.location.href = 'my.html');
        };
    }

    console.log("id: " + posting.id);

    post_div.appendChild(post_details);
    post_div.appendChild(post_dist);
    post_div.appendChild(post_price);

    post_dist.onclick = function() {
        window.location.href = '/show?id=' + posting.id;
    };
    post_details.onclick = function() {
        window.location.href = '/show?id=' + posting.id;
    };
    postingsList.appendChild(post_div);
}

function addMarker(location, title, pay, is_single) {
    let mouse_shape = "pointer";
    if (is_single) {
        mouse_shape = "default";
    }

    let marker = new google.maps.Marker({
        position: location,
        map,
        title: title,
        icon: {
            path: 0,
            fillColor: "white",
            fillOpacity: 1,
            scale: 18,
            strokeWeight: .5,
            strokeColor: "lightgray",
        },
        label: {
            color: 'black',
            fontWeight: 'bold',
            fontSize: '14px',
            text: "$" + parseInt(pay)
        },
        cursor: mouse_shape
    });

    marker.addListener("mouseover", mouseover_marker);
    marker.addListener("mouseout", mouseout_marker);
    if (!is_single) {
        marker.addListener("click", markerClick);
    }

    return marker;
}

function get_distance(loc1, loc2) {
    let lat1 = loc1.lat;
    let lon1 = loc1.lng;
    let lat2 = loc2.lat;
    let lon2 = loc2.lng;
  
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1); 
    var a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2)
        ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    
    return Math.round(d * 1.60934 * 100) / 100; //distance in mi
}

function deg2rad(deg) {
    return deg * (Math.PI/180)
}

function markerClick() {
    goto_job_post();
}

function mouseover_post() {
    let marker = d3.select(this).data()[0];
    let new_icon = marker.getIcon();
    new_icon.fillColor = "black";
    marker.setIcon(new_icon);

    let new_label = marker.getLabel();
    new_label.color = "white";
    marker.setLabel(new_label);
}

function mouseout_post() {
    let marker = d3.select(this).data()[0];
    let new_icon = marker.getIcon();
    new_icon.fillColor = "white";
    marker.setIcon(new_icon);

    let new_label = marker.getLabel();
    new_label.color = "black";
    marker.setLabel(new_label);
}

function click_post() {
    goto_job_post();
}

function mouseover_marker() {
    let marker = this;
    let new_icon = marker.getIcon();
    new_icon.fillColor = "black";
    marker.setIcon(new_icon);

    let new_label = marker.getLabel();
    new_label.color = "white";
    marker.setLabel(new_label);
}

function mouseout_marker() {
    let marker = this;
    let new_icon = marker.getIcon();
    new_icon.fillColor = "white";
    marker.setIcon(new_icon);

    let new_label = marker.getLabel();
    new_label.color = "black";
    marker.setLabel(new_label);
}

function Get(yourUrl){
    var Httpreq = new XMLHttpRequest(); // a new request
    Httpreq.open("GET", yourUrl, false);
    Httpreq.send(null);
    return Httpreq.responseText;          
}

function goto_job_post() {

}

