const Comment = require('../models/Comment');
const Post = require('../models/Post');

// Get comments for a single blog post
exports.getCommentsByPost = async (req, res, next) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate('author', 'username email')
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    next(err);
  }
};

// Create comment on a blogg post (authenticated users)
exports.createComment = async (req, res, next) => {
  try {
    const { content } = req.body;
    const postId = req.params.postId;

    if (!content) return res.status(400).json({ message: "Content is required" });

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Blog post not found" });

    const comment = new Comment({
      content,
      author: req.user.id,
      post: postId
    });

    await comment.save();
    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
};

// Delete comment - Admin only
exports.deleteComment = async (req, res, next) => {
  try {
    // Only admin can delete comments
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Forbidden: Admins only" });
    }

    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    await comment.deleteOne(); 
    res.json({ message: "Comment deleted successfully" });
  } catch (err) {
    next(err);
  }
};

