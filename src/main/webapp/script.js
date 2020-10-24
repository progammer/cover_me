function serverExample() {
    fetch('/servlet').then((response) => response.json())
      .then(function(responseJson) {
        // do something with json output of html response
      });


      const params = new URLSearchParams();
      params.append('param', 'test'); // can add parameters to html request
      fetch(new Request('/servlet', {method: 'POST', body: params}))
          .then(function(responseText) {
        // do something with text output of html response
      });

}