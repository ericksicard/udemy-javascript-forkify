/*
* TESTING EXAMPLE
*
// Default Export
import str from './models/Search';

// Named Export
// First variant
import {add, multiply, ID} from './views/searchViews';
console.log(`Using imported functions! ${add(ID, 2)} and ${multiply(5, 3)}. ${str}`);

// Second variant
import {add as a, multiply as m, ID as id} from './views/searchViews';
console.log(`Using imported functions! ${a(id, 2)} and ${m(5, 3)}. ${str}`);

// Third variant
import * as searchView from './views/searchViews';  // Importing everything and putting on "searchView" variable
console.log(`Using imported functions! ${searchView.add(searchView.ID, 2)} and ${searchView.multiply(5, 3)}. ${str}`);

//Output: Using imported functions! 25 and 15. I am an exported string.

*/

// Global app controller
// https://www.food2fork.com/api/search

import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import * as searchView from './views/searchViews';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import { elements, renderLoader, clearLoader } from './views/base';
import Likes from './models/Likes';

/** Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */
const state= {};

/**
 * SEARCH CONTROLLER
 */
const controlSearch = async () => {
    // 1- Get the query from the view
    const query = searchView.getInput();
    
    // 1.1- Create a new serach object
    if (query) {
        // 2- New "search" object and add it to state
        state.search = new Search(query);

        // 3- Prepare the UI for new results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        try {
            // 4- Search for recipes
            await state.search.getResults();  // The API responds(recipes) are stored in "state.search.result"

            // 5- Reder results on UI
            clearLoader();
            searchView.renderResults(state.search.result);

        } catch (error) {
            alert ('Something wrong while doing the search...'); //'Something wrong while doing the search...''
            clearLoader();
        }        
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');    // ".closest()" method let us to target the button, based on the given parameter ".btn-inline"
    
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);  // "goto" is the name we specified using the "data" attribute in HTML5
                                                          //when we were generating the button's HTML in "searchViews.js"
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
});


/**
 * RECIPE CONTROLLER
 */

const controlRecipe = async () => {
    // Getting the id from the URL
    const id = window.location.hash.replace('#', '');     // getting the hash ("window.location" is the entire URL)

    if (id) {
        // Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // Highlight selected search item
        if (state.search) searchView.highlightSelected(id);

        // Create new recipe object
        state.recipe = new Recipe(id);  // "state" is the central place to store the data

        try {
            // Get recipe data and parse ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();        

            // Calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();

            // Render recipe
            clearLoader();
            recipeView.renderRecipe(
                state.recipe,
                state.likes.isLiked(id));

        } catch (error) {
            alert('Error processing recipe')
        }
    }
}
/*
* window.addEventListener('hashchange', controlRecipe);
* window.addEventListener('load', controlRecipe);     // in order to keep the last information displayed
*/
// Adding the same event listener to two events
['hashchange', 'load'].forEach( event => window.addEventListener(event, controlRecipe) );


/**
 * LIST CONTROLLER
 */

const controlList = () => {
    // Create a list IF there is none yet
    if (!state.list) state.list = new List();

    // Add each ingredients to the list and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
}

// Handle delete and update list item events
elements.shopping.addEventListener('click', e => {
    // the click will go to the closet shopping list item and then we read the id from it.
    const id = e.target.closest('.shopping__item').dataset.itemid;

    // Handle the delete button
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // Delete from state
        state.list.deleteItem(id);
        // Delete from UI
        listView.deleteItem(id);

    // Handle the count update    
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);  // we can read the ".value" property of an input element
        state.list.updateCount(id, val);    
    }
});

/**
 * LIKE CONTROLLER
 */

const controlLike = () => {
    if (!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;

    // User has NOT yet liked current recipe
    if (!state.likes.isLiked(currentID)) {
        // Add like to the data
        const newLike = state.likes.addLikes( // "newLike" recibe the returned element from "addLikes" function
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );

        // Toggle the like button
        likesView.toggleLikeBtn(true);

        // Addlike to the UI list
        likesView.renderLike(newLike);
        console.log(state.likes);

    // User HAS liked current recipe
    } else {
        // Remove like to the data
        state.likes.removeLike(currentID);

        // Toggle the like button
        likesView.toggleLikeBtn(false);

        // Remove like to the UI list
        likesView.deleteLike(currentID);
        console.log(state.likes);
    }
    // Show the list of liked recipies
    likesView.toggleLikeMenu(state.likes.getNumLikes());
};

// Restore liked recipes on page load
window.addEventListener('load', () => {
    state.likes = new Likes();
    
    // Restore likes
    state.likes.readStorage();
    
    // Toggle like menu button
    likesView.toggleLikeMenu(state.likes.getNumLikes());

    // Render the existing likes
    state.likes.likes.forEach(like => likesView.renderLike(like));
})



// Handling recipe button clicks
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) { // selecting the HTML element which "btn-decrease" class and its childs
        // Decrease button is clicked
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }      

    } else if (e.target.matches('.btn-increase, .btn-increase *')) { // selecting the HTML element which "btn-increase" class and its childs
        // Increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);

    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        // Add ingredients to shopping list
        controlList();

    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        // Call the "like controller"
        controlLike();
    }
});
