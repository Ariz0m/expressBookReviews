const express = require('express');
const jwt = require('jsonwebtoken');
const { Book } = require('../models/books');
const regd_users = express.Router();

function authenticatedUser(username, password) {
  const users = require('../models/users').getUsers();
  return !!users.find( (us) => us.username === username && us.password === password);
}
 
//only registered users can login
regd_users.post("/login", (req,res) => {
  const { username, password } = req.body;
  if (!authenticatedUser(username, password)) return res.status(400).send('Invalid login.');
  const token = jwt.sign( { username, password }, 'Messi', { expiresIn: 60 * 60 * 1000 });
  req.session.authorization = { token, username };
  res.status(201).send('User logged!');
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.body;
  const { username } = req.session.authorization;
  if (!isbn || !username || !review ) return res.status(400).send(`Be sure to provide isbn, username and review.`);
  const reviews = Book.getReviews(isbn);
  const addedReview = reviews.changeReview(username, review);
  res.status(202).json({ message: `Review added!`, addedReview});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { username } = req.session.authorization;
  if (!isbn || !username ) return res.status(400).send(`Be sure to provide isbn, username and review.`);
  const reviews = Book.getReviews(isbn);
  const reviewWasRemoved = reviews.removeReview(username);
  if (!reviewWasRemoved) return res.status(500).send(`The review wasn't found or was already removed.`);
  res.status(202).send(`Review was removed succesfully.`);
});

module.exports = regd_users;

