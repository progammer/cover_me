document.getElementById('search-bar').onkeypress = function(e){
    if (!e) e = window.event;
    var keyCode = e.keyCode || e.which;
    if (keyCode == '13'){
        submit_search();
    }
}

function submit_search() {
    window.location.href = "search_results.html?q=" + document.getElementById('job_type').value
        + "&location=" + document.getElementById('location').value;
}