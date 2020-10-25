let api_key = "AIzaSyCOMxTQ8uWeUUxYOaciOHRwEsaWCA0eQeQ";

let map;
let s_keywords, s_location, s_radius;
let s_latlng;
var markers = [];

function initSearch() {
    //First get search attributes
    let search_param = window.location.search.split("&");
    s_keywords = search_param[0].split("=")[1].split("+");
    s_location = search_param[1].split("=")[1];
    
    var postings = document.getElementById("postings");
    postings.textContent = '';

    let search_header = document.createElement('h3');
    search_header.id = 'search-disp';
    search_header.innerHTML = "Search results near " + s_location.split("+").join(" ").split("%20").join(" ");
    postings.appendChild(search_header);

    if (displayMap(s_location) == null) {
        return;
    }

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
    
    if (loc_json.results[0] == undefined) {
        return null;
    }
    
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

/* display options for individual postings */
const display_search = 0;
const display_mine = 1;

function displayMyPostings(fetch_json) {
    var postings = document.getElementById("postings");

    if (postings.length !== 0) {
        displayMap("Austin, TX");
    }

    for (posting of fetch_json) {
        let corr_mark = addMarker(posting.location, posting.title, posting.pay);
        createPosting(posting, postings, display_mine, corr_mark)
    }
    zoom_to_fit_bounds();
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
            zoom_to_fit_bounds();
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
        zIndex: 1,
        cursor: mouse_shape
    });

    marker.addListener("mouseover", mouseover_marker);
    marker.addListener("mouseout", mouseout_marker);
    if (!is_single) {
        marker.addListener("click", markerClick);
    }

    markers.push(marker);

    return marker;
}

function zoom_to_fit_bounds() {
    let bounds = new google.maps.LatLngBounds();
    for (let i = 0; i < markers.length; i++) {
        bounds.extend(markers[i].getPosition());
    }

    map.fitBounds(bounds);
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

    marker.setZIndex(marker.getZIndex() + 1);
}

function mouseout_post() {
    let marker = d3.select(this).data()[0];
    let new_icon = marker.getIcon();
    new_icon.fillColor = "white";
    marker.setIcon(new_icon);

    let new_label = marker.getLabel();
    new_label.color = "black";
    marker.setLabel(new_label);

    marker.setZIndex(marker.getZIndex() - 1);
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

    marker.setZIndex(marker.getZIndex() + 1);
}

function mouseout_marker() {
    let marker = this;
    let new_icon = marker.getIcon();
    new_icon.fillColor = "white";
    marker.setIcon(new_icon);

    let new_label = marker.getLabel();
    new_label.color = "black";
    marker.setLabel(new_label);

    marker.setZIndex(marker.getZIndex() - 1);
}

function Get(yourUrl){
    var Httpreq = new XMLHttpRequest(); // a new request
    Httpreq.open("GET", yourUrl, false);
    Httpreq.send(null);
    return Httpreq.responseText;          
}

function goto_job_post() {

}

