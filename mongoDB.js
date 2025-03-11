require('dotenv').config();
//const { MongoClient } = require('mongodb');   // native MongoDB driver
const mongoose = require ('mongoose');

const URI = process.env.MONGO_URI;
//const client = new MongoClient(URI, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    commentcount: { type: Number, default: 0 },
    comments: { type: [String], default: [] }
});

const Book = mongoose.model('Book', bookSchema); 

// CREATE 
const createBook = async(bookTitle) => {
    const newBook = new Book({ title: bookTitle });
    const savedBook = await newBook.save();

    return { _id: savedBook._id, title: savedBook.title };
}

// READ 
const getAllBooks = async() => {
    const books = Book.find().select({title: 1, _id: 1, commentcount: 1});
    return await books;
};
const getBookById = async(bookId) => {
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
        return {error: "Invalid ID"};
    }
    const book = Book.findById(bookId);
    return await book;
};
const getBookByName = async(bookTitle) => {
    const book = Book.findOne({title: bookTitle});
    return await book;
};

// UPDATE
const addComment = async(bookId, comment) => {
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
        return {error: "Invalid ID"};
    }
    const book = await Book.findById(bookId);
    if (!book) return null;

    book.comments.push(comment);
    book.commentcount++;
    return await book.save();
}

// DELETE 
const deleteBook = async(bookId) => {
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
        return {error: "Invalid ID"};
    }
    return await Book.findByIdAndDelete(bookId);
}
const deleteAllBooks = async() => {
    return await Book.deleteMany();
}

exports.BookModel = Book;
exports.createBook = createBook;
exports.getAllBooks = getAllBooks;
exports.getBookById = getBookById;
exports.getBookByName = getBookByName;
exports.addComment = addComment;
exports.deleteAllBooks = deleteAllBooks;
exports.deleteBook = deleteBook;