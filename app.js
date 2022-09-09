const { getCategories } = require("./Controllers/categories.controller");
const {
  getReview,
  patchReviewVotes,
  getReviews,
  getComments,
  postComment,
} = require("./Controllers/reviews.controllers");

const express = require("express");
const { getUsers } = require("./Controllers/users.controllers");

const app = express();

app.use(express.json());

app.get("/api/categories", getCategories);

app.get("/api/reviews?:query", getReviews);

app.get("/api/reviews/:review_id", getReview);

app.get("/api/reviews/:review_id/comments", getComments);

app.post("/api/reviews/:review_id/comments", postComment);

app.get("/api/users", getUsers);

app.patch("/api/reviews/:review_id", patchReviewVotes);

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
