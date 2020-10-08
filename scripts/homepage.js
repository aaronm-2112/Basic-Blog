//Purpose: Control signup/login flow on the anonymous homepage

const BASE_URL = document.currentScript.getAttribute('base_url')
console.log(BASE_URL)


async function login() {
  try {
    const url = `${BASE_URL}/login`;

    let username = document.getElementById("uname-login").value;
    let password = document.getElementById("pword-login").value;


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
    const url = `${BASE_URL}/users`;

    let email = document.getElementById("email").value;
    let username = document.getElementById("uname-signup").value;
    let password = document.getElementById("pword-signup").value;


    const Data = {
      email: email,
      username: username,
      password: password
    };

    //first response is http, second is the json data
    let response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Data) });

    //TODO: Send http request to login instead of redirect like this
    if (response.status === 201) {
      //display the login
      displayLogin();
    } else {
      console.log("Error");
    }
  } catch (e) {
    console.log(e);
  }
}

function displaySignup() {
  //show the signup 
  let signupKids = document.getElementById('signup-div').children;

  for (let i = 0; i < signupKids.length; i++) {
    signupKids[i].style.display = "block";
  }

  hideLogin();
}

function displayLogin() {
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

function hideLogin() {
  //hide the login 
  let loginKids = document.getElementById('login-div').children;

  for (let i = 0; i < loginKids.length; i++) {
    loginKids[i].style.display = "none";
  }
}


//set event listeners
document.getElementById("signup", signup).addEventListener("click", signup);
document.getElementById("login").addEventListener("click", login);
document.getElementById("show-signup").addEventListener("click", displaySignup);
document.getElementById("show-login").addEventListener("click", displayLogin);

//window loading
window.onload = function () {


  //check of the profile navigation link exists
  let links = document.querySelector('nav').children;
  console.log(links);

  if (links.length >= 3) {
    //disable login
    hideLogin();
  }

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

