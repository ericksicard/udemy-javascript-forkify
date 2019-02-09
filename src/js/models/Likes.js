export default class Likes {
    constructor() {
        this.likes = [];
    }

    addLikes(id, title, author, img) {
        const like = { id, title, author, img };
        this.likes.push(like);

        // Persist data in localStorage
        this.persistData();             // it's a method on this exact object (".this")

        return like;
    }

    removeLike(id) {
        const index = this.likes.findIndex(el => el.id === id);
        this.likes.splice(index, 1);

        // Persist data in localStorage
        this.persistData();             // it's a method on this exact object (".this")
    }

    isLiked(id) {
        return this.likes.findIndex( el => el.id === id) !== -1;
    }

    getNumLikes() {
        return this.likes.length;
    }

    persistData() {
        localStorage.setItem('likes', JSON.stringify(this.likes));  // localStorage works with strings ("JSON.stringify")
    }

    readStorage() {
        const storage = JSON.parse(localStorage.getItem('likes'));

        // Restoring likes from the localStorage
        if (storage) this.likes = storage;
    }
}