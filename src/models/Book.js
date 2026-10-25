class Book {
    constructor(title, author, genre, pages, isAvailable = true) {
        this.title = title;
        this.author = author;
        this.genre = genre;
        this.pages = pages;
        this.isAvailable = isAvailable;
    }

    toFirestore() {
        return {
            title: this.title,
            author: this.author,
            genre: this.genre,
            pages: this.pages,
            isAvailable: this.isAvailable
        };
    }
}

module.exports = Book;