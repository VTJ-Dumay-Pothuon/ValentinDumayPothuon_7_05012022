const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const postCtrl = require('../controllers/post');
const multer = require('../middleware/multer-config');
const inputCtrl = require('../middleware/checkInput');

router.post('/create', auth, multer, inputCtrl, postCtrl.createPost);// C
router.get('/one/:id', postCtrl.getPost);                            // R
router.get('/user/:id', postCtrl.getUserPosts);                      // R
router.get('/all', postCtrl.getAllPosts);                            // R
router.put('/edit/:id', auth, multer, inputCtrl, postCtrl.editPost); // U
router.delete('/delete/:id', auth, postCtrl.deletePost);             // D

module.exports = router;