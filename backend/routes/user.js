const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const userCtrl = require('../controllers/user');
const emailCtrl = require('../middleware/checkEmail');
const passwordCtrl = require('../middleware/checkPassword');

router.post('/signup',emailCtrl, passwordCtrl, userCtrl.signup); // C
router.get('/profile/:id', userCtrl.getProfile)                  // R
router.put('/edit/:id', auth, userCtrl.editProfile);             // U
router.put('/changepass', auth, userCtrl.changePassword);        // U
router.delete('/delete/:id', auth, userCtrl.deleteUser);         // D

router.post('/login', userCtrl.login);  // ON
router.get('/logout', userCtrl.logout); // OFF


module.exports = router;