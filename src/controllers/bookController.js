
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


// Update an existing book (PUT)
exports.updateBook = async (req, res) => {
    try {
        const bookId = req.params.id;
        const updatedData = req.body;

        // Check if the request body is empty
        if (!updatedData || Object.keys(updatedData).length === 0) {
            return res.status(400).json({
                error: "Please provide book information to update"
            });
        }

        // Find the book in Firestore
        const bookRef = db.collection("books").doc(bookId);

        // Check if the book exists
        const bookSnapshot = await bookRef.get();

        if (!bookSnapshot.exists) {
            return res.status(404).json({
                error: "Book not found"
            });
        }

        // Validate allowed fields
        const allowedFields = [
            "title",
            "author",
            "genre",
            "pages",
            "isAvailable"
        ];

        const invalidFields = Object.keys(updatedData).filter(
            field => !allowedFields.includes(field)
        );

        if (invalidFields.length > 0) {
            return res.status(400).json({
                error: "Invalid fields provided",
                invalidFields
            });
        }

        // Validate pages
        if (
            updatedData.pages !== undefined &&
            (!Number.isInteger(updatedData.pages) ||
             updatedData.pages <= 0)
        ) {
            return res.status(400).json({
                error: "Pages must be a positive integer"
            });
        }

        // Validate availability
        if (
            updatedData.isAvailable !== undefined &&
            typeof updatedData.isAvailable !== "boolean"
        ) {
            return res.status(400).json({
                error: "isAvailable must be true or false"
            });
        }

        // Update book in Firebase Firestore
        await bookRef.update(updatedData);

        res.status(200).json({
            message: "Book successfully updated!",
            bookId: bookId,
            updatedData: updatedData
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};


