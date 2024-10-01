// ASYNC - FILE SYS OPERATIONS

const { readFile, writeFile, appendFile } = require("fs").promises;
const express = require("express");
const app = express();

// Read file
app.get("/", async (req, res) => {
  try {
    const data = await readFile("./sample.txt", "utf-8");

    if (!data) {
      return res
        .status(401)
        .json({ message: "Sample text file found to be empty" });
    }

    res.status(200).json(JSON.parse(data));
  } catch (err) {
    res
      .status(500)
      .json({ message: `Error occurred with file reading: ${err}` });
  }
});

// Write to file
app.post("/", async (req, res) => {
  try {
    const newData = req.body;

    // or can do explicit checks for required field
    if (!newData) {
      return res.status(400).json({ message: "No request body received" });
    }

    await appendFile("./sample.txt", newData);
    res.status(200).json({ message: "Successfully wrote to file destination" });
  } catch (err) {
    res
      .status(500)
      .json({ message: `Error occurred with file writing: ${err}` });
  }
});

// Modify file
app.patch("/", async (req, res) => {
  try {
    const data = await readFile("./sample.txt", "utf-8");
    const edits = req.body;

    // depends on what to modify
    const modData = data.toUpperCase();
    await writeFile("./updated_sample.txt", modData);
    res.status(200).json({ message: "Successfully modified target file" });
  } catch (err) {
    res
      .status(500)
      .json({ message: `Error occurred with file modification: ${err}` });
  }
});

app.listen(3000, () =>
  console.log("Server has started running on http://localhost:3000")
);
