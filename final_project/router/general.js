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

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  let myPromise = new Promise((resolve,reject)=>{
    if(books){
      setTimeout(()=>{
        resolve(books);
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
