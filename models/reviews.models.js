const db = require("../db/connection");

exports.selectReview = (id) => {
  return db
    .query(`SELECT * FROM reviews WHERE review_id = $1`, [id])
    .then((reviews) => {
      if (reviews.rows.length > 0) {
        return reviews.rows;
      } else {
        return Promise.reject({
          status: 404,
          message: "Sorry, there is no review with that id. Please try again.",
        });
      }
    });
};

exports.updateReviewVotes = (voteChange, id) => {
  return db
    .query(
      `UPDATE reviews
  SET votes = votes + $1
  WHERE review_id = $2 RETURNING *`,
      [voteChange, id]
    )
    .then((review) => {
      return review.rows;
    });
};
