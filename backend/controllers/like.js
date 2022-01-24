const Like = require('../models').Like;
const sequelize = require('sequelize');
const jwtUtils = require('../utils/token');

// CREATE
exports.like = (req, res, next) => {
  const postid = req.params.id;
  const userId = jwtUtils.getUserId(req.cookies.token);
  Like.create({
    PostId: postid,
    UserId: userId
  })
  .then(like => res.status(200).json({ message: "liked post", postId: like.PostId }))
  .catch(error => res.status(500).json({ error }));
};

// READ
exports.getPostLikes = (req, res, next) => {
    const postid = req.params.id;
    Like.findAll({
        attributes: [
            [sequelize.fn('COUNT', sequelize.col('id')), 'nb_likes']
        ],
        where: {PostId: postid}
    })
    .then(nb_likes => res.status(200).json({ likes: nb_likes[0] }))
    .catch(error => res.status(500).json({ error }));
};
exports.hasLikedPost = (req, res, next) => {
    const postId = req.params.id;
    const userId = jwtUtils.getUserId(req.cookies.token);
    Like.findOne({
        where: {
            PostId: postId, 
            UserId: userId
        }
    })
    .then(like => res.status(200).json({ hasLiked: like }))
    .catch(error => res.status(500).json({ error }));
  };

// DELETE
exports.dislike = (req, res, next) => {
    const postId = req.params.id;
    const userId = jwtUtils.getUserId(req.cookies.token);
    Like.findOne({
        where: {
            PostId: postId, 
            UserId: userId
        }
    })
    .then(like => {
        like.destroy(); // Removes the entire like entry from database
        res.status(204).json({ message: "disliked post" });
    })
    .catch(error => res.status(500).json({ error: error }));
}