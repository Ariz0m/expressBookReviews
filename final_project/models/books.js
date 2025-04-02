class Reviews {
    constructor() {}

    changeReview(username, description) {
        if(!username || !description) throw new Error(`Can't add or modify review if username or description isn't specified.`);
        return this[username] = description;
    }

    removeReview(username) {
        return delete this[username];
    }
}

module.exports.Book = class Book {
    constructor(author, title, ISBN) {
        this.author = author;
        this.title = title;
        this.ISBN = ISBN;
        this.reviews = new Reviews();
    }
    
    /**
     * Creates Book instances from the original booksdb.js file
     */
    static #fromBooks(books) {
        const listOfBooks = [];
        Object.keys(books).forEach(
            (property) => {
                let element = books[`${property}`];
                element = new Book(element.author, element.title, element.ISBN);
                listOfBooks.push(element);
            }
        );

        return listOfBooks;
    }
    
    static defaultBooks = Book.#fromBooks(
        {
            1: {"author": "Chinua Achebe","title": "Things Fall Apart", "ISBN": "9780385667838","reviews": new Reviews() },
            2: {"author": "Hans Christian Andersen","title": "Fairy tales", "ISBN": "9788171674404", "reviews": new Reviews() },
            3: {"author": "Dante Alighieri","title": "The Divine Comedy", "ISBN": "9781840221664", "reviews": new Reviews() },
            4: {"author": "Unknown","title": "The Epic Of Gilgamesh", "ISBN": "9780140441000", "reviews": new Reviews() },
            5: {"author": "Unknown","title": "The Book Of Job", "ISBN": "9788179773376", "reviews": new Reviews() },
            6: {"author": "Unknown","title": "One Thousand and One Nights", "ISBN": "9780140442892", "reviews": new Reviews() },
            7: {"author": "Unknown","title": "Njáls saga", "ISBN": "9780140447699", "reviews": new Reviews() },
            8: {"author": "Jane Austen","title": "Pride and Prejudice", "ISBN": "9780141439518", "reviews": new Reviews() },
            9: {"author": "Honoré de Balzac","title": "Le Père Goriot", "ISBN": "9781986506717", "reviews": new Reviews() },
            10: {"author": "Samuel Beckett","title": "Molloy, Malone Dies, The Unnamable, the trilogy", "ISBN": "9780375400704", "reviews": new Reviews() }
      }
    );

    static getBooksBy(method, searchValue) {
        const books = new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(this.defaultBooks.filter((book) => book[`${method}`] === searchValue))
            }, 1000);
        });
        return books;
    }

    static getReviews(ISBN) {
        const book = this.defaultBooks.find((el) => el.ISBN === ISBN);
        return book.reviews;
    }
}

module.exports.books = this.Book.defaultBooks;
