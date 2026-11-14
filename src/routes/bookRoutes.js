
// src/routes/bookRoutes.js

const express = require("express");
const router = express.Router();

const bookController = require("../controllers/bookController");

// POST / - Create a new book
router.post("/create", bookController.createBook);
router.get("/getAll", bookController.getAllBooks);
router.put("/update/:id", bookController.updateBook);
// router.delete("/delete/:id", bookController.deleteBook);

module.exports = router;
