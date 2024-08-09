const userRole = document.getElementById("user");
const receivePlanning = document.getElementById("receive-planning");
const registerBtn = document.getElementById("register");
const modifPlanning = document.getElementById("modif-planning");

const btnLogout = document.getElementById("logout");

userRole.innerHTML = localStorage.getItem("role");

btnLogout.addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "../connexion-personnel.html";
});

const fetchPlannings = async () => {
  try {
    const response = await fetch(
      "http://localhost:3000/api/v1/plannings/get-all-plannings"
    );
    const projections = await response.json();
    console.log(projections);

    if (projections.status === true) {
      if (projections.data.length === 0) {
        receivePlanning.innerHTML = `
        <div class="w-full bg-card p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl flex justify-center items-center">
          <h3 class="text-2xl font-semibold text-red-600 text-center">Aucune projection</h3>
        </div>
        `;
      } else {
        projections.data.forEach((projection) => {
          receivePlanning.innerHTML += `
          <div
            class="bg-card p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl"
          >
            <img
              src="../../assets/img/projection.jpg"
              alt="Projection 1"
              class="mb-4 rounded-lg"
              width="400"
              height="200"
            />
            <h3 class="text-2xl font-semibold text-red-600">${
              projection.film.titre
            }</h3>
            <p class="text-s underline text-muted-foreground">Sujet: ${
              projection.film.sujet
            }</p>
            <p class="text-sm text-muted-foreground">Date: ${
              projection.jour
            }</p>
            <p class="text-sm text-muted-foreground">Heure: ${
              projection.heure
            }</p>
            <p class="text-sm text-muted-foreground">Lieu: ${
              projection.lieu
            }</p>
            <br />
            <p class="text-m text-muted-foreground" style="font-style: italic">Note: ${
              !projection.film.note ? 0 : projection.film.note.note
            }/20</p>
            <br />
                    <div class="flex gap-4">
                        <p class="text-white font-semibold bg-green-600 hover:bg-secondary/80 hover:text-black py-2 px-4 rounded-md cursor-pointer" onclick="showModifFormulaire('${
                          projection._id
                        }', '${projection.jour}', '${projection.heure}', '${
            projection.lieu
          }',  '${projection.film._id}')">Modifier</p>
                        <p class="text-white font-semibold bg-red-600 hover:bg-secondary/80 hover:text-black py-2 px-4 rounded-md cursor-pointer" onclick="deletePlanning('${
                          projection._id
                        }')">Supprimer</p>
                    </div>
          </div>
          `;
        });
      }
    }
    return projections;
  } catch (error) {
    console.error(error);
  }
};
fetchPlannings();

const fetchFilms = async () => {
  try {
    const receiveFilms = document.getElementById("films");
    const modifFilm = document.getElementById("modifFilm");
    const response = await fetch(
      "http://localhost:3000/api/v1/films/get-all-films",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    const films = await response.json();
    console.log(films);
    films.data.forEach((film) => {
      receiveFilms.innerHTML += `<option value="${film._id}">code: ${film.code} | ${film.titre} </option>`;
    });
    films.data.forEach((film) => {
      modifFilm.innerHTML += `<option value="${film._id}">code: ${film.code} | ${film.titre} </option>`;
    });
  } catch (error) {
    console.log(error);
  }
};
fetchFilms();

const verifyChamp = () => {
  const jour = document.getElementById("jour").value;
  const heure = document.getElementById("heure").value;
  const lieu = document.getElementById("lieu").value;
  const film = document.getElementById("films").value;
  const message = document.getElementById("message");

  message.style.color = "red";

  if (!jour) {
    message.innerHTML = "Veuillez renseigner le jour ";
    return false;
  }
  if (!heure) {
    message.innerHTML = "Veuillez renseigner l'heure";
    return false;
  }
  if (!lieu) {
    message.innerHTML = "Veuillez renseigner le lieu";
    return false;
  }
  if (!film) {
    message.innerHTML = "Veuillez renseigner le film";
    return false;
  }
  return true;
};

const registerFilmn = async () => {
  const jour = document.getElementById("jour").value;
  const heure = document.getElementById("heure").value;
  const lieu = document.getElementById("lieu").value;
  const film = document.getElementById("films").value;
  const message = document.getElementById("message");

  const data = {
    jour,
    heure,
    lieu,
    film,
  };
  try {
    if (verifyChamp() === true) {
      fetch("http://localhost:3000/api/v1/plannings/create-planning", {
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
  } catch (error) {
    console.log(error);
  }
};
registerBtn.addEventListener("click", (e) => {
  e.preventDefault();
  registerFilmn();
});

const showModifFormulaire = (id, jour, heure, lieu, film) => {
  document.getElementById("modifJour").value = jour;
  document.getElementById("modifHeure").value = heure;
  document.getElementById("modifLieu").value = lieu;
  document.getElementById("modifFilm").value = film;
  document.getElementById("modifId").value = id;

  document.getElementById("modifForm").style.display = "block";
};

const updatePlanning = async () => {
  const jour = document.getElementById("modifJour").value;
  const heure = document.getElementById("modifHeure").value;
  const lieu = document.getElementById("modifLieu").value;
  const film = document.getElementById("modifFilm").value;
  const id = document.getElementById("modifId").value;

  const url = `http://localhost:3000/api/v1/plannings/update-planning/${id}`;
  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({
      jour,
      heure,
      lieu,
      film,
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

modifPlanning.addEventListener("click", (e) => {
  e.preventDefault();
  updatePlanning();
});

const deletePlanning = async (id) => {
  console.log(id);
  const url = `http://localhost:3000/api/v1/plannings/delete-planning/${id}`;
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
      alert("Plannimg  supprimé");
      window.location.reload();
    }
  } catch (error) {
    console.log(error);
  }
};
