const userRole = document.getElementById("user");
const btnLogout = document.getElementById("logout");
const message = document.getElementById("message");
const registerBtn = document.getElementById("register-inspection");
const receiveInspection = document.getElementById("receive-inspection");
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
  const role = "RespInspection";
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
registerBtn.addEventListener("click", (e) => {
  e.preventDefault();
  registerProducteur();
});

const fetchInspections = async () => {
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
    const inspections = await response.json();
    console.log(inspections);

    if (inspections.status === true) {
      if (inspections.data.length === 0) {
        receiveInspection.innerHTML = `
                <div class="w-full bg-card p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl flex justify-center items-center">
                  <h3 class="text-2xl font-semibold text-red-600 text-center">Aucun inspection</h3>
                </div>
                `;
      } else {
        inspections.data.filter((inspection) => {
          if (inspection.role === "RespInspection") {
            receiveInspection.innerHTML += `
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
                    <h3 class="text-2xl font-semibold text-red-600">${inspection.code}</h3>
                    <p class="text-s text-muted-foreground">Nom: ${inspection.nom}</p>
                    <p class="text-sm text-muted-foreground">Prénom: ${inspection.prenom}</p>
                    <br />
                    <div class="flex gap-4">
                        <p class="text-white font-semibold bg-green-600 hover:bg-secondary/80 hover:text-black py-2 px-4 rounded-md cursor-pointer" onclick="showModifFormulaire('${inspection._id}', ${inspection.code}, '${inspection.nom}', '${inspection.prenom}')">Modifier</p>
                        <p class="text-white font-semibold bg-red-600 hover:bg-secondary/80 hover:text-black py-2 px-4 rounded-md cursor-pointer" onclick="deleteInspecteur('${inspection._id}')">Supprimer</p>
                    </div>
                  </div>
                  `;
          }
        });
      }
    }
    return inspections;
  } catch (error) {
    console.error(error);
  }
};
fetchInspections();

const showModifFormulaire = (id, code, nom, prenom) => {
  document.getElementById("modifCode").value = code;
  document.getElementById("modifNom").value = nom;
  document.getElementById("modifPrenom").value = prenom;
  document.getElementById("modifId").value = id;
  document.getElementById("modifForm").style.display = "block";
};

const deleteInspecteur = async (id) => {
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

const modifProducteur = async () => {
  const id = document.getElementById("modifId").value;
  const code = document.getElementById("modifCode").value;
  const nom = document.getElementById("modifNom").value;
  const prenom = document.getElementById("modifPrenom").value;

  const url = `http://localhost:3000/api/v1/users/update-user/${id}`;
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
  modifProducteur();
});
