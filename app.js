const { getCategories } = require("./Controllers/categories.controller");

const express = require("express");

const app = express();

app.get("/api/categories", getCategories);

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ message: "internal server error" });
});

app.use((req, res, next) => {
  res.status(404).send({ message: "404: invalid end point provided" });
});

module.exports = { app };
