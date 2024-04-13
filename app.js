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

document.getElementById('show-login').addEventListener('click', function() {
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('signup-form').style.display = 'none';
});

// Show Signup Form
document.getElementById('show-signup').addEventListener('click', function() {
    document.getElementById('signup-form').style.display = 'block';
    document.getElementById('login-form').style.display = 'none';
});

// Handle Login Submission
document.getElementById('login-submit').addEventListener('click', function() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    fetch('http://localhost:3000/users/login', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
})
.then(response => response.json())
.then(data => {
    if(data.token) {
        // Store the token for future requests
        sessionStorage.setItem('token', data.token);
        // Redirect the user or update UI
        alert('Logged in successfully!');
    } else {
        // Handle any errors, such as login failure
        alert('Failed to log in. Please check your credentials.');
    }
})
.catch(error => {
    console.error('Error during login:', error);
});
});

// Handle Signup Submission
document.getElementById('signup-submit').addEventListener('click', function() {
    const username = document.getElementById('signup-username').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    fetch('http://localhost:3000/users/signup', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, email, password })
})
.then(response => response.json())
.then(data => {
    if(data.message) {
        // Handle successful signup, such as redirecting to login
        alert('Signed up successfully! Please log in.');
    } else {
        // Handle any signup errors
        alert('Failed to sign up. Please try again.');
    }
})
.catch(error => {
    console.error('Error during signup:', error);
});
});

