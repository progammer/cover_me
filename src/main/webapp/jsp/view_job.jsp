<html>
    <head>
        <meta charset="UTF-8">
        <title>coverme</title>
        <link id="style" rel="stylesheet" href="../styles/style.css">
        <link rel="stylesheet" href="../styles/header.css">        
        <link rel="stylesheet" href="../styles/view_job.css">
        <link rel="stylesheet" href="../styles/job_post.css">
        <script src="https://polyfill.io/v3/polyfill.min.js?features=default"></script>
        <script
        src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCOMxTQ8uWeUUxYOaciOHRwEsaWCA0eQeQ&callback=initView&libraries=&v=weekly"
        defer
        ></script>
        <script src="../scripts/script.js"></script>
        <script src="../scripts/search_results.js"></script>
        <script src="../scripts/header_search.js"></script>
    </head>
    <body onload="checkLogin()">
        <div id="header">
            <div id="logo" onclick="window.location.href='index.html';"><div>coverme&#9829;</div></div>
            <div id="search-bar">
                <input type="text" class="search-bar left" placeholder="find a job to cover...">
                <input type="text" class="search-bar right" placeholder="Location">
                <img onclick="submit_search()" class="search-button" src="images/search.png"/>
            </div>
            <div id="user-info">
                <div>Loading...</div>
            </div>
        </div>

        <div class="main-row">
            <div class="main-column job-post view-post">
                <div id="job-name">${title}</div>
                <div id="job-desc">${description}</div>
                <div class="form-section">
                    <label id="category-label" for="category">Job Category: </label>
                    <span>${category}</span>
                </div>
                <div class="form-section">
                    <label id="budget-label" for="budget">Maximum Budget: </label>
                    <span id="pay">${pay}</span>
                </div>
                <div class="form-section">
                    <label id="contact-label" for="contact">Contact Info</label><br>
                    <label for="phone">Phone #: </label>
                    <span>${phone}</span><br>
                    <label for="email">Email: </label>
                    <span>${email}</span>
                </div>
                <div class="form-section">
                    <label id="address-label" for="address">Job Location</label>
                    <span id="job-address">${address}</span>
                </div>
            </div>
            <div id="map" class="main-column"></div>

        </div>
    </body>
</html>