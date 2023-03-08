console.log("Client side js is loaded");

fetch("http://puzzle.mead.io/puzzle").then((response) => {
  response.json().then((data) => {
    console.log(data);
  });
});

const weatherForm = document.querySelector("form");
const search = document.querySelector("input");

weatherForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const location = search.value;

  if (location) {
    fetch("http://localhost:3000/weather?address=" + location).then(
      (response) => {
        response.json().then((data) => {
          if (data.error) {
            console.log(data.error);
          } else {
            console.log(data);
          }
        });
      }
    );
  } else {
    console.log("You must add a location");
  }
});
