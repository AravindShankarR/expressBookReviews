const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if(username && password){
    if(!isValid(username)){  //isValid checks if the user is present in the database or not
      users.push({"username":username,"password":password});
      res.status(200).json({message:"User registered successfully"});
    }
    else{
      res.status(404).json({message:"Username already exists"});
    }
  return res.status(404).json({message: "Unable to register"});
  }
});

function getBooks() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(books);
    }, 2000);
  });
}

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  try {
    // Assume getBooks is a function that returns a Promise that resolves with the list of books
    const books = await getBooks();
    res.send(books);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  let myPromise = new Promise((resolve,reject)=>{
    if(books[isbn]){
      setTimeout(()=>{
        resolve(books[isbn]);
      },2000);
      
    }
    else{
      reject("Error");
    }
  });
  myPromise.then((book)=>{
    res.send(JSON.stringify(book,null,4));
  }).catch((err)=>{
    res.send(err);
  });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  let booksByAuthor = {};
  let myPromise = new Promise((resolve,reject)=>{
  for (let isbn in books) {
    if (books[isbn].author === author) {
      booksByAuthor[isbn] = books[isbn];
      
    }
    if(booksByAuthor){
      setTimeout(()=>{
        resolve(booksByAuthor);
      },2000);
    }
    else{
      reject("Error");
    }
  }
});
  myPromise.then((booksByAuthor)=>{
    res.send(booksByAuthor);
  });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let booksByTitle = {};
  let title = req.params.title;
  let myPromise = new Promise((resolve,reject)=>{
    for (let isbn in books) {
      if (books[isbn].title === title) {
        booksByTitle[isbn] = books[isbn];
      }
    }
    if(booksByTitle){
      setTimeout(()=>{
        resolve(booksByTitle);
      },2000);
    }
    else{
      reject("Error");
    }
  });
  myPromise.then((books)=>{
    res.send(JSON.stringify(books,null,4));
  }).catch((err)=>{
    res.send(err);
  });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});

module.exports.general = public_users;
