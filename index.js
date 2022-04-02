import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import postRoutes from "./routes/posts.js";
import userRoutes from "./routes/users.js";

const app = express();

// Load .env file contents into process.env.
dotenv.config();

app.use(bodyParser.json({ limit: "32mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "32mb", extended: true }));
app.use(cors());

// posts route and user route
app.use("/posts", postRoutes);
app.use("/user", userRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to Post-It API");
});

const PORT = process.env.PORT || 4000;

// connect to DB
mongoose
  .connect(process.env.CONNECTION_URL)
  .then(() => {
    app.listen(PORT, () =>
      console.log(`Server is running on port : ${PORT}...`)
    );
  })
  .catch((error) => {
    console.log(error.message);
  });