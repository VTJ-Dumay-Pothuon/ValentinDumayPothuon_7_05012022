const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const userCtrl = require('../controllers/user');
const emailCtrl = require('../middleware/checkEmail');
const passwordCtrl = require('../middleware/checkPassword');

router.post('/signup',emailCtrl, passwordCtrl, userCtrl.signup); // C
router.get('/profile/:id', userCtrl.getProfile)                  // R
router.post('/update', auth, userCtrl.editProfile);              // U
router.post('/delete', auth, userCtrl.deleteUser);               // D
router.post('/changepass', auth, userCtrl.changePassword)
router.post('/login', userCtrl.login);
router.get('/logout', userCtrl.logout);


module.exports = router;