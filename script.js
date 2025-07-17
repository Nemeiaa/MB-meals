// Populate the area dropdown when the page loads
window.addEventListener("DOMContentLoaded", function () {
  const areaSelect = document.getElementById("area-select");
  areaSelect.innerHTML = '<option value="">Select Area</option>';

  fetch("https://www.themealdb.com/api/json/v1/1/list.php?a=list")
    .then((response) => response.json())
    .then((data) => {
      if (data.meals) {
        data.meals.forEach((areaObj) => {
          const option = document.createElement("option");
          option.value = areaObj.strArea;
          option.textContent = areaObj.strArea;
          areaSelect.appendChild(option);
        });
      }
    });
});

// When the user selects an area, fetch and display meals for that area
document.getElementById("area-select").addEventListener("change", function () {
  const area = this.value;
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = ""; // Clear previous results

  if (!area) return;

  fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?a=${encodeURIComponent(
      area
    )}`
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.meals) {
        data.meals.forEach((meal) => {
          const mealDiv = document.createElement("div");
          mealDiv.className = "meal";

          const title = document.createElement("h3");
          title.textContent = meal.strMeal;

          const img = document.createElement("img");
          img.src = meal.strMealThumb;
          img.alt = meal.strMeal;

          const button = document.createElement("button");
          button.textContent = "View Details";
          button.className = "view-details";
          button.addEventListener("click", function () {
            showModal(meal.idMeal); // Pass meal ID to showModal
          });

          mealDiv.appendChild(title);
          mealDiv.appendChild(img);
          mealDiv.appendChild(button);
          resultsDiv.appendChild(mealDiv);
        });
      } else {
        resultsDiv.textContent = "No meals found for this area.";
      }
    });
});

// Function to create and display the modal
function showModal(mealId) {
  const modal = document.getElementById("meal-modal");
  const modalContent = document.getElementById("modal-content");
  modalContent.innerHTML = ""; // Clear previous content

  // Fetch meal details by ID
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.meals && data.meals.length > 0) {
        const meal = data.meals[0];

        // Create and append enlarged image
        const img = document.createElement("img");
        img.src = meal.strMealThumb;
        img.alt = meal.strMeal;

        // Create a container for the text content
        const textContent = document.createElement("div");

        // Create and append meal title
        const title = document.createElement("h2");
        title.textContent = meal.strMeal;

        // Create and append recipe instructions
        const instructions = document.createElement("p");
        instructions.textContent = meal.strInstructions;

        textContent.appendChild(title);
        textContent.appendChild(instructions);

        modalContent.appendChild(img);
        modalContent.appendChild(textContent);

        modal.style.display = "flex"; // Show the modaln in flexbox layout
      }
    });
}

// Close the modal when the close button is clicked
document.getElementById("close-modal").addEventListener("click", function () {
  document.getElementById("meal-modal").style.display = "none";
});

// Close the modal when clicking outside of the modal content
document.getElementById("meal-modal").addEventListener("click", function (event) {
  if (event.target === this) {
    this.style.display = "none";
  }
});
