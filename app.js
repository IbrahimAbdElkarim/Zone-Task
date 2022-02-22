const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const express = require("express");
const authRoutes = require("./routes/auth");
const zoneRoutes = require("./routes/zone");

const app = express();
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/auth", authRoutes);
app.use("/zone", zoneRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message: message});
});

mongoose
  .connect("mongodb://localhost/zone", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(3099);
    console.log("Project run on Port : 3099");
  })
  .catch((err) => console.log(err));
