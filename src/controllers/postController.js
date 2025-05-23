const postService = require('../services/postService');
const { validate, postSchema } = require('../middleware/validate');

// @desc    Get all posts with pagination
// @route   GET /api/posts
// @access  Public
const getPosts = async (req, res) => {
  try {
    const { page, limit, search, category } = req.query;
    const result = await postService.fetchPostsWithPagination({ page, limit, search, category });
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
const createPost = [
  validate(postSchema),
  async (req, res) => {
    try {
      const { title, content, categoryIds } = req.body;
      const post = await postService.createNewPost({
        title,
        content,
        authorId: req.user.userId,
        categoryIds,
      });
      res.status(201).json(post);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
];

// @desc    Get a single post by ID
// @route   GET /api/posts/:id
// @access  Public
const getPost = async (req, res) => {
  try {
    const post = await postService.fetchPostById(req.params.id);
    res.json(post);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

// @desc    Update a post
// @route   PUT /api/posts/:id
// @access  Private
const updatePost = [
  validate(postSchema),
  async (req, res) => {
    try {
      const { title, content, categoryIds } = req.body;
      const post = await postService.modifyPost(req.params.id, req.user.userId, {
        title,
        content,
        categoryIds,
      });
      res.json(post);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
];

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private
const deletePost = async (req, res) => {
  try {
    const result = await postService.removePost(req.params.id, req.user.userId);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { getPosts, createPost, getPost, updatePost, deletePost };