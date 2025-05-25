// main.js

// CONSTANTS
const RECIPE_URLS = [
  "https://adarsh249.github.io/Lab8-Starter/recipes/1_50-thanksgiving-side-dishes.json",
  "https://adarsh249.github.io/Lab8-Starter/recipes/2_roasting-turkey-breast-with-stuffing.json",
  "https://adarsh249.github.io/Lab8-Starter/recipes/3_moms-cornbread-stuffing.json",
  "https://adarsh249.github.io/Lab8-Starter/recipes/4_50-indulgent-thanksgiving-side-dishes-for-any-holiday-gathering.json",
  "https://adarsh249.github.io/Lab8-Starter/recipes/5_healthy-thanksgiving-recipe-crockpot-turkey-breast.json",
  "https://adarsh249.github.io/Lab8-Starter/recipes/6_one-pot-thanksgiving-dinner.json",
];

// Run the init() function when the page has loaded
window.addEventListener("DOMContentLoaded", init);

// Starts the program, all function calls trace back here
async function init() {
  // initialize ServiceWorker
  initializeServiceWorker();
  // Get the recipes from localStorage
  let recipes;
  try {
    recipes = await getRecipes();
  } catch (err) {
    console.error(err);
  }
  // Add each recipe to the <main> element
  addRecipesToDocument(recipes);
}

/**
 * Detects if there's a service worker, then loads it and begins the process
 * of installing it and getting it running
 */
function initializeServiceWorker() {
  // EXPLORE - START (All explore numbers start with B)
  /*******************/
  // ServiceWorkers have many uses, the most common of which is to manage
  // local caches, intercept network requests, and conditionally serve from
  // those local caches. This increases performance since users aren't
  // re-downloading the same resources every single page visit. This also allows
  // websites to have some (if not all) functionality offline! I highly
  // recommend reading up on ServiceWorkers on MDN before continuing.
  /*******************/
  // We first must register our ServiceWorker here before any of the code in
  // sw.js is executed.
  // B1. TODO - Check if 'serviceWorker' is supported in the current browser
  if ("serviceWorker" in navigator) {
    // B2. Listen for the 'load' event on the window
    window.addEventListener("load", () => {
      // B3. Register the service worker
      navigator.serviceWorker
        .register("./sw.js")
        .then((registration) => {
          // B4. Log success
          console.log(
            "Service Worker registered successfully with scope:",
            registration.scope
          );
        })
        .catch((error) => {
          // B5. Log failure
          console.error("Service Worker registration failed:", error);
        });
    });
  } else {
    console.warn("Service Workers are not supported in this browser.");
  }

  // Steps B3-B6 will be *inside* the event listener's function created in B2
}

/**
 * Reads 'recipes' from localStorage and returns an array of
 * all of the recipes found (parsed, not in string form). If
 * nothing is found in localStorage, network requests are made to all
 * of the URLs in RECIPE_URLs, an array is made from those recipes, that
 * array is saved to localStorage, and then the array is returned.
 * @returns {Array<Object>} An array of recipes found in localStorage
 */
async function getRecipes() {
  // A1. Check localStorage
  const localData = localStorage.getItem("recipes");
  if (localData) {
    return JSON.parse(localData);
  }

  // A2. Create empty array for recipes
  const recipes = [];

  // A3. Return a new Promise
  return new Promise(async (resolve, reject) => {
    // A4. Loop through RECIPE_URLS
    for (let i = 0; i < RECIPE_URLS.length; i++) {
      const url = RECIPE_URLS[i];
      try {
        // A6. Fetch the recipe
        const response = await fetch(url);
        // A7. Get JSON
        const recipe = await response.json();
        // A8. Add to array
        recipes.push(recipe);

        // A9. If done, save and resolve
        if (recipes.length === RECIPE_URLS.length) {
          saveRecipesToStorage(recipes);
          resolve(recipes);
        }
      } catch (error) {
        // A10. Log error
        console.error(`Failed to fetch recipe from ${url}:`, error);
        // A11. Reject promise
        reject(error);
        break;
      }
    }
  });
}

/**
 * Takes in an array of recipes, converts it to a string, and then
 * saves that string to 'recipes' in localStorage
 * @param {Array<Object>} recipes An array of recipes
 */
function saveRecipesToStorage(recipes) {
  localStorage.setItem("recipes", JSON.stringify(recipes));
}

/**
 * Takes in an array of recipes and for each recipe creates a
 * new <recipe-card> element, adds the recipe data to that card
 * using element.data = {...}, and then appends that new recipe
 * to <main>
 * @param {Array<Object>} recipes An array of recipes
 */
function addRecipesToDocument(recipes) {
  if (!recipes) return;
  let main = document.querySelector("main");
  recipes.forEach((recipe) => {
    let recipeCard = document.createElement("recipe-card");
    recipeCard.data = recipe;
    main.append(recipeCard);
  });
}
