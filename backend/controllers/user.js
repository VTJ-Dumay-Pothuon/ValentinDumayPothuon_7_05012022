const User = require('../models').User;

const CryptoJS = require("crypto-js");
const jwtUtils = require('../utils/token');
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

// READ (Get user profile)
exports.getProfile = (req, res, next) => {
  const id = req.params.id;
  console.log (id);
  User.findOne({
    attributes: ['name', 'surname', 'image', 'description'],
    where: {id: id}
  })
  .then(user => {
    res.status(200).json({ user });
  })
};

// UPDATE (Edit user profile)
exports.editProfile = (req, res, next) => {
  
  const userId = jwtUtils.getUserId(req.headers.authorization);

  User.findOne({
    where: {id: userId}
  })
  .then(user => {
    const name = req.body.name ? req.body.name : user.name;
    const surname = req.body.surname ? req.body.surname : user.surname;
    const image = req.body.image ? req.body.image : null;
    const description = req.body.description ? req.body.description : null;
    console.log (`${name} ${surname} a l'image : ${image} et la description : ${description}`);
    user.set({
      name: name, surname: surname,           // Profile mandatory
      image: image, description: description  // Profile facultative
    });
    user.save();
    res.status(200).json({ message: "Le profil a été mis à jour !" });
  })
  .catch(error => res.status(500).json({ error: error, message: userId }));
};

// DELETE (Delete user)
exports.deleteUser = (req, res, next) => {
  const encryptedMail = CryptoJS.EvpKDF(req.body.email, process.env.CRYPTOMAIL).toString(CryptoJS.enc.Base64);
  User.findOne({
    where: {email: encryptedMail}
  })
  .then(user => {
    user.destroy(); // Removes the entire user entry from database
    res.status(204).json({ message: "L'utilisateur a été supprimé !" });
  })
  .catch(error => res.status(500).json({ error }));
};


// +ACCESS+ (Login/Logout)
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
            const token = jwtUtils.sign(user);
            res.cookie(
              'token', token, 
              { 
                domain: "http://localhost:8080",
                maxAge: 90000000,
                sameSite: 'none',
                httpOnly: true,
                secure: true
            });
            res.status(200).json({
              message: "Utilisateur connecté",
              userId: user.id
            });
          })
          .catch(error => res.status(403).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };

exports.logout = (req, res, next) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Utilisateur déconnecté" });
};

// Special update for password only
exports.changePassword = (req, res, next) => {
  
  const userId = jwtUtils.getUserId(req.headers.authorization);

  User.findOne({
    where: {id: userId}
  })
  .then(user => {
    bcrypt.compare(req.body.oldPassword, user.password)
      .then(valid => {
        if (!valid) {
          return res.status(403).json({ error: 'Ancien mot de passe incorrect !' });
        } else if (req.body.oldPassword === req.body.newPassword) {
          return res.status(403).json({ error: 'Les mots de passe sont identiques !' });
      }});
    user.set({password: password});
    user.save();
    res.status(200).json({ message: "Le mot de passe a été changé !" });
  })
  .catch(error => res.status(500).json({ error: error, message: userId }));
};