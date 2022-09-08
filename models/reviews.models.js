const db = require("../db/connection");

exports.selectReview = (id) => {
  return db
    .query(`SELECT * FROM reviews WHERE review_id = $1`, [id])
    .then((reviews) => {
      if (reviews.rows.length === 0) {
        return Promise.reject({
          status: 404,
          message: "Sorry, there is no review with that id. Please try again.",
        });
      } else {
        return db
          .query(
            `SELECT reviews.*, COUNT(comments.review_id) AS comment_count
          FROM reviews
          LEFT JOIN comments ON comments.review_id = reviews.review_id
          WHERE reviews.review_id = $1
          GROUP BY comments.review_id, reviews.review_id`,
            [id]
          )
          .then((review) => {
            return review.rows;
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

exports.selectReviews = (query) => {
  const selectJoin = `SELECT reviews.*, COUNT(comments.review_id) AS comment_count FROM reviews LEFT JOIN comments ON comments.review_id = reviews.review_id`;
  const queryStatement = " WHERE reviews.category = $1";
  const groupOrder = ` GROUP BY comments.review_id, reviews.review_id ORDER BY created_at DESC`;

  if (query === undefined) {
    return db.query(selectJoin + groupOrder).then((reviews) => {
      return reviews.rows;
    });
  }
  if (query !== undefined)
    return db
      .query("SELECT * FROM categories WHERE slug = $1", [query])
      .then((response) => {
        if (response.rows.length === 0) {
          return Promise.reject({
            status: 404,
            message: "Sorry, there are no categories matching that query.",
          });
        }
        return db
          .query(selectJoin + queryStatement + groupOrder, [query])
          .then((review) => {
            return review.rows;
          });
      });
};

exports.selectComments = (id) => {
  return db
    .query("SELECT * FROM comments where review_id = $1", [id])
    .then((response) => {
      if (response.rows.length === 0) {
        return Promise.reject({
          status: 404,
          message: "Sorry, there is no review with that id. Please try again.",
        });
      }
      return response.rows;
    });
};
