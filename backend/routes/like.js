const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const likeCtrl = require('../controllers/like');

router.post('/add/:id', auth, likeCtrl.like);         // C
router.get('/readfor/:id', likeCtrl.getPostLikes);    // R
router.get('/hasliked/:id', likeCtrl.hasLikedPost);   // R
router.delete('/remove/:id', auth, likeCtrl.dislike); // D

module.exports = router;