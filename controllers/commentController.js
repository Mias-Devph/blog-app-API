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

    // 🔥 THIS IS CRUCIAL
    const populatedComment = await Comment.findById(comment._id)
      .populate('author', 'username email');

    res.status(201).json(populatedComment);
  } catch (err) {
    next(err);
  }
};

exports.updateComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;

    if (!content) return res.status(400).json({ message: "Content is required" });

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    // Ensure the logged-in user owns the comment
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    comment.content = content;
    await comment.save();

    const updated = await Comment.findById(comment._id).populate('author', 'username email');
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

exports.deleteComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await comment.deleteOne();

    res.json({ message: "Comment deleted" });
  } catch (err) {
    next(err);
  }
};




// Delete comment - Admin only
exports.deleteCommentAdmin = async (req, res, next) => {
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



