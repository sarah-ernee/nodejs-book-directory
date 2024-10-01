// ASYNC - MONGODB

const mongoose = require("mongoose");
const express = require("express");
const app = express();

app.use(express.json());

// Define Mongo schema (assuming DB has not been established)
const bookSchema = new mongoose.Schema({
  name: { type: String, required: true },
  author: { type: String, required: true },
  publishedDate: { type: Date },
});

const Book = mongoose.model("Book", bookSchema);
module.exports = Book;

// Instantiate Mongo connection
mongoose
  .connect(process.env.CONN_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Get all books from Mongo
// With pagination
app.get("/books", async (req, res) => {
  try {
    // Get pagination from query params
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const skip = limit * (page - 1);

    const books = await Book.find().limit(limit).skip(skip);
    const totalBooks = await Book.countDocuments();
    const totalPages = Math.ceil(totalBooks / limit);

    res.status(200).json({ currentPage: page, totalPages, totalBooks, books });
  } catch (error) {
    res.status(500).json({ error: "Failed to query all books" });
  }
});

// Get a specific book from Mongo
app.get("/books/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);

    if (!book) {
      res.status(401).json({ message: `Book with ID ${id} was not found` });
    }

    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ error: `Failed to find book with ID ${id}` });
  }
});

// Add a new book to Mongo
app.post("/books", async (req, res) => {
  try {
    const book = new Book(req.body);
    await book.save(); // mongoose runs schema validation before saving
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ error: "Failed to add new book" });
  }
});

// Update a book in Mongo
app.put("/books/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedBook = await Book.findByIdAndUpdate(id, req.body, {
      new: true, // only return updatedDoc since Mongo returns oldDoc by default
      runValidators: true, // validate against defined schema
    });

    if (!updatedBook) {
      res.status(401).json({ message: `Book with ID ${id} is not in DB` });
    }

    res.status(200).json(updatedBook);
  } catch (error) {
    res.status(500).json({ error: `Failed to update book with ID ${id}` });
  }
});

// Delete a book in Mongo
app.delete("/books/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBook = await Book.findByIdAndDelete(id);

    if (!deletedBook) {
      res.status(401).json({ message: `Book with ID ${id} is not in DB}` });
    }

    res
      .status(200)
      .json({ message: `Book with ID ${id} was succesfully deleted` });
  } catch (error) {
    res.status(500).json({ error: `Failed to delete book with ID ${id}` });
  }
});

app.listen(3000, () =>
  console.log("Server is running on http://localhost:3000")
);
