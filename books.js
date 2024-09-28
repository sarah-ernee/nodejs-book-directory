const express = require("express");
const app = express();
app.use(express.json());

const books = require("./books.json");

// Get all books
app.get("/", (request, response) => {
  response.send(books);
});

// Get a specific book
app.get("/:id", (request, response) => {
  const { id } = request.params;
  const book = books.filter((ele) => ele.id === parseInt(id));

  if (!book) {
    return response
      .status(404)
      .json({ error: `Book with ID ${id} was not found` });
  }

  response.json(book);
});

// Add a new book
app.post("/", (request, response) => {
  const body = request.body;

  if (!body.name) {
    return response.status(400).json({ error: "Book title is required" });
  }

  books.push(body);
  response.json({ message: `The book titled ${body.name} been added` });
});

// Update a book
app.put("/:id", (request, response) => {
  const { id } = request.params;
  const body = request.body;

  //   books.forEach((book, index) => {
  //     if (book.id === parseInt(id)) {
  //       books[index] = body;
  //     }
  //   });

  const index = books.findIndex((book) => book.id === parseInt(id));

  if (index === -1) {
    return response.status(404).json({
      error: `Book with ID ${id} was not found and could not be updated`,
    });
  }
  books[index] = request.body;
  response.json({ message: `The book with ID ${id} has been updated` });
});

// Update parts of a book
app.patch("/:id", (request, response) => {
  const { id } = request.params;

  const { name, author } = request.body;

  if (!name && !author) {
    return response
      .status(400)
      .json({ error: `Book author or title is required` });
  }

  const index = books.findIndex((book) => book.id === parseInt(id));

  if (index === -1) {
    return response.status(500).json({
      error: `Book with ID ${id} was not found and could not be patched`,
    });
  }

  if (name) {
    books[index].name = name;
  }

  if (author) {
    books[index].author = author;
  }

  response.json({
    messsage: `Book with ID ${id} has been patched`,
  });
});

// Delete a book
app.delete("/:id", (request, response) => {
  const { id } = request.params;

  //   books.forEach((book, index) => {
  //     if (book.id === parseInt(id)) {
  //       books.splice(index, 1);
  //     }
  //   });

  const index = books.findIndex((book) => book.id === parseInt(id));

  if (index === -1) {
    return response.status(404).json({
      error: `Book with ID ${id} was not found and could not be deleted`,
    });
  }

  books.splice(index, 1);
  response.json({ message: `The book with ID ${id} has been deleted` });
});

app.listen(process.env.PORT || 3000, () =>
  console.log("Server is running on http://localhost:3000")
);
