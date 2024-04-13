document.addEventListener('DOMContentLoaded', () => {
    const browseRecipesButton = document.getElementById('browseRecipes');
    browseRecipesButton.addEventListener('click', fetchAllRecipes);

    const filterButton = document.getElementById('filterButton'); // Reference to filter button
    filterButton.addEventListener('click', fetchFilteredRecipes);

    fetchRecipeCategories(); // Fetch categories when the document is ready
});

function fetchAllRecipes() {
    fetch('http://localhost:3000/recipes')
        .then(response => response.json())
        .then(displayRecipes)
        .catch(console.error);
}

function fetchRecipeCategories() {
    fetch('http://localhost:3000/recipe-categories')
        .then(response => response.json())
        .then(categories => {
            const recipeCategorySelect = document.getElementById('recipeCategorySelect');
            categories.forEach(category => {
                let option = document.createElement('option');
                option.value = category._id;
                option.innerText = category.name;
                recipeCategorySelect.appendChild(option);
            });
        })
        .catch(console.error);
}

function fetchFilteredRecipes() {
    const recipeCategoryId = document.getElementById('recipeCategorySelect').value;
    fetch(`http://localhost:3000/recipes?recipeCategory=${recipeCategoryId}`)
        .then(response => response.json())
        .then(displayRecipes)
        .catch(console.error);
}

function displayRecipes(recipes) {
    const recipesListContainer = document.getElementById('recipesList');
    recipesListContainer.innerHTML = ''; // Clear previous contents
    recipes.forEach(recipe => {
        const recipeDiv = document.createElement('div');
        recipeDiv.className = 'recipe';
        recipeDiv.innerHTML = `
            <h3>${recipe.name}</h3>
            <p>${recipe.description}</p>
            <img src="${recipe.image}" alt="${recipe.name}">
            <button onclick="fetchRecipeDetails('${recipe._id}')">View Details</button>
        `;
        recipesListContainer.appendChild(recipeDiv);
    });
}

function fetchRecipeDetails(recipeId) {
    fetch(`http://localhost:3000/recipes/${recipeId}`)
        .then(response => response.json())
        .then(displayRecipeDetails)
        .catch(console.error);
}

function displayRecipeDetails(recipe) {
    const detailsDiv = document.getElementById('recipeDetails');
    detailsDiv.innerHTML = `
        <h2>${recipe.name}</h2>
        <img src="${recipe.image}" alt="Image of ${recipe.name}">
        <p>${recipe.description}</p>
        <ul>${recipe.instructions.map(step => `<li>${step}</li>`).join('')}</ul>
        <p>Ingredients: ${recipe.ingredients.map(ingredient => ingredient.name).join(', ')}</p>
        <p>Categories: ${recipe.categories.map(category => category.name).join(', ')}</p>
        <p>Allergens: ${recipe.allergens.map(allergen => allergen.name).join(', ')}</p>
    `;
    detailsDiv.style.display = 'block';
    window.location.href = '#recipeDetails'; // Scrolls to the details section
}
