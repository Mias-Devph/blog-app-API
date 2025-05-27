const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { verify } = require('../auth');

router.get('/', postController.getAllPosts);
router.get('/:id', postController.getPostById);
router.post('/createPost', verify, postController.createPost);
router.put('/:id', verify, postController.updatePost);
router.delete('/:id', verify, postController.deletePost);

module.exports = router;
