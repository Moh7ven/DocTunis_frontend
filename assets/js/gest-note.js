const register = document.getElementById("register");

const btnLogout = document.getElementById("logout");
btnLogout.addEventListener("click", () => {
  localStorage.removeItem("tokenMembreJurys");
  window.location.href = "./index.html";
});

const fetchFilms = async () => {
  try {
    const receiveFilms = document.getElementById("films");
    const message = document.getElementById("message");
    const response = await fetch(
      "http://localhost:3000/api/v1/films/get-all-films",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("tokenMembreJurys")}`,
        },
      }
    );
    const films = await response.json();
    console.log(films);

    if (films.status === true) {
      films.data.filter((film) => {
        if (!film.note) {
          return (receiveFilms.innerHTML += `<option value="${film._id}">code: ${film.code} | ${film.titre} </option>`);
        }
        /* if (film.note)
          return (receiveFilms.innerHTML += `<option value="${film._id}">Aucun film  à noter </option>`); */
      });
    } else {
      message.innerHTML = films.message;
      message.style.color = "red";
    }
  } catch (error) {
    console.log(error);
  }
};
fetchFilms();

const verifyChamp = () => {
  const note = document.getElementById("note").value;
  const films = document.getElementById("films").value;
  const message = document.getElementById("message");

  message.style.color = "red";
  if (note === "") {
    message.innerHTML = "Veuillez renseigner la note";
    return false;
  } else if (films === "") {
    message.innerHTML = "Veuillez renseigner le film";
    return false;
  } else {
    message.innerHTML = "";
    return true;
  }
};

const registerNote = async () => {
  const note = document.getElementById("note").value;
  const filmId = document.getElementById("films").value;

  const message = document.getElementById("message");
  if (verifyChamp() === true) {
    fetch("http://localhost:3000/api/v1/notes/add-note", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("tokenMembreJurys")}`,
      },
      body: JSON.stringify({ note, filmId }),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (result.status === true) {
          message.innerHTML = "Note attribuée";
          message.style.color = "green";
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          message.innerHTML = result.message;
          message.style.color = "red";
        }
      });
  }
};

register.addEventListener("click", (e) => {
  e.preventDefault();
  registerNote();
});
