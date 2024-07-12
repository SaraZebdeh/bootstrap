const body = document.querySelector("body");
let courses = [];
let favourites = [];
const colorThemeBtn = document.getElementById("colorThemeBtn");
const favoriteBtn = document.getElementById("favourites-click-btn");
const favouritesDiv = document.querySelector(".favourites");

const modeText = document.getElementById("mode_btn_text");
const heartColor = document.getElementById("heart-icon-btn");
const modeColor = document.getElementById("mode-icon-btn");

const fetchCourses = async () => {
  const response = await fetch("data.json");
  return await response.json();
};

const saveToLocalStorage = () => {
  localStorage.setItem("courses", JSON.stringify(courses));
  localStorage.setItem("favourites", JSON.stringify(favourites));
};

const loadFromLocalStorage = () => {
  const savedCourses = localStorage.getItem("courses");
  const savedFavourites = localStorage.getItem("favourites");

  if (savedCourses) {
    courses = JSON.parse(savedCourses);
  }
  if (savedFavourites) {
    favourites = JSON.parse(savedFavourites);
  }
};

colorThemeBtn.addEventListener("click", () => {
  body.classList.contains("dark")
    ? body.classList.toggle("light-mode")
    : body.classList.toggle("dark-mode");
});

colorThemeBtn.addEventListener("click", () => {
  if (modeText.innerText === "Dark Mode") {
    modeText.innerText = "Light Mode";
  } else {
    modeText.innerText = "Dark Mode";
  }
});

favoriteBtn.addEventListener("click", () => {
  favouritesDiv.classList.toggle("show");
});

favoriteBtn.addEventListener("click", function () {
  heartColor.classList.toggle("clicked");
  heartColor.classList.contains("clicked")
    ? (heartColor.name = "heart")
    : (heartColor.name = "heart-outline");
});

colorThemeBtn.addEventListener("click", function () {
  modeColor.classList.toggle("clicked");
  modeColor.classList.contains("clicked")
    ? (modeColor.name = "moon")
    : (modeColor.name = "moon-outline");
});

const sortSelect = document.getElementById("sort");
const filterSelect = document.getElementById("filter");
const searchInput = document.querySelector(".search");

let currentFilter = "default"; // Initialize with default filter
let currentSortBy = "default"; // Initialize with default sort
let currentSearchText = ""; // Initialize with empty search text

const handleSort = () => {
  currentSortBy = sortSelect.value;
  updateDisplayedContent();
};

const handleFilter = () => {
  currentFilter = filterSelect.value;
  updateDisplayedContent();
};

const handleSearch = () => {
  currentSearchText = searchInput.value.trim().toLowerCase();
  updateDisplayedContent();
};

const updateDisplayedContent = () => {
  let filteredCourses = [...courses];

  // apply filter
  if (currentFilter !== "default") {
    filteredCourses = courses.filter(
      (course) => course.category.trim() === currentFilter.trim()
    );
  }

  // apply search
  if (currentSearchText) {
    filteredCourses = filteredCourses.filter(
      (course) =>
        course.topic.toLowerCase().includes(currentSearchText) ||
        course.name.toLowerCase().includes(currentSearchText) ||
        course.category.toLowerCase().includes(currentSearchText)
    );
  }

  // apply sort
  switch (currentSortBy) {
    case "topic":
      filteredCourses.sort((a, b) => a.topic.localeCompare(b.topic));
      break;
    case "name":
      filteredCourses.sort((a, b) => a.name.localeCompare(b.name));
      break;
    default:
      // Handle default sorting if needed
      break;
  }

  renderCardsOfTopics(filteredCourses);
};

if (sortSelect) {
  sortSelect.addEventListener("change", handleSort);
}
if (filterSelect) {
  filterSelect.addEventListener("change", handleFilter);
}
if (searchInput) {
  searchInput.addEventListener("input", handleSearch);
}

