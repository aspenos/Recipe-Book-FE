document.addEventListener('DOMContentLoaded', () => {
    const browseRecipesButton = document.getElementById('browseRecipes');
    const recipesListContainer = document.getElementById('recipesList');

    browseRecipesButton.addEventListener('click', () => {
        fetch('http://localhost:3000/recipes')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(recipes => {
                recipesListContainer.innerHTML = ''; // Clear the container
                recipes.forEach(recipe => {
                    const recipeElement = document.createElement('div');
                    recipeElement.innerHTML = `
                        <h2>${recipe.name}</h2>
                        <p>${recipe.description}</p>
                        <img src="${recipe.image}" alt="${recipe.name} image" />
                    `;
                    recipesListContainer.appendChild(recipeElement);
                });
            })
            .catch(error => console.error('There has been a problem with your fetch operation:', error));
    });
});

async function fetchCategories() {
    // Fetch ingredient categories
    const ingredientResponse = await fetch('http://localhost:3000/ingredient-categories');
    const ingredientCategories = await ingredientResponse.json();
    const ingredientSelect = document.getElementById('ingredientCategorySelect');
    ingredientCategories.forEach(category => {
        let option = document.createElement('option');
        option.value = category._id;
        option.innerText = category.name;
        ingredientSelect.appendChild(option);
    });

    // Fetch recipe categories
    const recipeResponse = await fetch('http://localhost:3000/recipe-categories');
    const recipeCategories = await recipeResponse.json();
    const recipeSelect = document.getElementById('recipeCategorySelect');
    recipeCategories.forEach(category => {
        let option = document.createElement('option');
        option.value = category._id;
        option.innerText = category.name;
        recipeSelect.appendChild(option);
    });
}

async function fetchFilteredRecipes() {
    const ingredientCategoryId = document.getElementById('ingredientCategorySelect').value;
    const recipeCategoryId = document.getElementById('recipeCategorySelect').value;
    const query = new URLSearchParams({
        ingredientCategory: ingredientCategoryId,
        recipeCategory: recipeCategoryId
    }).toString();
    const response = await fetch(`http://localhost:3000/recipes?${query}`);
    const filteredRecipes = await response.json();
    displayRecipes(filteredRecipes);
}

function displayRecipes(recipes) {
    const container = document.getElementById('recipesList');
    container.innerHTML = ''; // Clear previous contents
    recipes.forEach(recipe => {
        const recipeDiv = document.createElement('div');
        recipeDiv.innerHTML = `<h3>${recipe.name}</h3><p>${recipe.description}</p>`;
        container.appendChild(recipeDiv);
    });
}

// Load categories on page load
fetchCategories();

