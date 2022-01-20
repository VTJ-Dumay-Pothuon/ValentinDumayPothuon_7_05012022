const Post = require('../models').Post;

const jwtUtils = require('../utils/token');
const fs = require("fs");

// CREATE
exports.createPost = (req, res, next) => {
  
  const { title, body } = req.body; // destructuring
  const image = req.file ? `${req.protocol}://${req.get('host')}/images/posts/${req.file.filename}` : null;
  const userId = jwtUtils.getUserId(req.cookies.token);
  Post.create({
    title: title,
    image: image,
    body: body,
    likes: 0,
    UserId: userId
  })
  .then(post => res.status(200).json({ postId: post.id }))
  .catch(error => res.status(500).json({ error }));
};

// READ
/* ONE */exports.getPost = (req, res, next) => {
  const id = req.params.id;
  const idVisitor = jwtUtils.getUserId(req.cookies.token);
  const isAdminVisitor = jwtUtils.getAdminStatus(req.cookies.token);
  Post.findOne({
    where: {id: id}
  })
  .then(post => {
    const canEdit = (post.UserId == idVisitor || isAdminVisitor);
    res.status(200).json({ post, canEdit: canEdit });
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

  const id = req.params.id;
  Post.findOne({
    where: {id: id}
  })
  .then(post => {
    const title = req.body.title ? req.body.title : post.title;
    const body = req.body.body ? req.body.body : post.body;
    if (post.image) {
      const filename = post.image.split('/images/posts/')[1];
      if (req.file) fs.unlink(`images/posts/${filename}`,
      (error) => { if (error) console.log({ error })});
    }
    const image = req.file ? `${req.protocol}://${req.get('host')}/images/posts/${req.file.filename}`: 
    post.image ? post.image : null;
    post.set({
      title: title, body: body, image: image
    });
    post.save();
    res.status(200).json({ message: "Le post a été mis à jour !" });
  })
  .catch(error => res.status(500).json({ error: error }));
}

// DELETE
exports.deletePost = (req, res, next) => {
  const id = req.params.id;
  Post.findOne({
    where: {id: id}
  })
  .then(post => {
    if (post.image) {
      const filename = post.image.split('/images/posts/')[1];
      fs.unlink(`images/posts/${filename}`,
      (error) => { if (error) console.log({ error })});
    }
    post.destroy(); // Removes the entire user entry from database
    res.status(204).json({ message: "Le post a été supprimé !" });
  })
  .catch(error => res.status(500).json({ error: error }));
}