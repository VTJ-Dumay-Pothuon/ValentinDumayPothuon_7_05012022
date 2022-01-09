const passwordValidator = require('password-validator');
// Create a schema
let passwordSchema = new passwordValidator();
// Add properties to it
passwordSchema
    .is().min(8)                  // Minimum length 8
    .is().max(100)                // Maximum length 100
    .has().uppercase()            // Must have uppercase letters
    .has().lowercase()            // Must have lowercase letters
    .has().digits(1)              // Must have at least 1 digit
    .has().not().spaces()         // Should not have spaces

module.exports = passwordSchema;