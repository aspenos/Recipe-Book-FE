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
