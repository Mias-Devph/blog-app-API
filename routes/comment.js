const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { verify, verifyAdmin } = require('../auth');

// Get comments for a blog post
router.get('/post/:postId', commentController.getCommentsByPost);

// Create comment (authenticated)
router.post('/post/:postId', verify, commentController.createComment);

// Delete comment (admin only)
router.delete('/:id', verify, verifyAdmin, commentController.deleteComment);

module.exports = router;
