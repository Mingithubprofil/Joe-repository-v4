

let responseDOM = document.getElementById("response");

let user = {};

function wait(time) {
  return new Promise(resolve => {
    setTimeout(resolve, time*1000);
    
  });
}


//login funktion

function loginUser() {
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;

  user.username = username;
  user.password = password;

  axios
    .post("http://188.166.200.199/login", user)
    .then(async function (response) {
      console.log(response.data);
      if (response.data == "User logged in") {
        // localStorage.setItem("Username", username);
        document.cookie = `userAuth=${username}`
      }

      // Redirect:
      responseDOM.innerHTML = response.data;

      await wait(3)
      location.href = "/userHome";
    })
    .catch(function (error) {
      console.log(error);
    });
}


//logud funktion

function logoutUser() {
  // Fjern brugerens autentificeringscookie
  document.cookie = 'userAuth=; expires= 0; path=/;';

  // Redirect til login-siden eller hvor du ønsker
  location.href = "/login";
}





