const btnLogin = document.getElementById("btn-login");
const message = document.getElementById("message");

const verifyChamp = () => {
  const code = document.getElementById("code").value;
  const password = document.getElementById("password").value;
  const message = document.getElementById("message");

  if (!code) {
    message.innerHTML = "Veuillez renseigner votre code personnel";
    return false;
  }

  if (!password) {
    message.innerHTML = "Veuillez renseigner votre mot de passe";
    return false;
  }
  return true;
};

const login = async () => {
  if (verifyChamp() === true) {
    message.style.color = "green";
    message.innerHTML = "Connexion...";

    const code = document.getElementById("code").value;
    const password = document.getElementById("password").value;

    const data = {
      code,
      password,
    };

    const url = "http://localhost:3000/api/v1/users/login";

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
        switch (result.data.role) {
          case "admin":
            localStorage.setItem("token", result.token);
            localStorage.setItem("role", result.data.role);
            setInterval(() => {
              window.location.href = "admin/index.html";
            }, 1000);
            console.log("admin");

            break;

          case "RespInspection":
            console.log("RespInspection");
            break;

          case "RespProduction":
            console.log("RespProduction");
            break;
          default:
            console.log("impossible");
            break;
        }
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
