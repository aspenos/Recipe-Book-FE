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
    document.getElementById('profileButton').style.display = 'block';
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
            sessionStorage.setItem('userId', data.userId);
            alert('Logged in successfully!');
            // Update UI
            document.getElementById('login-form').style.display = 'none';
            document.getElementById('signup-form').style.display = 'none';
            document.getElementById('show-login').style.display = 'none';
            document.getElementById('show-signup').style.display = 'none';
            document.getElementById('logoutButton').style.display = 'block';
            displayRecipes();
            
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
    document.getElementById('profileButton').style.display = 'none';

    // Optionally redirect the user
    window.location.href = '/'; // Redirects to the home page
});

document.getElementById('show-recipe-form').addEventListener('click', () => {
    document.getElementById('recipe-form').style.display = 'block';
});

document.getElementById('add-recipe').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent the form from submitting traditionally, which refreshes the page
    const name = document.getElementById('recipe-name').value;
    const description = document.getElementById('recipe-description').value;
    const instructions = document.getElementById('recipe-instructions').value.split('\n');
    const ingredients = document.getElementById('recipe-ingredients').value.split(',').map(ingredient => ingredient.trim());
    const categories = Array.from(document.getElementById('recipe-categories').selectedOptions).map(option => option.value);
    const allergens = Array.from(document.getElementById('recipe-allergens').selectedOptions).map(option => option.value);
    const image = document.getElementById('recipe-image').value;

    const recipeData = {
        name,
        description,
        instructions,
        ingredients,
        categories,
        allergens,
        image
    };

    const token = sessionStorage.getItem('token');  // Retrieve the stored token

    fetch('http://localhost:3000/recipes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`  // Include the token in the request header
        },
        body: JSON.stringify(recipeData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.name) {  // Assuming the response will have the recipe name if successful
            alert('Recipe added successfully!');
            document.getElementById('recipe-input-form').reset();  // Resetting the form
            document.getElementById('recipe-form').style.display = 'none';  // Hiding the form
        } else {
            alert('Failed to add recipe. Please try again.');
        }
    })
    .catch(error => {
        console.error('Error adding recipe:', error);
    });
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

function displayRecipes(recipes = []) { // Set a default parameter to ensure it's always an array
    const recipesListContainer = document.getElementById('recipesList');
    recipesListContainer.innerHTML = ''; // Clear previous contents
    if (recipes.length > 0) {
        recipes.forEach(recipe => {
            const recipeDiv = document.createElement('div');
            recipeDiv.className = 'recipe';
            recipeDiv.innerHTML = `
                <h3>${recipe.name}</h3>
                <p>${recipe.description}</p>
                <img src="${recipe.image}" alt="${recipe.name}">
                <button onclick="fetchRecipeDetails('${recipe._id}')">View Details</button>
                ${sessionStorage.getItem('token') ? `<button onclick="addFavorite('${recipe._id}')">Favorite</button>` : ''} 
            `; // Conditionally display the Favorite button based on token presence
            recipesListContainer.appendChild(recipeDiv);
        });
    } else {
        recipesListContainer.innerHTML = '<p>No recipes found.</p>'; // Display a message if no recipes are available
    }
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

function addFavorite(recipeId) {
    const userId = sessionStorage.getItem('userId'); // Ensure userId is stored during login
    const token = sessionStorage.getItem('token');

    fetch(`http://localhost:3000/users/${userId}/favorites/${recipeId}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) throw new Error('Failed to add to favorites');
        return response.json();
    })
    .then(data => {
        alert('Recipe added to favorites!');
    })
    .catch(error => {
        console.error('Error adding favorite:', error);
        alert('Failed to add favorite. Please try again.');
    });
}

function showProfile() {
    const userId = sessionStorage.getItem('userId');
    const token = sessionStorage.getItem('token');
    if (userId && token) {
        document.getElementById('userProfile').style.display = 'block';
        fetchUserRecipes(userId, token);
        fetchUserFavorites(userId, token);
    } else {
        alert("You are not logged in.");
    }
}

function fetchUserRecipes(userId, token) {
    fetch(`http://localhost:3000/users/${userId}/recipes`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(recipes => {
        displayUserRecipes(recipes);
    })
    .catch(error => console.error('Error fetching user recipes:', error));
}

function displayUserRecipes(recipes) {
    const container = document.getElementById('userRecipesList');
    container.innerHTML = ''; // Clear previous contents
    recipes.forEach(recipe => {
        const div = document.createElement('div');
        div.className = 'recipe';
        div.innerHTML = `
            <h4>${recipe.name}</h4>
            <p>${recipe.description}</p>
            <button onclick="showEditInstructionsForm('${recipe._id}', \`${recipe.instructions.join('\n')}\`)">Edit Instructions</button>
        `;
        container.appendChild(div);
    });
}

function showEditInstructionsForm(recipeId, instructions) {
    document.getElementById('instructions-input').value = instructions; // Set the current instructions in the textarea
    document.getElementById('edit-recipe-id').value = recipeId; // Store the recipe ID in a hidden input
    document.getElementById('edit-instructions-form').style.display = 'block'; // Show the form
}

function submitUpdatedInstructions() {
    const recipeId = document.getElementById('edit-recipe-id').value;
    const updatedInstructions = document.getElementById('instructions-input').value;

    fetch(`http://localhost:3000/recipes/${recipeId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        },
        body: JSON.stringify({ instructions: updatedInstructions })
    })
    .then(response => response.json())
    .then(data => {
        alert('Instructions updated successfully!');
        document.getElementById('edit-instructions-form').style.display = 'none'; // Hide the form
        showProfile(); // Optionally refresh the profile to show updated info
    })
    .catch(error => {
        console.error('Failed to update instructions:', error);
        alert('Failed to update instructions.');
    });
}



function fetchUserFavorites(userId, token) {
    fetch(`http://localhost:3000/users/${userId}/favorites`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(favorites => {
        displayUserFavorites(favorites);
    })
    .catch(error => console.error('Error fetching favorites:', error));
}

function displayUserFavorites(favorites) {
    const container = document.getElementById('userFavoritesList');
    container.innerHTML = ''; // Clear previous contents
    favorites.forEach(favorite => {
        const div = document.createElement('div');
        div.innerHTML = `<h4>${favorite.name}</h4><p>${favorite.description}</p>`;
        container.appendChild(div);
    });
}
