const searchedTitle = document.querySelector("#plantTitle");
const searchedDescription = document.querySelector("#plantDescription");
const searchedHealthList = document.querySelector("#healthList");
const searchedImage = document.querySelector("#plantImg");
const searchedClimate = document.querySelector("#plantClimate");
const searchedType = document.querySelector("#plantType");
// Use variable below to get a plant id to call the api to add a plant easier
const plantDiv = document.querySelector(".plants");
let plantIdFromSearch;

// Route to sign out
document.getElementById("signout-btn").addEventListener("click", (e) => {
  e.preventDefault();
  fetch("/api/users/logout", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => {
    if (res.ok) {
      location.href = "/";
    } else {
      alert("Darnit");
    }
  });
});

// Route to search for a plant
document.getElementById("searchForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  let searchedPlant = document.getElementById("searchInput").value;
  searchedPlant = searchedPlant.toLowerCase();
  fetch("/api/plants", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      for (let i = 0; i < data.length; i++) {
        if (searchedPlant == data[i].plant_name.toLowerCase()) {
          plantIdFromSearch = data[i].id;
          fetch(`/api/plants/${data[i].id}`)
            .then((res) => res.json())
            .then((matchingPlant) => {
              return appendSearchedPlant(matchingPlant);
            });
        }
      }
    });
});

// ! Use this fetch to add a plant to a user
document.querySelector("#addToGarden").addEventListener("click", (e) => {
  e.preventDefault();
  fetch(`/api/users/addplant/${plantIdFromSearch}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => location.reload());
});

// Route to send email with nodemailer
document.querySelector("#emailMeBtn").addEventListener("click", (e) => {
  e.preventDefault();
  fetch("/mail", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => location.reload());
});

// Add plant to user garden
const appendSearchedPlant = async (plantObj) => {
  // Get necessary keys from plant obj to refer to in this function
  let title = plantObj.plant_name;
  let imgSrc = plantObj.plant_name.toLowerCase();
  let climate = plantObj.climate;
  let type = plantObj.type;
  let healthArr = plantObj.Health;
  // Use this to set image sources to have - instead of spaces
  let imgArr = imgSrc.split(" ");
  // Append list elements to health list
  searchedHealthList.innerHTML = "";
  for (let i = 0; i < healthArr.length; i++) {
    let newLi = document.createElement("li");
    newLi.textContent = healthArr[i].benefits;
    searchedHealthList.appendChild(newLi);
  }
  searchedTitle.textContent = title;
  searchedImage.setAttribute("src", `/images/${imgArr.join("-")}.jpg`);
  searchedClimate.textContent = `Climate: ${climate}`;
  searchedType.textContent = `Type: ${type}`;
};

plantDiv.addEventListener("click", (e) => {
  e.preventDefault();
  let spotClicked = e.target;

  if (spotClicked.matches(".delete-icon")) {
    let plantClicked =
      spotClicked.parentNode.parentNode.children[0].textContent;
    fetch("/api/plants", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        for (let i = 0; i < data.length; i++) {
          if (plantClicked == data[i].plant_name) {
            fetch(`/api/users/remove/${data[i].id}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
            }).then((res) => {
              if (res.ok) {
                location.reload();
              } else {
                console.log("oops!");
              }
            });
          }
        }
      });
  } else {
    console.log("that aint a plant");
  }
});
