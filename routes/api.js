/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const Book = require("../mongoDB.js").BookModel;

const createBook = require("../mongoDB.js").createBook;
const getAllBooks = require("../mongoDB.js").getAllBooks;
const getBookById = require("../mongoDB.js").getBookById;
const getBookByName = require("../mongoDB.js").getBookByName;
const addComment = require("../mongoDB.js").addComment;
const deleteAllBooks = require("../mongoDB.js").deleteAllBooks;
const deleteBook = require("../mongoDB.js").deleteBook;

module.exports = function (app) {

  app.route('/api/books')
    .get(async function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]   
      try{
        const books = await getAllBooks();
        return res.status(200).json(books);
      }
      catch(e){
        return res.status(500).send("could not retrieve books");
      }  
    })
    
    .post(async function (req, res){
      let title = req.body.title;
      if(!title){
        return res.status(400).send("missing required field title");
      }
      //response will contain new book object including atleast _id and title
      try{
        const newBook = await createBook(title);
        res.status(201).json(newBook);
      }
      catch(e){
        if (e.code === 11000) {  // MongoDB -> duplicate key 
          return res.status(409).send("Book already exists");
        }
        res.status(500).send("could not create");
      }
    })
    
    .delete(async function (req, res){
      //if successful response will be 'complete delete successful'
      try {
        await deleteAllBooks();
        res.status(200).send("complete delete successful");
      } 
      catch(e){
        res.status(500).send("could not delete");
      } 
    });



  app.route('/api/books/:id')
    .get(async function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      try{
        const book = await getBookById(bookid);

        if(book?.error || !book){
          return res.status(404).send("no book exists");
        }
        else{
          return res.status(200).json(book);
        }
      }
      catch(e){
        console.log(e);
        return res.status(500).send("could not retrieve book");
      } 
    })
    
    .post(async function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
      try{
        const book = await addComment(bookid, comment);
        if(!comment){
          return res.status(400).send("missing required field comment");
        }
        if(book?.error || !book){
          return res.status(404).send("no book exists");
        }
        res.status(200).json(book);
      }
      catch(e){
        res.status(500).send("could not post comment");
        console.log(e);
      }
    })
    
    .delete(async function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      try {
        const book = await deleteBook(bookid);

        if(book?.error || !book){
          return res.status(404).send("no book exists");
        }
        res.status(200).send("delete successful");
      } 
      catch(e){
        res.status(500).send("could not delete");
      } 
    });
  
};
