require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

mongoose
  .connect(process.env.DATABASE_CONNECTION_STRING)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Error connecting to MongoDB:", error));

const app = express();
const port = 5000;

app.use(express.json());

app.get("/search/:searchTerm", async (req, res) => {
  const { searchTerm } = req.params;

  try {
    const users = await User.find({
      $or: [
        { username: { $regex: searchTerm, $options: "i" } },
        { firstname: { $regex: searchTerm, $options: "i" } },
        { lastname: { $regex: searchTerm, $options: "i" } },
      ],
    });

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on ${port} port`);
});
