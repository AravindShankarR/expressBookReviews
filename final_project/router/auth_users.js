const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  let userwithUsername = users.filter((user)=>{
    return user.username === username;
  });
  if(userwithUsername.length > 0){
    return true;
  }
  else{
    return false;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if the user is authenticated
  let validUsers = users.filter((user)=>{
    return user.username === username && user.password === password;
  });
  if(validUsers.length > 0){
    return true;
  }
  else{
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if(!username || !password){
    return res.status(404).json({message: "Error Logging in"});
  }
  if(authenticatedUser(username,password)){
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization.username;
  if (isbn && review) {
    if (books[isbn]) {
        books[isbn].reviews[username] = review;
        return res.status(200).json({message: "Review added successfully"});
      
    } else {
      return res.status(404).json({message: "Book not found"});
    }
  } else {
    return res.status(404).json({message: "Invalid request"});
  }
  
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;
  if (isbn) {
    if (books[isbn]) {
      if (books[isbn].reviews[username]) {
        delete books[isbn].reviews[username];
        return res.status(200).json({message: "Review deleted successfully"});
      } else {
        return res.status(404).json({message: "Review not found"});
      }
    } else {
      return res.status(404).json({message: "Book not found"});
    }
  } else {
    return res.status(404).json({message: "Invalid request"});
  }
  
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
