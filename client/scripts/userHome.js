

let username = getCookie("userAuth");
document.querySelector("username_on_page").innerHTML = `Welcome ${username}!`
if (!username) location.href = "/login";









