const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const { notFound } = require("./utils/errorHandler");
const path = require("path");
const upload = require("express-fileupload");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json({ extended: true }));
// To allow API request from any other port we use CORS
// origin * means its accepts request from any port
app.use(
  cors({
    credentials: true,
    origin: function (origin, callback) {
      // Check if the request origin is allowed
      if (!origin || origin === "http://localhost:5173") {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(upload());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

mongoose
  .connect(process.env.MONGODB_URI)
  .then((client) =>
    app.listen(PORT, () => console.log("SERVER CONNECTED AT PORT: ", PORT))
  )
  .catch((err) => console.log("Error while conneting to DB: ", err));

app.use("/api/users", authRoutes);
app.use("/api/posts", postRoutes);

// middleware to handle unsupported routes error
app.use(notFound);
