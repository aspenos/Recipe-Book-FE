document.addEventListener('DOMContentLoaded', () => {
    const browseRecipesButton = document.getElementById('browseRecipes');
    browseRecipesButton.addEventListener('click', fetchAllRecipes);

    const filterButton = document.getElementById('filterButton'); // Reference to filter button
    filterButton.addEventListener('click', fetchFilteredRecipes);

    fetchRecipeCategories(); // Fetch categories when the document is ready
});

  // Show Login Form
  document.getElementById('show-login').addEventListener('click', () => {
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('signup-form').style.display = 'none';
    document.getElementById('show-login').style.display = 'none';
    document.getElementById('show-signup').style.display = 'block';
});

 // Show Signup Form
 document.getElementById('show-signup').addEventListener('click', () => {
    document.getElementById('signup-form').style.display = 'block';
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('show-signup').style.display = 'none';
    document.getElementById('show-login').style.display = 'block';
});

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
            // Update UI
            document.getElementById('login-form').style.display = 'none';
            document.getElementById('signup-form').style.display = 'none';
            document.getElementById('show-login').style.display = 'none';
            document.getElementById('show-signup').style.display = 'none';
            document.getElementById('logoutButton').style.display = 'block';
            alert('Logged in successfully!');
        } else {
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
            alert('Signed up successfully! Please log in.');
        } else {
            alert('Failed to sign up. Please try again.');
        }
    })
    .catch(error => {
        console.error('Error during signup:', error);
    });
});

// Handle Logout
document.getElementById('logoutButton').addEventListener('click', function() {
    // Remove the token from storage
    sessionStorage.removeItem('token');

    // Update UI
    document.getElementById('logoutButton').style.display = 'none';
    document.getElementById('show-login').style.display = 'block';
    document.getElementById('show-signup').style.display = 'block';

    // Optionally redirect the user
    window.location.href = '/'; // Redirects to the home page
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
