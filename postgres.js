// ASYNC POSTGRES

const express = require("express");
const { Pool } = require("pg");
const app = express();

app.use(express.json());

// Initiate pool
const pool = new Pool({
  user: "postgres",
  host: "locahost",
  database: "postgres",
  password: "password",
  port: 5432,
});

// Get all users
app.get("/users", async (req, res) => {
  try {
    const users = await pool.query("SELECT * FROM users");

    if (users.rowCount === 0) {
      return res.status(401).json({ message: "User table found empty" });
    }

    res.status(200).json(users.rows);
  } catch (err) {
    res
      .status(500)
      .json({ message: `Error occured in GET ALL user function: ${err}` });
  }
});

// Get a specific user
app.get("/users/:id", async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "User ID is a required field" });
  }

  try {
    const user = await pool.query("SELECT * FROM users WHERE user = $1", [id]);

    if (user.rowCount === 0) {
      return res
        .status(400)
        .json({ message: `User with ID ${id} does not exist in database` });
    }

    res.status(200).json(user.rows);
  } catch (err) {
    res.status(500).json({
      message: `Error occurred in GET specific user function: ${err}`,
    });
  }
});

// Add new user
app.post("/users", async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res
      .status(401)
      .json({ message: "Name and email are required fields" });
  }

  try {
    await pool.query("INSERT INTO users (name, email) VALUES ($1, $2)", [
      name,
      email,
    ]);
    res.status(200).json({ message: "Successfully added new user to sql" });
  } catch (err) {
    res.status(500).json({
      message: `Error occurred in POST user function: ${err}`,
    });
  }
});

// Update a user
app.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  if (!id) {
    return res.status(400).json({ message: "User ID is a required field" });
  }

  if (!name || !email) {
    return res
      .status(400)
      .json({ message: "Name and email are required fields" });
  }

  try {
    const updateUser = await pool.query(
      "UPDATE users SET name = $ 1, email = $2 WHERE id = $3",
      [name, email, id]
    );

    if (updateUser.rowCount === 0) {
      return res.status(400).json({
        message: `User with ID ${id} was not found and could not be updated`,
      });
    }

    res.status(200).json({ message: `Succesfully updated user with ID ${id}` });
  } catch (err) {
    res.status(500).json({
      message: `Error occurred in PUT user function: ${err}`,
    });
  }
});

// Remove a user
app.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deleteUser = await pool.query("DELETE FROM users WHERE id = $1", [
      id,
    ]);

    if (deleteUser.rows.length === 0) {
      return res.status(404).json({
        message: `User with ID ${id} was not found and could not be deleted`,
      });
    }

    res
      .status(200)
      .json({ message: `Successfully deleted user with ID ${id}` });
  } catch (err) {
    res.status(500).json({
      message: `Error occurred in DELETE  user function: ${err}`,
    });
  }
});

app.listen(3000, () =>
  console.log("Server is now running on http://localhost:3000")
);
