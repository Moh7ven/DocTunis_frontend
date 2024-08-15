const btnLogin = document.getElementById("btn-login");
const message = document.getElementById("message");

const verifyChamp = () => {
  const code = document.getElementById("code").value;
  const message = document.getElementById("message");

  if (!code) {
    message.innerHTML = "Veuillez renseigner votre code personnel";
    return false;
  }
  return true;
};

const login = async () => {
  if (verifyChamp() === true) {
    message.style.color = "green";
    message.innerHTML = "Connexion...";

    const code = document.getElementById("code").value;

    const data = {
      code,
    };

    const url = "http://localhost:3000/api/v1/membre-jurys/login-membre-jury";

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    try {
      const response = await fetch(url, options);
      const result = await response.json();
      console.log(result.token);

      if (result.status === true) {
        localStorage.setItem("tokenMembreJurys", result.token);
        setInterval(() => {
          window.location.href = "./acceuil-membre-jurys.html";
        }, 1000);
      } else {
        message.style.color = "red";
        message.innerHTML = result.message;
      }
    } catch (error) {
      console.log(error);
    }
  }
};

btnLogin.addEventListener("click", (e) => {
  e.preventDefault();
  login();
});
