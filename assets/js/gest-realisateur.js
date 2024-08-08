const userRole = document.getElementById("user");
const btnLogout = document.getElementById("logout");
const receiveRealisateurs = document.getElementById("receive-realisateurs");
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
    message.innerHTML = "Veuillez renseigner la date de naissance";
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
    fetch("http://localhost:3000/api/v1/realisateurs/create-realisateurs", {
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
const fetchRealisateurs = async () => {
  try {
    const url =
      "http://localhost:3000/api/v1/realisateurs/get-all-realisateurs";

    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };

    const response = await fetch(url, options);
    const realisateurs = await response.json();
    console.log(realisateurs);

    if (realisateurs.status === true) {
      if (realisateurs.realisateurs.length === 0) {
        receiveRealisateurs.innerHTML = `
                  <div class="w-full bg-card p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl flex justify-center items-center">
                    <h3 class="text-2xl font-semibold text-red-600 text-center">Aucun producteur</h3>
                  </div>
                  `;
      } else {
        realisateurs.realisateurs.map((realisateur) => {
          receiveRealisateurs.innerHTML += `
                    <div
                       class="bg-card p-6  flex flex-col items-center justify-center rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl"
                    >
                      <img
                        src="../../assets/img/personne.png"
                        alt="realisateur 1"
                        class="mb-4 rounded-lg mg-auto"
                        width="300"
                        height="200"
                      />
                      <h3 class="text-2xl font-semibold text-red-600">${
                        realisateur.code
                      }</h3>
                      <p class="text-s text-muted-foreground">Nom: ${
                        realisateur.nom
                      }</p>
                      <p class="text-sm text-muted-foreground">Prénom: ${
                        realisateur.prenom
                      }</p>
                      <p class="text-sm text-muted-foreground">Date de naissance: ${realisateur.dateNaissance
                        .split("-")
                        .reverse()
                        .join("-")}</p>
                      <br />
                      <div class="flex gap-4">
                          <p class="text-white font-semibold bg-green-600 hover:bg-secondary/80 hover:text-black py-2 px-4 rounded-md cursor-pointer" onclick="showModifFormulaire('${
                            realisateur._id
                          }', '${realisateur.code}', '${realisateur.nom}', '${
            realisateur.prenom
          }', '${realisateur.dateNaissance}')">Modifier</p>
                          <p class="text-white font-semibold bg-red-600 hover:bg-secondary/80 hover:text-black py-2 px-4 rounded-md cursor-pointer" onclick="deleteRealisateur('${
                            realisateur._id
                          }')">Supprimer</p>
                      </div>
                    </div>
                    `;
        });
      }
    }
    return realisateurs;
  } catch (error) {
    console.error(error);
  }
};
fetchRealisateurs();

const showModifFormulaire = (id, code, nom, prenom, dateNaissance) => {
  document.getElementById("modifCode").value = code;
  document.getElementById("modifNom").value = nom;
  document.getElementById("modifPrenom").value = prenom;
  document.getElementById("modifId").value = id;
  document.getElementById("modifDate").value = dateNaissance;

  document.getElementById("modifForm").style.display = "block";
};

const deleteRealisateur = async (id) => {
  console.log(id);
  const url = `http://localhost:3000/api/v1/realisateurs/delete-realisateurs/${id}`;
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
      alert(result.message);
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

  const url = `http://localhost:3000/api/v1/realisateurs/update-realisateurs/${id}`;
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
      message.innerHTML = "Realisateur modifié";
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
