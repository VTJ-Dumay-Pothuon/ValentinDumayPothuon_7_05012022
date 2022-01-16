const Post = require('../models').Post;

const jwtUtils = require('../utils/token');

// CREATE
exports.create = (req, res, next) => {
  
  const { title, image, body } = req.body; // destructuring
  Post.create({
    title: title,
    image: image,
    body: body,
    likes: 0,
    UserId: 14
  })
  .then(post => res.status(200).json({ message: post }))
  .catch(error => res.status(500).json({ error }));
};

// READ (Display all)
exports.getAll = (req, res, next) => {
  const userId = jwtUtils.getUserId(req.headers.authorization);
  models.User.findOne({
    attributes: ['name', 'surname'],
    where: {id: userId}
  })
  .then(user => {
    res.status(200).json({ message: `Bonjour, ${user.name} ${user.surname}!` });
  })
  .catch(error => res.status(500).json({ error }));
};