const models = require('../models');

const jwtUtils = require('../utils/token');

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