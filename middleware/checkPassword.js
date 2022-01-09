const passwordSchema = require('../models/password')

module.exports = (req, res, next) => {
    const isValidPassword = (password) => {
    
        if (passwordSchema.validate(password)) {
            next();
        } else {
            res.status(400).json({
                message: `Format du mot de passe ${password} invalide !`
              });
        }
    };
    isValidPassword(req.body.password);
}