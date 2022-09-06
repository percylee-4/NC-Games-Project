const { selectReview } = require("../models/reviews.models");

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
