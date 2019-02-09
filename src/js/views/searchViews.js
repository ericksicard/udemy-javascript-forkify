/*
* TESTING EXAMPLE
* Named Export is used when we want to export multiple things from the same module.

export const add = ( a,b ) => a + b;
export const multiply = ( a,b ) => a * b;
export const ID = 23;

*/

import {elements} from './base';
export const getInput = () => elements.searchInput.value;

export const clearResults = () => {         // Clearing the list of results
    elements.resultList.innerHTML = '';
    elements.searchResPages.innerHTML = '';
};

export const clearInput = () => {           // Clearing the search box
    elements.searchInput.value = '';
};

export const highlightSelected = id => {    // Highliting the recipe selected from the list.
    document.querySelector(`.results__link[href="#${id}"]`).classList.add('.results__link--active');
}

// Reducing the title's length(algorithm)
/** Ex: 'Pasta with tomato and spinach'
 * accumulator: 0 / accumulator + current.length = 5 / newTitle = ['Pasta']
 * accumulator: 5 / accumulator + current.length = 9 / newTitle = ['Pasta', 'with']
 * accumulator: 9 / accumulator + current.length = 15 / newTitle = ['Pasta', 'with', 'tomato']
 * accumulator: 15 / accumulator + current.length = 18 / newTitle = ['Pasta', 'with', 'tomato']
 * accumulator: 18 / accumulator + current.length = 24 / newTitle = ['Pasta', 'with', 'tomato']
 */
export const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];
    if (title.length > limit) {
        title.split(' ').reduce((accumulator, current) => {     // The "reduce" method already has the accumulator built in.
            if (accumulator + current.length <= limit) {
                newTitle.push(current);
            }
            return accumulator + current.length;    // this value updates the accumulator
        }, 0);
        // return the result
        return `${newTitle.join(' ')}...`;        
    }
    return title;
}

const renderRecipe = recipe => {    // Independent-private function to handle HTML manupilation and insertion
    const markup = `
        <li>
            <a class="results__link" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
    `;
    elements.resultList.insertAdjacentHTML('beforeend', markup);
};

// Independent- private funtion to generate the "pagination buttons" HTML
// HTML5's "data" attribute let us specify a random name
// type: pre or next
const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
        <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
    </button>
`

// Independent- private funtion to create and insert the "pagination buttons"
const renderButtons = (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults / resPerPage);    // This function "Math.ceil" rounds up the number of pages
    
    // Creating the pagination buttons
    let button;    
    if (page === 1 && pages > 1) {
        // Only button go to the next page
        button = createButton(page, 'next');
    } else if (page < pages) {
        // Both buttons
        button = `
            ${createButton(page, 'prev')}
            ${createButton(page, 'next')}
        `;
    } else if (page === pages && pages > 1) {
        // Only button go to the prev page
        button = createButton(page, 'prev');
    }

    //Inserting the pagination buttons into the DOM
    elements.searchResPages.insertAdjacentHTML('afterbegin', button)
};

export const renderResults = (recipes, page = 1, resPerPage = 10) => {  // Limiting the number of results per page
    // render result of current page
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;

    recipes.slice(start, end).forEach(renderRecipe);  // This is the same of saying "recipes.forEach(el => renderRecipe(el));"

    // render the pagination buttons
    renderButtons(page, recipes.length, resPerPage);
};