const renderCardsOfTopics = (data) => {
  const cardsContainer = document.querySelector(".topics-container");
  cardsContainer.innerHTML = "";
  data.forEach((cardData) => {
    const card = document.createElement("div");
    card.classList.add("text-left", "card", "border-0", "topic");
    console.log(cardData.category);
    const imgCard = document.createElement("div");
    imgCard.classList.add(
      "d-flex",
      "align-items-center",
      "justify-content-center",
      "overflow-hidden",
      "topic-img"
    );
    const image = document.createElement("img");
    image.src = cardData.image;
    image.alt = cardData.topic;

    const information_div = document.createElement("div");
    information_div.classList.add("p-3");

    const topic_p = document.createElement("p");
    topic_p.classList.add("m-0","topicCategory");
    topic_p.textContent = cardData.category;

    const topic_h3 = document.createElement("h3");
    topic_h3.textContent = cardData.topic;

    const stars_ul = document.createElement("ul");
    stars_ul.classList.add(
      "d-flex",
      "p-0",
      "m-0",
      "justify-content-start",
      "align-items-center"
    );
    cardData.stars.forEach((star) => {
      const star_li = document.createElement("li");
      star_li.classList.add("pt-2");
      const icon = document.createElement("ion-icon");
      icon.setAttribute("class", star.class);
      icon.setAttribute("name", star.name);
      star_li.appendChild(icon);
      stars_ul.appendChild(star_li);
    });

    const topic_auther_p = document.createElement("p");
    topic_auther_p.classList.add("m-0", "auther-p");
    topic_auther_p.textContent = `Author: ${cardData.name}`;
    information_div.appendChild(topic_p);
    information_div.appendChild(topic_h3);
    information_div.appendChild(stars_ul);
    information_div.appendChild(topic_auther_p);

    imgCard.appendChild(image);

    card.appendChild(imgCard);
    card.appendChild(information_div);

    // Add click event listener to open details page
    card.addEventListener("click", () => {
      window.location.href = `detailsPage.html?id=${cardData.id}`;
    });

    cardsContainer.appendChild(card);
  });
};

const renderCardsOfFavouritesTopics = (data) => {
  const favouritesDiv = document.querySelector(".favourites-div");
  favouritesDiv.innerHTML = ""; // Clear current content

  data.forEach((item) => {
    const topic_div = document.createElement("div");
    topic_div.classList.add("favourite-topic");

    const topic_img_div = document.createElement("div");
    topic_img_div.classList.add(
      "d-flex",
      "align-items-center",
      "justify-content-center",
      "float-left",
      "text-left",
      "topic-img",
      "favourites-topic-img"
    );

    const imgElement = document.createElement("img");
    imgElement.src = item.image;
    imgElement.alt = item.topic;

    topic_img_div.appendChild(imgElement);

    const info_div = document.createElement("div");
    info_div.classList.add("p-3");

    const h3Element = document.createElement("h3");
    h3Element.classList.add("m-0");
    h3Element.textContent = item.topic;

    const stars_ul = document.createElement("ul");
    stars_ul.classList.add(
      "d-flex",
      "p-0",
      "m-0",
      "justify-content-start",
      "align-items-center"
    );
    item.stars.forEach((star) => {
      const star_li = document.createElement("li");
      star_li.classList.add("pt-0");
      const icon = document.createElement("ion-icon");
      icon.setAttribute("class", star.class);
      icon.setAttribute("name", star.name);
      star_li.appendChild(icon);
      stars_ul.appendChild(star_li);
    });
    info_div.appendChild(h3Element);
    info_div.appendChild(stars_ul);

    topic_div.appendChild(topic_img_div);
    topic_div.appendChild(info_div);

    favouritesDiv.appendChild(topic_div);
  });
};

