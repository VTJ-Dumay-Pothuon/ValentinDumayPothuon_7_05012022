const Comment = require('../models').Comment;

const jwtUtils = require('../utils/token');
const fs = require("fs");

// CREATE
exports.createComment = (req, res, next) => {
  const body = req.body.comment;
  const postid = req.body.postId;
  const userId = jwtUtils.getUserId(req.cookies.token);
  Comment.create({
    body: body,
    PostId: postid,
    UserId: userId
  })
  .then(comment => res.status(200).json({ postId: comment.PostId }))
  .catch(error => res.status(500).json({ error }));
};

// READ
exports.getPostComments = (req, res, next) => {
    const id = req.params.id;
    Comment.findAll({
        where: {PostId: id}
    })
    .then(comments => {
        res.status(200).json({ comments });
    })
    .catch(error => res.status(500).json({ error }));
};

// DELETE
exports.deleteComment = (req, res, next) => {
  const id = req.params.id;
  Comment.findOne({
    where: {id: id}
  })
  .then(comment => {
    comment.destroy(); // Removes the entire comment entry from database
    res.status(204).json({ message: "Le commentaire a été supprimé !" });
  })
  .catch(error => res.status(500).json({ error: error }));
}