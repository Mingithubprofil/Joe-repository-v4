

let user = {};


let responseDOM = document.getElementById("response");


//til at afvente få sekunder før redirect til userhome-page
function wait(time) {
  return new Promise(resolve => {
    setTimeout(resolve, time*1000);
    
  });
}


// Login funktion
async function loginUser() {
  try {
    let username = document.getElementById("username").value;
    let password = document.getElementById("Kodeord").value;

    console.log("Sending login request with username:", username);

    const response = await axios.post("/login", JSON.stringify({
      username,
      password,
    }), {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000, 
    });

    //console.log(response.data);

    if (response.data.userExists) {
      // Hvis brugeren eksisterer, udfør login
      // localStorage.setItem("Username", username);
      document.cookie = `userAuth=${username}`;
      console.log(document.cookie);

      // Redirect og opdater DOM
      responseDOM.innerHTML = response.data.message;
      await wait(3);
      window.location.replace("/userHome");
    } else {
      responseDOM.innerHTML = "Brugeren er ikke registreret.";
    }
  } catch (error) {
    console.error("Fejl ved login eller tjek af brugere:", error.message);
    responseDOM.innerHTML = "Der opstod en fejl ved login eller brugertjek. Tjek konsollen for detaljer.";
  }
}


//logud funktion

function logoutUser() {
  // Fjern brugerens autentificeringscookie
  document.cookie = 'userAuth=; expires= 0; path=/;';

  // Redirect til login-siden eller hvor du ønsker
  location.href = "/login";
}







