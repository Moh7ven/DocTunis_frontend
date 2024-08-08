const userRole = document.getElementById("user");
const btnLogout = document.getElementById("logout");
const receiveProduction = document.getElementById("receive-production");
const registerBtn = document.getElementById("register-producteur");
const btnModif = document.getElementById("modif-producteur");

userRole.innerHTML = localStorage.getItem("role");
btnLogout.addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "../connexion-personnel.html";
});

const verifyChamp = () => {
  const code = document.getElementById("code").value;
  const nom = document.getElementById("nom").value;
  const prenom = document.getElementById("prenom").value;
  const dateNaissance = document.getElementById("date").value;
  const message = document.getElementById("message");

  message.style.color = "red";

  if (!code) {
    message.innerHTML = "Veuillez renseigner le code ";
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
  if (!dateNaissance) {
    message.innerHTML = "Veuillez renseigner le mot de passe";
    return false;
  }
  return true;
};
const registerProducteur = () => {
  const code = document.getElementById("code").value;
  const nom = document.getElementById("nom").value;
  const prenom = document.getElementById("prenom").value;
  const dateNaissance = document.getElementById("date").value;
  const message = document.getElementById("message");

  const data = {
    code,
    nom,
    prenom,
    dateNaissance,
  };
  if (verifyChamp() === true) {
    fetch("http://localhost:3000/api/v1/producteurs/create-producteur", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
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

registerBtn.addEventListener("click", (e) => {
  e.preventDefault();
  registerProducteur();
});
const fetchProductions = async () => {
  try {
    const url = "http://localhost:3000/api/v1/producteurs/get-all-producteurs";

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
      if (productions.producteurs.length === 0) {
        receiveProduction.innerHTML = `
                  <div class="w-full bg-card p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl flex justify-center items-center">
                    <h3 class="text-2xl font-semibold text-red-600 text-center">Aucun producteur</h3>
                  </div>
                  `;
      } else {
        productions.producteurs.map((producteur) => {
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
                      <h3 class="text-2xl font-semibold text-red-600">${
                        producteur.code
                      }</h3>
                      <p class="text-s text-muted-foreground">Nom: ${
                        producteur.nom
                      }</p>
                      <p class="text-sm text-muted-foreground">Prénom: ${
                        producteur.prenom
                      }</p>
                      <p class="text-sm text-muted-foreground">Date de naissance: ${producteur.dateNaissance
                        .split("-")
                        .reverse()
                        .join("-")}</p>
                      <br />
                      <div class="flex gap-4">
                          <p class="text-white font-semibold bg-green-600 hover:bg-secondary/80 hover:text-black py-2 px-4 rounded-md cursor-pointer" onclick="showModifFormulaire('${
                            producteur._id
                          }', '${producteur.code}', '${producteur.nom}', '${
            producteur.prenom
          }', '${producteur.dateNaissance}')">Modifier</p>
                          <p class="text-white font-semibold bg-red-600 hover:bg-secondary/80 hover:text-black py-2 px-4 rounded-md cursor-pointer" onclick="deleteProducteur('${
                            producteur._id
                          }')">Supprimer</p>
                      </div>
                    </div>
                    `;
        });
      }
    }
    return productions;
  } catch (error) {
    console.error(error);
  }
};
fetchProductions();

const showModifFormulaire = (id, code, nom, prenom, dateNaissance) => {
  document.getElementById("modifCode").value = code;
  document.getElementById("modifNom").value = nom;
  document.getElementById("modifPrenom").value = prenom;
  document.getElementById("modifId").value = id;
  document.getElementById("modifDate").value = dateNaissance;
  document.getElementById("modifForm").style.display = "block";
};

const deleteProducteur = async (id) => {
  console.log(id);
  const url = `http://localhost:3000/api/v1/producteurs/delete-producteur/${id}`;
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

const modifProducteur = async () => {
  const id = document.getElementById("modifId").value;
  const code = document.getElementById("modifCode").value;
  const nom = document.getElementById("modifNom").value;
  const prenom = document.getElementById("modifPrenom").value;
  const dateNaissance = document.getElementById("modifDate").value;

  const message = document.getElementById("messageModif");

  const url = `http://localhost:3000/api/v1/producteurs/update-producteur/${id}`;
  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({
      code,
      nom,
      prenom,
      dateNaissance,
    }),
  };
  try {
    const response = await fetch(url, options);
    const result = await response.json();
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
  } catch (error) {
    console.log(error);
    message.innerHTML = error.message;
    message.style.color = "red";
  }
};

btnModif.addEventListener("click", (e) => {
  e.preventDefault();
  modifProducteur();
});
