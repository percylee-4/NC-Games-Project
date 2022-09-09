const { deleteComment } = require("../models/comments.models");

exports.removeComment = (req, res, next) => {
  const id = req.params.comment_id;
  deleteComment(id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      if (err.code === "22P02") {
        next({
          status: 400,
          message: "Sorry, that comment id is invalid, please enter a number.",
        });
      } else {
        next(err);
      }
    });
};
