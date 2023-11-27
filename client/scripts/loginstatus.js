

// Cookie her:

let accountName = getCookie("userAuth");
//if (!username) location.href = "/login";

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

let loginButton = document.getElementById("login_knap");
let registerButton = document.getElementById("register_knap");
let logoutButton = document.getElementById("logout_knap");
let usernameButton = document.getElementById("username_knap");

// Hvis brugeren er logget ind, vises brugernavn og logout-knap, ellers vises login og register-knap
if (accountName) {
    loginButton.style.display = "none";
    registerButton.style.display = "none";
    logoutButton.style.display = "block";
    usernameButton.style.display = "block";
    usernameButton.innerHTML = accountName;

} else {
    loginButton.style.display = "block";
    registerButton.style.display = "block";
    logoutButton.style.display = "none";
    usernameButton.style.display = "none";
}

/* usernameDisplays.forEach(element => {
      element.innerHTML = username;
    }); */
