const { getCategories } = require("./Controllers/categories.controller");
const { getReview } = require("./Controllers/reviews.controllers");

const express = require("express");

const app = express();

app.get("/api/categories", getCategories);

app.get("/api/reviews/:review_id", getReview);

app.use((req, res, next) => {
  res.status(404).send({ message: "404: invalid end point provided" });
});

app.use((err, req, res, next) => {
  if (err) {
    res.status(err.status).send({ message: err.message });
  }
  res.status(500).send({ message: "internal server error" });
});

module.exports = { app };
