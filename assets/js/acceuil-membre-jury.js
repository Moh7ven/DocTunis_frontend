const userRole = document.getElementById("user");
const receiveProjection = document.getElementById("receive-projection");

const btnLogout = document.getElementById("logout");

btnLogout.addEventListener("click", () => {
  localStorage.removeItem("tokenMembreJurys");
  window.location.href = "./index.html";
});

const fetchProjections = async () => {
  try {
    const response = await fetch(
      "http://localhost:3000/api/v1/plannings/get-all-plannings"
    );
    const projections = await response.json();
    console.log(projections);

    if (projections.status === true) {
      if (projections.data.length === 0) {
        receiveProjection.innerHTML = `
          <div class="w-full bg-card p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl flex justify-center items-center">
            <h3 class="text-2xl font-semibold text-red-600 text-center">Aucune projection</h3>
          </div>
          `;
      } else {
        projections.data.forEach((projection) => {
          receiveProjection.innerHTML += `
            <div
              class="bg-card p-6  flex flex-col  justify-center rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl"
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
                projection.film.sujet
              }</p>
              <p class="text-sm text-muted-foreground">Producteur: ${
                projection.film.producteur.code
              }</p> 
              <p class="text-sm text-muted-foreground">Réalisateur: ${
                projection.film.realisateur.code
              }</p> 
              <br />
              <p class="text-m text-muted-foreground" style="font-style: italic">Note: ${
                !projection.film.note ? 0 : projection.film.note.note
              }/20</p>
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
fetchProjections();
