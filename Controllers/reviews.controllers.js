const { selectReview, updateReviewVotes } = require("../models/reviews.models");

exports.getReview = (req, res, next) => {
  const id = req.params.review_id;
  selectReview(id)
    .then((review) => {
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
