//Purpose: Control signup/login flow on the anonymous homepage

async function login() {
  try {
    const url = "http://localhost:3000/login";

    let username = document.getElementById("uname-login").value;
    let password = document.getElementById("pword-login").value;
    console.log(username + password);


    const Data = {
      username: username,
      password: password
    };

    //first response is http, second is the json data
    let response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Data) });

    //check if login is successful
    if (response.status === 200) {
      //go to homepage
      window.location.href = '/';
    } else {
      //Show user to try again --TODO: Make prettier
      console.log("Error logging in");
    }

  } catch (e) {
    console.log(e);
  }
}

async function signup() {
  try {
    const url = "http://localhost:3000/user";

    let email = document.getElementById("email").value;
    let username = document.getElementById("uname-signup").value;
    let password = document.getElementById("pword-signup").value;
    console.log(email + username + password);


    const Data = {
      email: email,
      username: username,
      password: password
    };

    //first response is http, second is the json data
    let response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Data) });

    //TODO: Send http request to login instead of redirect like this
    if (response.status === 201) {
      //go to the homepage
      window.location.href = '/';
    } else {
      console.log("Error");
    }
  } catch (e) {
    console.log(e);
  }
}

function displaySignup(e) {
  //show the signup 
  let signupKids = document.getElementById('signup-div').children;

  for (let i = 0; i < signupKids.length; i++) {
    signupKids[i].style.display = "block";
  }

  //hide the login 
  let loginKids = document.getElementById('login-div').children;

  for (let i = 0; i < loginKids.length; i++) {
    loginKids[i].style.display = "none";
  }
}

function displayLogin(e) {
  //show the login 
  let loginKids = document.getElementById('login-div').children;

  for (let i = 0; i < loginKids.length; i++) {
    loginKids[i].style.display = "block";
  }

  //hide the signup 
  let signupKids = document.getElementById('signup-div').children;

  for (let i = 0; i < signupKids.length; i++) {
    signupKids[i].style.display = "none";
  }


}


//set event listeners
document.getElementById("signup", signup).addEventListener("click", signup);
document.getElementById("login").addEventListener("click", login);
document.getElementById("show-signup").addEventListener("click", displaySignup);
document.getElementById("show-login").addEventListener("click", displayLogin);

//window loading
window.onload = function () {
  //hide the signup 
  let signupKids = document.getElementById('signup-div').children;

  for (let i = 0; i < signupKids.length; i++) {
    signupKids[i].style.display = "none";
  }

  //stylize the signup span
  let span = document.getElementById("show-signup");
  span.style.color = "blue";
  span.style.textDecoration = "underline";
  span.style.cursor = "pointer";

  //stylize the login span
  span = document.getElementById("show-login");
  span.style.color = "blue";
  span.style.textDecoration = "underline";
  span.style.cursor = "pointer";
}

