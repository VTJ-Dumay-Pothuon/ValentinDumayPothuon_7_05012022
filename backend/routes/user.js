const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const userCtrl = require('../controllers/user');
const multer = require('../middleware/multer-config');
const emailCtrl = require('../middleware/checkEmail');
const passwordCtrl = require('../middleware/checkPassword');

router.post('/signup',emailCtrl, passwordCtrl, userCtrl.signup); // C
router.get('/profile/:id', userCtrl.getProfile)                  // R
router.get('/profiles', userCtrl.getAllProfiles)                 // R
router.put('/update/:id', auth, multer, userCtrl.updateProfile); // U
router.put('/changepassword', auth, userCtrl.changePassword);    // U
router.delete('/delete/:id', auth, userCtrl.deleteUser);         // D

router.post('/login', userCtrl.login);  // ON
router.get('/logout', userCtrl.logout); // OFF


module.exports = router;