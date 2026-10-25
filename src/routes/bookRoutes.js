
// src/routes/bookRoutes.js

const express = require("express");
const router = express.Router();

const bookController = require("../controllers/bookController");

// POST / - Create a new book
router.post("/create", bookController.createBook);
router.get("/getAll", bookController.getAllBooks);

module.exports = router;
