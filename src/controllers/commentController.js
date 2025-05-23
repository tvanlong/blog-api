const { createNewComment, fetchCommentsByPostId, modifyComment, removeComment } = require('../services/commentService');

// @desc    Create a new comment
// @route   POST /api/comments/:postId
// @access  Private
const createComment = async (req, res) => {
  try {
    const comment = await createNewComment({ ...req.body, postId: req.params.postId, authorId: req.user.userId });
    res.status(201).json(comment);
  } catch (error) {
    console.error(error);
    res.status(error.message === 'Content is required' ? 400 : error.message === 'Post not found' ? 404 : 500).json({ error: error.message });
  }
};

// @desc    Get comments by post ID
// @route   GET /api/comments/:postId
// @access  Private
const getComments = async (req, res) => {
  try {
    const comments = await fetchCommentsByPostId(req.params.postId);
    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(error.message === 'Post not found' ? 404 : 500).json({ error: error.message });
  }
};

// @desc    Update a comment
// @route   PUT /api/comments/:id
// @access  Private
const updateComment = async (req, res) => {
  try {
    const comment = await modifyComment(parseInt(req.params.id), req.user.userId, req.body);
    res.json(comment);
  } catch (error) {
    console.error(error);
    res.status(error.message === 'Unauthorized' ? 403 : error.message === 'Comment not found' ? 404 : 500).json({ error: error.message });
  }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
// @access  Private
const deleteComment = async (req, res) => {
  try {
    const result = await removeComment(parseInt(req.params.id), req.user.userId);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(error.message === 'Unauthorized' ? 403 : error.message === 'Comment not found' ? 404 : 500).json({ error: error.message });
  }
};

module.exports = { createComment, getComments, updateComment, deleteComment };