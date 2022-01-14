const User = require('../models').User;

const CryptoJS = require("crypto-js");
const jwToken = require('../utils/token');
const bcrypt = require('bcrypt');
require("dotenv").config();

// CREATE (Signup)
exports.signup = (req, res, next) => {
  
  const { email, password, name, surname, image, description } = req.body; // destructuring
  const encryptedMail = CryptoJS.EvpKDF(email, process.env.CRYPTOMAIL).toString(CryptoJS.enc.Base64);

  User.findOne({
    attributes: ['email'],
    where: {email: encryptedMail}
  })
  .then(user => {
    if (user) {
      res.status(409).json({ message: "L'utilisateur existe déjà !" });
    } else {
      bcrypt.hash(password, 10)
      .then(hash => {
        User.create({
          isAdmin: false,                         // Security key
          email: encryptedMail, password: hash,   // Login informations
          name: name, surname: surname,           // Profile mandatory
          image: image, description: description  // Profile facultative
        })
        .then(res.status(201).json({ message: "L'utilisateur a été créé !" }))
        .catch(res.status(400).json({ error }));
      })
    }
  })
  .catch(error => res.status(500).json({ error }));
};

// ACCESS (Login)
exports.login = (req, res, next) => {
    
    const { email, password } = req.body; // destructuring
    const encryptedMail  = CryptoJS.EvpKDF(email, process.env.CRYPTOMAIL).toString(CryptoJS.enc.Base64);
    
    User.findOne({
      where: {email: encryptedMail}
    })
      .then(user => {
        if (!user) {
          return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        bcrypt.compare(password, user.password)
          .then(valid => {
            if (!valid) {
              return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            res.status(200).json({
              userId: user.id,
              token: jwToken.sign(user)
            });
          })
          .catch(error => res.status(403).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };