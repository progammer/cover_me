function serverExample() {
    fetch('/test').then((response) => response.json())
      .then(function(responseJson) {
        // do something with json output of html response
      });


      const params = new URLSearchParams();
      params.append('param', 'test'); // can add parameters to html request
      fetch(new Request('/test', {method: 'POST', body: params})).then((response) => response.text())
          .then(function(responseText) {
        // do something with text output of html response
      });

}

function home() {
   window.location.href = "index.html";
}​;​
