const jwToken = require('../utils/token');

/* Check if the json web token transmitted by the user is a properly formatted token, 
   AND was indeed encrypted using the website's secret key.*/
 module.exports = (req, res, next) => {
  try {
    const userId = jwToken.getUserId(req.headers.authorization);
    req.auth = { userId };  
    if (req.body.userId && req.body.userId !== userId) {
      res.status(400).json({ message: 'ID utilisateur invalide !'});
    } else {
      next();
    }
  } catch {
    res.status(403).json({ message: 'Utilisateur non autorisé !'});
  }
};