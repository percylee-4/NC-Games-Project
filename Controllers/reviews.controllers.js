const {
  selectReview,
  updateReviewVotes,
  selectReviews,
  selectComments,
  insertComment,
} = require("../models/reviews.models");

exports.getReview = (req, res, next) => {
  const id = req.params.review_id;
  selectReview(id)
    .then(([review]) => {
      res.status(200).send({ review: review });
    })
    .catch((err) => {
      if (err.code === "22P02") {
        next({
          status: 400,
          message: "Invalid id provided, a review id must be a number.",
        });
      }
      next(err);
    });
};

exports.patchReviewVotes = (req, res, next) => {
  const voteChange = req.body.inc_votes;
  const id = req.params.review_id;
  updateReviewVotes(voteChange, id)
    .then(([review]) => {
      res.status(201).send({ review });
    })
    .catch((err) => {
      if (err.code === "22P02") {
        next({
          status: 400,
          message: "Invalid id or vote count provided, these must be a number.",
        });
      }
      next(err);
    });
};

exports.getReviews = (req, res, next) => {
  const query = req.query.category;
  selectReviews(query)
    .then((reviews) => {
      res.status(200).send({ reviews: reviews });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getComments = (req, res, next) => {
  const id = req.params.review_id;
  selectComments(id)
    .then((comments) => {
      res.status(200).send({ comments: comments });
    })
    .catch((err) => {
      if (err.code === "22P02") {
        next({
          status: 400,
          message: "Invalid id provided, a review id must be a number.",
        });
      } else {
        next(err);
      }
    });
};

exports.postComment = (req, res, next) => {
  const id = req.params.review_id;
  const body = req.body;
  insertComment(id, body)
    .then((comment) => {
      res.status(201).send({ comment: comment });
    })
    .catch((err) => {
      if (err.constraint === "comments_author_fkey") {
        next({
          status: 400,
          message: "You must create an account in order to make a comment!",
        });
      } else if (err.code === "23503") {
        next({
          status: 404,
          message: "Sorry, there is no review with that id. Please try again.",
        });
      } else if (err.code === "22P02"){
        next({
          status:400,
          message: "Sorry, there is no review with that id. Please try again."
        })
      } else {
        next(err);
      }
    });
};
