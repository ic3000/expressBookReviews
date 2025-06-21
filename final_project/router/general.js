
const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: "Username and password are required." });
    if (isValid(username)) return res.status(409).json({ message: "Username already exists." });
    users.push({ username, password });
    return res.status(201).json({ message: "User successfully registered." });
});

public_users.get('/', function (req, res) {
    return res.status(200).send(JSON.stringify(books, null, 4));
});

public_users.get('/isbn/:isbn', function (req, res) {
    const book = books[req.params.isbn];
    if (book) return res.status(200).json(book);
    return res.status(404).json({ message: "Book not found for the given ISBN." });
});

public_users.get('/author/:author', function (req, res) {
    const author = req.params.author.toLowerCase();
    const result = Object.entries(books).filter(([isbn, book]) => book.author.toLowerCase() === author)
        .map(([isbn, book]) => ({ isbn, ...book }));
    if (result.length > 0) return res.status(200).json(result);
    return res.status(404).json({ message: "No books found for the given author." });
});

public_users.get('/title/:title', function (req, res) {
    const title = req.params.title.toLowerCase();
    const result = Object.entries(books).filter(([isbn, book]) => book.title.toLowerCase() === title)
        .map(([isbn, book]) => ({ isbn, ...book }));
    if (result.length > 0) return res.status(200).json(result);
    return res.status(404).json({ message: "No books found with the given title." });
});

public_users.get('/review/:isbn', function (req, res) {
    const book = books[req.params.isbn];
    if (book) return res.status(200).json(book.reviews);
    return res.status(404).json({ message: "Book not found for the given ISBN." });
});

module.exports.general = public_users;
