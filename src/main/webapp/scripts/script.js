function checkLogin(doAfter) {
    fetch('/login').then((response) => response.json()).then(function(result) {
        console.log(result.url);
        console.log(result.action);
        let login_field = document.getElementById('user-info');
        login_field.textContent = "";
        let link = document.createElement('a');
        link.href = result.url;

        if(result.action == 'login') {
            // url is a login url
            link.innerText = 'Login';
        } else {
            // url is a logout url
            let email = result.email;
            link.innerText = 'Logout'
            let welcome = document.createElement('span');
            welcome.innerText = 'Hello, ' + result.email + '! ';
            login_field.appendChild(welcome);
        }
        login_field.appendChild(link);
    });
    if(doAfter) {
        doAfter();
    }
}

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