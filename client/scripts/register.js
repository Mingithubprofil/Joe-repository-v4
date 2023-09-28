let responseDOM = document.getElementById("response")

let user = {}

function wait(time) {
  return new Promise(resolve => {
    setTimeout(resolve, time*1000);
    
  });
}

function saveUser(){
    let username = document.getElementById("username").value
    let email = document.getElementById("email").value
    let password = document.getElementById("password").value
    
    user.username = username
    user.email = email
    user.password = password

    console.log(user)

    axios.post('http://localhost:3000/user', user)
    .then(async function (response) {
      console.log(response);
      responseDOM.innerHTML = response.data
      await wait(3)
      location.href = "/login"
    })
    .catch(function (error) {
      console.log(error);
    });

}

