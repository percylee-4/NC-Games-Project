const { selectReview } = require("../models/reviews.models");

exports.getReview = (req, res, next) => {
  const id = req.params.review_id;
  selectReview(id)
    .then((reviews) => {
      res.status(200).send({ reviews: reviews });
    })
    .catch((err) => {
      next(err);
    });
};
