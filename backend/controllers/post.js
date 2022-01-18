const Post = require('../models').Post;

const jwtUtils = require('../utils/token');

// CREATE
exports.createPost = (req, res, next) => {
  
  const { title, image, body } = req.body; // destructuring
  const userId = jwtUtils.getUserId(req.cookies.token);
  Post.create({
    title: title,
    image: image,
    body: body,
    likes: 0,
    UserId: userId
  })
  .then(post => res.status(200).json({ message: post }))
  .catch(error => res.status(500).json({ error }));
};

// READ
/* ONE */exports.getPost = (req, res, next) => {
  const id = req.params.id;
  Post.findOne({
    where: {id: id}
  })
  .then(post => {
    res.status(200).json({ post });
  })
  .catch(error => res.status(500).json({ error }));
};
/* USER's */exports.getUserPosts = (req, res, next) => {
  const id = req.params.id;
  Post.findAll({
    where: {UserId: id}
  })
  .then(posts => {
    res.status(200).json({ posts });
  })
  .catch(error => res.status(500).json({ error }));
};
/* ALL */exports.getAllPosts = (req, res, next) => {
  Post.findAll()
  .then(posts => {
    res.status(200).json({ posts });
  })
  .catch(error => res.status(500).json({ error }));
};

// UPDATE
exports.editPost = (req, res, next) => {
  
}

// DELETE
exports.deletePost = (req, res, next) => {
  
}