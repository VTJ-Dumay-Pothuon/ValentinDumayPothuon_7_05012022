const express = require('express');
const router = express.Router();

const postCtrl = require('../controllers/post');
const auth = require('../middleware/auth');

router.post('/create', postCtrl.createPost);         // C
router.get('/one/:id', postCtrl.getPost);            // R
router.get('/user/:id', postCtrl.getUserPosts);      // R
router.get('/all', postCtrl.getAllPosts);            // R
router.put('/edit', auth, postCtrl.editPost);        // U
router.delete('/delete', auth, postCtrl.deletePost); // D

module.exports = router;