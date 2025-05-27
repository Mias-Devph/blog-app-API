const Post = require('../models/Post');

// Create a new blog post
exports.createPost = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) return res.status(400).json({ message: "Title and content are required" });

    const post = new Post({
      title,
      content,
      author: req.user.id
    });

    await post.save();
    res.status(201).json(post);
  } catch (err) {
    next(err);
  }
};

// Get all blog posts (populate author username and email)
exports.getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find().populate('author', 'username email').sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    next(err);
  }
};

// Get single blog post by ID
exports.getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'username email');
    if (!post) return res.status(404).json({ message: "Blog post not found" });
    res.json(post);
  } catch (err) {
    next(err);
  }
};

// Update blog post - only author or admin can update
exports.updatePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Blog post not found" });

    if (post.author.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: "Forbidden: Not the author or admin" });
    }

    const { title, content } = req.body;
    if (title) post.title = title;
    if (content) post.content = content;

    await post.save();
    res.json(post);
  } catch (err) {
    next(err);
  }
};

// Delete blog post - author or admin only, but admin can delete any post
exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Blog post not found" });

    if (post.author.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: "Forbidden: Not the author or admin" });
    }

    await Post.findByIdAndDelete(req.params.id);  // ✅ This deletes the post directly
    res.json({ message: "Blog post deleted successfully" });
  } catch (err) {
    next(err);
  }
};
