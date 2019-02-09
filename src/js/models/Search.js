/*
* TESTING EXAMPLE
* Default Export is the one we use when we only wnat to export one thing from a module.

export default 'I am an exported string.'; 

*/

import axios from 'axios';   // npm package "axios" to deal with the "fetch" incompatibility for soem olders browsers
                            // axios works the exact same way as fetch and it automatically return JSON
import {proxy, key} from '../config';

export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResults(query) {
        try {
            const res = await axios({
                method: 'get',
                url: `${proxy}https://www.food2fork.com/api/search?key=${key}&q=${this.query}`
            });
            this.result = res.data.recipes;
        } catch (error) {
            alert(error);
        }    
    }
}


