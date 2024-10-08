const userRole = document.getElementById("user");
const btnLogout = document.getElementById("logout");
const receiveMembreJurys = document.getElementById("receive-membres");
const btnModif = document.getElementById("modif-membre");

const registerBtn = document.getElementById("register");

userRole.innerHTML = localStorage.getItem("role");
btnLogout.addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "../connexion-personnel.html";
});

const fetchMembreJurys = async () => {
  try {
    const url =
      "http://localhost:3000/api/v1/membre-jurys/get-all-membre-jurys";

    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };

    const response = await fetch(url, options);
    const membres = await response.json();
    console.log(membres);

    if (membres.status === true) {
      if (membres.data.length === 0) {
        receiveMembreJurys.innerHTML = `
                  <div class="w-full bg-card p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl flex justify-center items-center">
                    <h3 class="text-2xl font-semibold text-red-600 text-center">Aucun Membre du jurys enregistrer</h3>
                  </div>
                  `;
      } else {
        membres.data.forEach((membre) => {
          receiveMembreJurys.innerHTML += `
                    <div
                       class="bg-card p-6  flex flex-col items-center justify-center rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl"
                    >
                      <img
                        src="../../assets/img/personne.png"
                        alt="inspection 1"
                        class="mb-4 rounded-lg mg-auto"
                        width="300"
                        height="200"
                      />
                      <h3 class="text-2xl font-semibold text-red-600">${
                        membre.code
                      }</h3>
                      <p class="text-s text-muted-foreground">Nom: ${
                        membre.nom
                      }</p>
                      <p class="text-sm text-muted-foreground">Prénom: ${
                        membre.prenom
                      }</p>
                      <p class="text-s text-muted-foreground">Date de naissance: ${membre.dateNaissance
                        .split("-")
                        .reverse()
                        .join("-")}</p>
                      <br />
                      <div class="flex gap-4">
                          <p class="text-white font-semibold bg-green-600 hover:bg-secondary/80 hover:text-black py-2 px-4 rounded-md cursor-pointer" onclick="showModifFormulaire('${
                            membre._id
                          }', ${membre.code}, '${membre.nom}', '${
            membre.prenom
          }', '${membre.dateNaissance}')">Modifier</p>
                          <p class="text-white font-semibold bg-red-600 hover:bg-secondary/80 hover:text-black py-2 px-4 rounded-md cursor-pointer" onclick="deleteMembre('${
                            membre._id
                          }')">Supprimer</p>
                      </div>
                    </div>
                    `;
        });
      }
    }
    return membres;
  } catch (error) {
    console.error(error);
  }
};
fetchMembreJurys();

const verifyChamp = () => {
  const code = document.getElementById("code").value;
  const nom = document.getElementById("nom").value;
  const prenom = document.getElementById("prenom").value;
  const dateNaissance = document.getElementById("dateNaissance").value;
  const message = document.getElementById("message");

  message.style.color = "red";

  if (!code) {
    message.innerHTML = "Code requis";
    return false;
  }
  if (!nom) {
    message.innerHTML = "Nom requis";
    return false;
  }
  if (!prenom) {
    message.innerHTML = "Prenom requis";
    return false;
  }
  if (!dateNaissance) {
    message.innerHTML = "Date de naissance requise";
    return false;
  }
  return true;
};

const registerProducteur = () => {
  const code = document.getElementById("code").value;
  const nom = document.getElementById("nom").value;
  const prenom = document.getElementById("prenom").value;
  const dateNaissance = document.getElementById("dateNaissance").value;

  const message = document.getElementById("message");

  const data = {
    code,
    nom,
    prenom,
    dateNaissance,
  };
  if (verifyChamp() === true) {
    fetch("http://localhost:3000/api/v1/membre-jurys/create-membre-jury", {
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
          message.innerHTML = "Enregistrement reussie";
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

const deleteMembre = async (id) => {
  const url = `http://localhost:3000/api/v1/membre-jurys/delete-membre-jurys/${id}`;
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
      alert("Membre jurys supprimé");
      window.location.reload();
    }
  } catch (error) {
    console.log(error);
  }
};

const showModifFormulaire = async (id, code, nom, prenom, dateNaissance) => {
  document.getElementById("modifCode").value = code;
  document.getElementById("modifNom").value = nom;
  document.getElementById("modifPrenom").value = prenom;
  document.getElementById("modifDateNaissance").value = dateNaissance;
  document.getElementById("modifId").value = id;
  document.getElementById("modifForm").style.display = "block";
};

const modifMembre = async () => {
  const id = document.getElementById("modifId").value;
  const code = document.getElementById("modifCode").value;
  const nom = document.getElementById("modifNom").value;
  const prenom = document.getElementById("modifPrenom").value;
  const dateNaissance = document.getElementById("modifDateNaissance").value;

  const url = `http://localhost:3000/api/v1/membre-jurys/update-membre-jurys/${id}`;
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
      alert("Responsable de production modifié");
      window.location.reload();
    }
  } catch (error) {
    console.log(error);
  }
};

btnModif.addEventListener("click", (e) => {
  e.preventDefault();
  modifMembre();
});
