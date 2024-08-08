const userRole = document.getElementById("user");
const btnLogout = document.getElementById("logout");
const message = document.getElementById("message");
const registerBtn = document.getElementById("register-producteur");
const receiveProduction = document.getElementById("receive-production");

userRole.innerHTML = localStorage.getItem("role");
btnLogout.addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "../connexion-personnel.html";
});

const verifyChamp = () => {
  const code = document.getElementById("code").value;
  const nom = document.getElementById("nom").value;
  const prenom = document.getElementById("prenom").value;
  const password = document.getElementById("password").value;
  const message = document.getElementById("message");

  message.style.color = "red";

  if (!code) {
    message.innerHTML = "Veuillez renseigner le code personnel";
    return false;
  }
  if (!nom) {
    message.innerHTML = "Veuillez renseigner le nom";
    return false;
  }
  if (!prenom) {
    message.innerHTML = "Veuillez renseigner le prenom";
    return false;
  }
  if (!password) {
    message.innerHTML = "Veuillez renseigner le mot de passe";
    return false;
  }
  return true;
};

const registerProducteur = () => {
  const code = document.getElementById("code").value;
  const nom = document.getElementById("nom").value;
  const prenom = document.getElementById("prenom").value;
  const password = document.getElementById("password").value;
  const role = "RespProduction";
  const message = document.getElementById("message");

  const data = {
    code,
    nom,
    prenom,
    role,
    password,
  };
  if (verifyChamp() === true) {
    fetch("http://localhost:3000/api/v1/users/save-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (result.status === true) {
          message.innerHTML = "Inscription reussie";
          message.style.color = "green";
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          message.innerHTML = result.message;
          message.style.color = "red";
        }
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  }
};

const fetchProductions = async () => {
  try {
    const url = "http://localhost:3000/api/v1/users/get-all-users";

    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };

    const response = await fetch(url, options);
    const productions = await response.json();
    console.log(productions);

    if (productions.status === true) {
      if (productions.data.length === 0) {
        receiveProduction.innerHTML = `
                <div class="w-full bg-card p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl flex justify-center items-center">
                  <h3 class="text-2xl font-semibold text-red-600 text-center">Aucun producteur</h3>
                </div>
                `;
      } else {
        productions.data.filter((producteur) => {
          if (producteur.role === "RespProduction") {
            receiveProduction.innerHTML += `
                  <div
                     class="bg-card p-6  flex flex-col items-center justify-center rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl"
                  >
                    <img
                      src="../../assets/img/personne.png"
                      alt="producteur 1"
                      class="mb-4 rounded-lg mg-auto"
                      width="300"
                      height="200"
                    />
                    <h3 class="text-2xl font-semibold text-red-600">${producteur.code}</h3>
                    <p class="text-s text-muted-foreground">Nom: ${producteur.nom}</p>
                    <p class="text-sm text-muted-foreground">Prénom: ${producteur.prenom}</p>
                    <br />
                    <p class="text-sm text-muted-foreground text-red-600 cursor-pointer" onclick="deleteProducteur('${producteur._id}')">Supprimer</p>
  
                  </div>
                  `;
          }
        });
      }
    }
    return productions;
  } catch (error) {
    console.error(error);
  }
};
fetchProductions();

const deleteProducteur = async (id) => {
  console.log(id);
  const url = `http://localhost:3000/api/v1/users/delete-user/${id}`;
  const options = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };
  try {
    const response = await fetch(url, options);
    const result = await response.json();
    console.log(result);

    if (result.status === true) {
      alert("Producteur supprimé");
      window.location.reload();
    }
  } catch (error) {
    console.log(error);
  }
};

registerBtn.addEventListener("click", (e) => {
  e.preventDefault();
  registerProducteur();
});
