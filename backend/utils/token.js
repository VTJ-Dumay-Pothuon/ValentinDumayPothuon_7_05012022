const jwt = require('jsonwebtoken');
require("dotenv").config();

module.exports = {

    sign: function(user) {
        return jwt.sign(
            { userId: user.id, isAdmin:user.isAdmin },
            `${process.env.TOKEN_1}`+
            `${process.env.TOKEN_2}`+
            `${process.env.TOKEN_3}`+
            `${process.env.TOKEN_4}`,
            { expiresIn: '24h' }
          );
    },

    getUserId: function(authorization) {
        const token = authorization.split(' ')[1];
        const decodedToken = jwt.verify(token,
        `${process.env.TOKEN_1}`+
        `${process.env.TOKEN_2}`+
        `${process.env.TOKEN_3}`+
        `${process.env.TOKEN_4}`,);
        
        return decodedToken.userId;
    }
}