const userRole = document.getElementById("user");
const btnLogout = document.getElementById("logout");
const receiveFilms = document.getElementById("receive-films");
const registerBtn = document.getElementById("register");

const btnModif = document.getElementById("modif-film");

userRole.innerHTML = localStorage.getItem("role");
btnLogout.addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "../connexion-personnel.html";
});
const fetchRealisateurs = async () => {
  try {
    const realisateurReceive = document.getElementById("realisateur");
    const response = await fetch(
      "http://localhost:3000/api/v1/realisateurs/get-all-realisateurs",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    const realisateurs = await response.json();
    console.log(realisateurs);

    // producteur.innerHTML = `<option value="0">Tous</option>`;
    realisateurs.realisateurs.forEach((realisateur) => {
      realisateurReceive.innerHTML += `<option value="${realisateur._id}">code: ${realisateur.code} | ${realisateur.nom} ${realisateur.prenom}</option>`;
    });
    return realisateurs;
  } catch (error) {
    console.log(error);
  }
};
fetchRealisateurs();
const fetchProducteurs = async () => {
  try {
    const producteurReceive = document.getElementById("producteur");
    const response = await fetch(
      "http://localhost:3000/api/v1/producteurs/get-all-producteurs",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    const producteurs = await response.json();
    console.log(producteurs);

    // producteur.innerHTML = `<option value="0">Tous</option>`;
    producteurs.producteurs.forEach((producteur) => {
      producteurReceive.innerHTML += `<option value="${producteur._id}">code: ${producteur.code} | ${producteur.nom} ${producteur.prenom}</option>`;
    });
    return producteurs;
  } catch (error) {
    console.log(error);
  }
};
fetchProducteurs();

const verifyChamp = () => {
  const code = document.getElementById("code").value;
  const titre = document.getElementById("titre").value;
  const date = document.getElementById("date").value;
  const sujet = document.getElementById("sujet").value;
  const message = document.getElementById("message");

  message.style.color = "red";

  if (!code) {
    message.innerHTML = "Veuillez renseigner le code ";
    return false;
  }
  if (!titre) {
    message.innerHTML = "Veuillez renseigner le titre";
    return false;
  }
  if (!date) {
    message.innerHTML = "Veuillez renseigner la date";
    return false;
  }
  if (!sujet) {
    message.innerHTML = "Veuillez renseigner le sujet";
    return false;
  }
  return true;
};

const registerFilm = async () => {
  const code = document.getElementById("code").value;
  const titre = document.getElementById("titre").value;
  const date = document.getElementById("date").value;
  const sujet = document.getElementById("sujet").value;
  const realisateur = document.getElementById("realisateur").value;
  const producteur = document.getElementById("producteur").value;
  const message = document.getElementById("message");

  const data = {
    code,
    titre,
    date,
    sujet,
    realisateur,
    producteur,
  };
  if (verifyChamp() === true) {
    fetch("http://localhost:3000/api/v1/films/create-film", {
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
  registerFilm();
});

const fetchFilms = async () => {
  try {
    const url = "http://localhost:3000/api/v1/films/get-all-films";
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };
    const response = await fetch(url, options);
    const films = await response.json();
    console.log(films);

    if (films.status === true) {
      if (films.data.length === 0) {
        receiveFilms.innerHTML = `
        <div class="w-full bg-card p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl flex justify-center items-center">
          <h3 class="text-2xl font-semibold text-red-600 text-center">Aucun film enregistré</h3>
        </div>
        `;
      } else {
        films.data.forEach((film) => {
          receiveFilms.innerHTML += `
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
            <h3 class="text-2xl font-semibold text-red-600">${film.code}</h3>
            <p class="text-s underline text-muted-foreground">Titre: ${
              film.titre
            }</p>
            <p class="text-sm text-muted-foreground">Date: ${film.date}</p>
            <p class="text-sm text-muted-foreground">Sujet: ${film.sujet}</p>
            <p class="text-sm text-muted-foreground">Realisateur: ${
              film.realisateur.code
            } | ${film.realisateur.nom} ${film.realisateur.prenom}</p>
            <br />
            <p class="text-m text-muted-foreground" style="font-style: italic">Note: ${
              !film.note ? 0 : film.note.note
            }/20</p>
          </div>
        `;
        });
      }
    }
    return films;
  } catch (error) {
    console.log(error);
  }
};
fetchFilms();
