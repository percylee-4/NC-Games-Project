const { getCategories } = require("./Controllers/categories.controller");

const express = require("express");

const app = express();

app.get("/api/categories", getCategories);

app.use((req, res, next) => {
  res.status(404).send({ message: "404: invalid end point provided" });
});

app.use((err, req, res, next) => {
  res.status(500).send({ message: "internal server error" });
});


module.exports = { app };
