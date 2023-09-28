let responseDOM = document.getElementById("response");

let user = {};

function wait(time) {
  return new Promise(resolve => {
    setTimeout(resolve, time*1000);
    
  });
}

function loginUser() {
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;

  user.username = username;
  user.password = password;

  axios
    .post("http://localhost:3000/login", user)
    .then(async function (response) {
      console.log(response.data);
      if (response.data == "User logged in") {
        // localStorage.setItem("Username", username);
        document.cookie = `userAuth=${username}`
      }

      // Redirect:
      responseDOM.innerHTML = response.data;

      await wait(3)
      location.href = "/home";
    })
    .catch(function (error) {
      console.log(error);
    });
}
