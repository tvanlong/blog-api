const userService = require('../services/userService');
const { validate, userSchema, userUpdateSchema } = require('../middleware/validate');

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const register = [
  validate(userSchema),
  async (req, res) => {
    try {
      const { email, password, name, avatarUrl } = req.body;
      const result = await userService.registerUser({ email, password, name, avatarUrl });
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
];

// @desc    Login a user
// @route   POST /api/users/login
// @access  Public
const login = [
  validate(userSchema.omit({ name: true, avatarUrl: true })),
  async (req, res) => {
    try {
      const { email, password } = req.body;
      const result = await userService.loginUser({ email, password });
      res.json(result);
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  },
];

// @desc    Refresh token
// @route   POST /api/users/refresh-token
// @access  Public
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const result = await userService.refreshToken(refreshToken);
    res.json(result);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

// @desc    Logout a user
// @route   POST /api/users/logout
// @access  Private
const logout = async (req, res) => {
  try {
    await userService.logoutUser(req.user.userId);
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
const getUser = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.json(user);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private
const updateUser = [
  validate(userUpdateSchema),
  async (req, res) => {
    try {
      const { email, password, name, avatarUrl } = req.body;
      const user = await userService.updateUser(req.params.id, { email, password, name, avatarUrl });
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
];

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private
const deleteUser = async (req, res) => {
  try {
    await userService.deleteUser(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { register, login, refreshToken, logout, getUser, updateUser, deleteUser };