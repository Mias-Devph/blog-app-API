const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { verify, verifyAdmin } = require('../auth');

// Get comments for a blog post
router.get('/post/:postId',  commentController.getCommentsByPost);

// Create comment (authenticated)
router.post('/post/:postId', verify, commentController.createComment);

// Update a comment
router.put('/:commentId', verify, commentController.updateComment);

// Delete a comment
router.delete('/:commentId', verify, commentController.deleteComment);

// Delete comment (admin only)
router.delete('/admin/:commentId', verify, verifyAdmin, commentController.deleteCommentAdmin);



module.exports = router;
