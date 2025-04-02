const express = require('express');
const { Book, books } = require('../models/books');
const public_users = express.Router();


async function getBooks(res, method, searchValue) {
  if (!method) return res.status(404).send(`It wasn't possibly to find book since ${method} wasn't provided`);
  const books = await Book.getBooksBy(method, searchValue);
  if (books.length < 1) return res.status(404).send(`There are no books with ${method} with ${searchValue} coincidence.`);
  return res.status(200).json({books});
}

public_users.post("/register", (req,res) => {
  console.log('Received body', req.body);
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) return res.status(400).send(`Username or password wasn't provided.`);
  const { getUsers, addUser } = require('../models/users');
  if (getUsers().find((el) => el.username === username)) return res.status(400).send('This username is already taken. Please use another.');
  const newUser = addUser(username, password);
  res.status(201).send(`User ${newUser} added succesfully!!!`);
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.status(200).json({ books });
});

// Get book details based on ISBN
public_users.get('/isbn/:ISBN', async function (req, res) {
  const { ISBN } = req.params;
  await getBooks(res, 'ISBN', ISBN);
 });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  const { author } = req.params;
  await getBooks(res, 'author', author);
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  const { title } = req.params;
  await getBooks(res, 'title', title);
});

//  Get book review
public_users.get('/review/:ISBN',function (req, res) {
  const { ISBN } = req.params;
  if (!ISBN) return res.status(400).send(`ISBN wasn't provided.`);
  const reviews = Book.getReviews(ISBN);
  if (!reviews) return res.status(404).send(`Book with ${ISBN} ISBN wasn't found.`);
  res.status(200).json({reviews});
});

module.exports = public_users;
