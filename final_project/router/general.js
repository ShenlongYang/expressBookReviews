const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

// Task 6: Register new user
public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      return res.status(400).json({message: "Username already exists"});
    }
    users.push({"username": username, "password": password});
    return res.status(200).json({message: "User successfully registered. Now you can login"});
  } 
  return res.status(400).json({message: "Username and password are required"});
});

// Task 10: Get all books using Axios
public_users.get('/', function (req, res) {
  axios.get('http://localhost:5000/')
    .then(response => res.send(response.data))
    .catch(err => res.status(500).json({message: err.message}));
});

// Task 11: Get book by ISBN using Axios
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  axios.get(`http://localhost:5000/isbn/${isbn}`)
    .then(response => res.send(response.data))
    .catch(err => res.status(404).json({message: "No book found with this ISBN"}));
});

// Task 12: Get books by author using Axios
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  axios.get(`http://localhost:5000/author/${author}`)
    .then(response => res.send(response.data))
    .catch(err => res.status(404).json({message: "No books found for this author"}));
});

// Task 13: Get books by title using Axios
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  axios.get(`http://localhost:5000/title/${title}`)
    .then(response => res.send(response.data))
    .catch(err => res.status(404).json({message: "No books found for this title"}));
});

// Task 5: Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.send(JSON.stringify(books[isbn].reviews, null, 4));
  } else {
    res.status(404).json({message: "No book found"});
  }
});

module.exports.general = public_users;