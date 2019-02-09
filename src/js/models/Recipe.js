import axios from 'axios';
import {proxy, key} from '../config';

export default class Recipe {
    constructor(id) {           // this "id" is the recipe identificator
        this.id = id;
    }

    async getRecipe() {
        try {
            const res = await axios(`${proxy}https://www.food2fork.com/api/get?key=${key}&rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.title = res.data.recipe.title;
            this.ingredients = res.data.recipe.ingredients;
        } catch (error) {
            console.log(error);
            alert('Something went wrong')
        }
    }

    calcTime() {  
        // Assuming that we need 15 min for each 3 ingredients
        const numIng = this.ingredients.length;  // number of ingredients
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }

    calcServings() {
        this.servings = 4;
    }

    parseIngredients() {
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitsShort, 'kg', 'g'];

        const newIngredients = this.ingredients.map( el => {
            // 1- Uniform units
            let ingredient = el.toLowerCase();
            unitsLong.forEach( (current, index) => {
                // Replacing the long units with the short onces everytime a long unit appears in the ingredients
                ingredient = ingredient.replace(current, unitsShort[index]);
            });

            // 2- Remove parentheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            // 3- Parse ingredients into count, unit and ingredients
            const arrIng = ingredient.split(' ');  // new array of ingredients
            const unitIndex = arrIng.findIndex(current2 => units.includes(current2)); // returns the index of each unit in the array "arrIng"

            let objIng;
            if (unitIndex > -1) {
                // There is a unit
                // Ex. 4 1/2 cups, arrCount is [4, 1/2]
                // Ex. 4 cups, arrCount is [4]
                const arrCount = arrIng.slice(0, unitIndex);                
                let count;
                if (arrCount.length === 1) {
                    count = eval(arrIng[0]);
                } else {
                    count = eval(arrCount.join('+').replace('-', '+'));
                }

                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                }

            } else if (parseInt(arrIng[0], 10)) {
                // There is NO unit, but 1st element is a number
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit:'',
                    ingredient: arrIng.slice(1).join(' ') // the entire array except the first element and putted together in a string(.join)
                }
            } else if (unitIndex === -1) {
                // There is NO unit and NO number in 1st position
                objIng = {
                    count: 1,
                    unit:'',
                    ingredient // it's the same of write "ingredient: ingredient"
                }
            }

            return objIng;  // this is the returned value for newIngredients
        });
        this.ingredients = newIngredients;
    }

    updateServings (type) {
        // Servings
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;
        
        // Ingredients
        this.ingredients.forEach(ing => {
            ing.count *= (newServings / this.servings); // updating the "count" of each ingredient
        })

        this.servings = newServings;
    }
}