const renderDetailsPageForATopic = (data) => {
  const urlParams = new URLSearchParams(window.location.search);
  const selectedCardId = urlParams.get("id");
  console.log(selectedCardId);
  if (selectedCardId) {
    const cardData = data.find((card) => card.id == selectedCardId);
    console.log(cardData);
    if (cardData) {
      const details = document.querySelector(".details");
      const details_div = document.createElement("div");
      details_div.classList.add("d-flex", "flex-column","gap-1", "details-div");
      const div = document.createElement("div");

      const h5 = document.createElement("h5");
      h5.textContent = cardData.category;
      h5.classList.add("m-0");
      const details_h3 = document.createElement("h3");
      details_h3.classList.add("m-0", "details-h3");
      details_h3.textContent = cardData.topic;

      const stars_ul = document.createElement("ul");
      stars_ul.classList.add("p-0", "d-flex","justify-content-start","align-items-center", "details-ul");
      cardData.stars.forEach((star) => {
        const star_li = document.createElement("li");
        const icon = document.createElement("ion-icon");
        icon.setAttribute("class", star.class);
        icon.setAttribute("name", star.name);
        star_li.appendChild(icon);
        stars_ul.appendChild(star_li);
      });

      const details_p = document.createElement("p");
      details_p.classList.add("details-p");
      details_p.textContent = cardData.description;
      div.appendChild(h5);
      div.appendChild(details_h3);
      div.appendChild(stars_ul);
      details_div.appendChild(div);
      details_div.appendChild(details_p);

      const relative_container = document.createElement("div");
      relative_container.classList.add("position-relative", "relative-container");
      const topic_div = document.createElement("div");
      topic_div.classList.add("card","rounded-0", "text-left","overflow-auto","position-absolute" ,"topic-of-card");

      const imgCard = document.createElement("div");
      imgCard.classList.add("d-flex","overflow-hidden", "justify-content-center","align-items-center", "topic-card-img");
      const image = document.createElement("img");
      image.src = cardData.image;
      image.alt = cardData.topic;

      imgCard.appendChild(image);

      const favourite_information_div = document.createElement("div");
      favourite_information_div.classList.add("p-3", "favourite-information-div");

      const divElement = document.createElement("div");
      divElement.classList.add("d-flex","align-items-baseline","justify-content-left","mb-2", "p-h5-a-div", "gap-2");

      const h6 = document.createElement("h6");
      h6.textContent = cardData.topic;

      const aElement = document.createElement("a");
      aElement.href = "#"; // Set the href attribute to "#"
      aElement.textContent = cardData.name;

      divElement.appendChild(h6);
      divElement.appendChild(document.createTextNode("by "));
      divElement.appendChild(aElement);

      const favourite_div = document.createElement("div");
      favourite_div.classList.add("align-items-center","p-3","favourite-div");
      const favourite_div_p = document.createElement("p");
      favourite_div_p.textContent = "Interested about this topic?";
      const favourite_div_div = document.createElement("div");
      favourite_div_div.classList.add("d-flex","justify-content-center","align-items-center", "add-to-favourite-div");
      const addToFavouriteBtn = document.createElement("button");
      addToFavouriteBtn.classList.add("d-flex","justify-content-center","align-items-center", "gap-1","p-2", "border-0");
      addToFavouriteBtn.id = "add-to-favourite-btn";
      const addSpan = document.createElement("span");
      addSpan.classList.add("add-span");
      addSpan.textContent = cardData.isFavourite
        ? "Remove from Favourites"
        : "Add to Favourites";

      // Add an event listener to the button to toggle the favourite status
      addToFavouriteBtn.addEventListener("click", () => {
        cardData.isFavourite = !cardData.isFavourite;
        courses = [
          ...courses.map((item) =>
            item.id === selectedCardId
              ? { ...item, isFavourite: !item.isFavourite }
              : item
          ),
        ];

        favourites = [...courses.filter((item) => item.isFavourite)];
        console.log(favourites);
        renderCardsOfFavouritesTopics(favourites);
        saveToLocalStorage();
        console.log(courses);

        // Update the button text
        addSpan.textContent = cardData.isFavourite
          ? "Remove from Favourites"
          : "Add to Favourites";
      });

      const icon = document.createElement("ion-icon");
      icon.setAttribute("class", "fav-icon");
      icon.setAttribute("name", "heart-outline");

      const p2 = document.createElement("p");
      p2.classList.add("mt-3", "text-center", "add-to-favourite-bottom");
      p2.textContent = "Unlimited Credits";

      addToFavouriteBtn.appendChild(addSpan);
      addToFavouriteBtn.appendChild(icon);

      favourite_div_div.appendChild(addToFavouriteBtn);
      favourite_div.appendChild(favourite_div_p);
      favourite_div.appendChild(favourite_div_div);
      favourite_div.appendChild(p2);

      favourite_information_div.appendChild(divElement);
      favourite_information_div.appendChild(favourite_div);

      topic_div.appendChild(imgCard);
      topic_div.appendChild(favourite_information_div);
      relative_container.appendChild(topic_div);

      details.appendChild(details_div);
      details.appendChild(relative_container);

      const sub_topics_div = document.querySelector(".sub-topics-div");
      const sub_topic_div_h6 = document.createElement("div");
      sub_topic_div_h6.classList.add("p-3", "sub-topic");
      const sub_topic_div_h6Element = document.createElement("h6");
      sub_topic_div_h6Element.classList.add("sub-topics-h6");
      sub_topic_div_h6Element.textContent = `${cardData.topic} Sub Topics`;
      sub_topic_div_h6.appendChild(sub_topic_div_h6Element);
      sub_topics_div.appendChild(sub_topic_div_h6);

      cardData.subtopics.forEach((topic) => {
        const sub_topic_div = document.createElement("div");
        sub_topic_div.classList.add("p-3", "sub-topic");
        const sub_topic_button = document.createElement("button");
        sub_topic_button.classList.add("d-flex","justify-content-between","align-items-center", "gap-2", "border-0");
        const check_icon = document.createElement("ion-icon");
        check_icon.setAttribute("class", "check-icon");
        check_icon.setAttribute("name", "checkmark-circle-outline");
        const sub_topic_addSpan = document.createElement("span");
        sub_topic_addSpan.textContent = topic;
        sub_topic_button.appendChild(check_icon);
        sub_topic_button.appendChild(sub_topic_addSpan);
        sub_topic_div.appendChild(sub_topic_button);
        sub_topics_div.appendChild(sub_topic_div);
      });
    }
  }
};

(async () => {
  loadFromLocalStorage();

  if (courses.length === 0) {
    courses = await fetchCourses();
    favourites = [...courses.filter((item) => item.isFavourite)];
    saveToLocalStorage();
  }
  console.log(courses);
  renderCardsOfFavouritesTopics(favourites);
  renderDetailsPageForATopic(courses);
  renderCardsOfTopics(courses);
})();
