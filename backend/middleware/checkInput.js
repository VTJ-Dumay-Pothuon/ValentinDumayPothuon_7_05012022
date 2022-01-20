module.exports = (req, res, next) => {
    const isValidInput = (post) => {
        const regexp = new RegExp ( "^[^\\[\\]\\|\\;]*$" );
        if ( regexp.test(String(post.title)) &&
             regexp.test(String(post.body)) ) {
            next();
        } else {
            res.status(403).json({
                message: "Un ou plusieurs champs contient un caractère invalide !"
              });
        }
    };
    isValidInput(req.body);
}