const { deleteComment } = require("../models/comments.models");

exports.removeComment = (req, res, next) => {
  const id = req.params.comment_id;
  deleteComment(id).then(() => {
    res.status(204).send();
  });
};
