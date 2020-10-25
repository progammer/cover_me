function checkLogin(doAfter) {
    fetch('/login').then((response) => response.json()).then(function(result) {
        console.log(result.url);
        console.log(result.action);
        let login_field = document.getElementById('user-info');
        login_field.textContent = "";
        let link = document.createElement('a');
        login_field.appendChild(link);

        if(result.action == 'login') {
            // url is a login url
            link.innerText = 'Login';
            link.href = result.url;

        } else {
            // url is a logout url
            let email = result.email;
            link.innerText = 'Hello, ' + email + '! ';
            login_field.style.cursor = 'pointer';

            let dropdown = document.createElement('div');
            dropdown.id = 'dropdown';
            login_field.appendChild(dropdown);

            let child1 = document.createElement('a');
            child1.classList.add('dropdown-item');
            child1.href = '/posting.html';
            child1.innerText = 'Post a job';

            let child2 = document.createElement('a');
            child2.classList.add('dropdown-item');
            child2.href = '/my.html';
            child2.innerText = 'My Job Postings';

            let child3 = document.createElement('a');
            child3.classList.add('dropdown-item');
            child3.href = result.url;
            child3.innerText = 'Logout';

            dropdown.appendChild(child1);
            dropdown.appendChild(child2);
            dropdown.appendChild(child3);


            login_field.onclick = function() {
                console.log('click');
                if (document.getElementById('dropdown').classList.contains('clicked')) {
                    document.getElementById('dropdown').classList.remove('clicked');
                } else {
                    document.getElementById('dropdown').classList.add('clicked');
                }
            };
        }
        
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
