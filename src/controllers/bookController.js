
const Book = require("../models/Book");
const { getFirestore } = require('firebase-admin/firestore');

const db = getFirestore();

// Create a new book
exports.createBook = async (req, res) => {
    try {
        const { title, author, genre, pages, isAvailable = true } = req.body;
    
        // Validation
        if (
            !title || !author || !genre ||
            pages === undefined || pages === null ||
            !Number.isInteger(pages) || pages <= 0
        ) {
            return res.status(400).json({
                error: "Missing or invalid required fields"
            });
        }

        const newBook = new Book(
            title,
            author,
            genre,
            pages,
            isAvailable
        );

        const docRef = await db.collection("books").add(
            newBook.toFirestore()
        );

        res.status(201).json({
            message: "Book created successfully",
            bookId: docRef.id
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};


// Get all books
exports.getAllBooks = async (req, res) => {
    try {
        const snapshot = await db.collection("books").get();

        const books = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.status(200).json({
            message: "Books fetched successfully",
            books: books
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};
