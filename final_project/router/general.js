const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

// === Register new user ===
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

// === Promise versions ===

// Get all books using Promise
public_users.get('/', function (req, res) {
  new Promise((resolve) => {
    resolve(books);
  }).then((data) => {
    res.send(JSON.stringify(data, null, 4));
  });
});

// Get book by ISBN using Promise
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject("No book found with this ISBN");
    }
  }).then((data) => res.send(JSON.stringify(data, null, 4)))
    .catch((err) => res.status(404).json({message: err}));
});

// Get books by author using Promise
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  new Promise((resolve, reject) => {
    let booksByAuthor = [];
    for (let key in books) {
      if (books[key].author === author) booksByAuthor.push(books[key]);
    }
    if (booksByAuthor.length > 0) resolve(booksByAuthor);
    else reject("No books found for this author");
  }).then((data) => res.send(JSON.stringify(data, null, 4)))
    .catch((err) => res.status(404).json({message: err}));
});

// Get books by title using Promise
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  new Promise((resolve, reject) => {
    let booksByTitle = [];
    for (let key in books) {
      if (books[key].title === title) booksByTitle.push(books[key]);
    }
    if (booksByTitle.length > 0) resolve(booksByTitle);
    else reject("No books found for this title");
  }).then((data) => res.send(JSON.stringify(data, null, 4)))
    .catch((err) => res.status(404).json({message: err}));
});

// Review  
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.send(JSON.stringify(books[isbn].reviews, null, 4));
  } else {
    res.status(404).json({message: "No book found"});
  }
});

module.exports.general = public_users;