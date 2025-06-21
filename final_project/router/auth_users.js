
const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
    { username: "john", password: "password123" },
    { username: "alice", password: "qwerty" }
];

const isValid = (username) => {
    return users.some(user => user.username === username);
};

const authenticatedUser = (username, password) => {
    return users.some(user => user.username === username && user.password === password);
};

regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
    }

    if (!authenticatedUser(username, password)) {
        return res.status(401).json({ message: "Invalid login credentials" });
    }

    const accessToken = jwt.sign({ username: username }, "access", { expiresIn: '1h' });

    req.session.authorization = { accessToken: accessToken };

    return res.status(200).json({ message: "User successfully logged in", token: accessToken });
});

regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.body.review;
    const username = req.user.username;

    if (!books[isbn]) return res.status(404).json({ message: "Book not found." });
    if (!review) return res.status(400).json({ message: "Review is required." });

    books[isbn].reviews[username] = review;
    return res.status(200).json({ message: "Review added/updated successfully.", reviews: books[isbn].reviews });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.user.username;

    if (!books[isbn]) return res.status(404).json({ message: "Book not found." });
    if (!books[isbn].reviews[username]) return res.status(404).json({ message: "No review found to delete." });

    delete books[isbn].reviews[username];
    return res.status(200).json({ message: "Review deleted successfully.", reviews: books[isbn].reviews });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
