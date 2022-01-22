const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const commentCtrl = require('../controllers/comment');
const multer = require('../middleware/multer-config');
const inputCtrl = require('../middleware/checkInput');

router.post('/addto/:id', auth, multer, inputCtrl, commentCtrl.createComment); // C
router.get('/readfor/:id', commentCtrl.getPostComments);                       // R
router.delete('/delete/:id', auth, commentCtrl.deleteComment);                 // D

module.exports = router;