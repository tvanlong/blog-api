const categoryService = require('../services/categoryService');
const { validate, categorySchema } = require('../middleware/validate');

// @desc    Create a new category
// @route   POST /api/categories
// @access  Private
const createCategory = [
  validate(categorySchema),
  async (req, res) => {
    try {
      const { name, slug } = req.body;
      const category = await categoryService.createCategory({ name, slug });
      res.status(201).json(category);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
];

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const categories = await categoryService.getCategories();
    res.json(categories);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc    Get a single category by ID
// @route   GET /api/categories/:id
// @access  Public
const getCategory = async (req, res) => {
  try {
    const category = await categoryService.getCategoryById(req.params.id);
    res.json(category);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private
const updateCategory = [
  validate(categorySchema),
  async (req, res) => {
    try {
      const { name, slug } = req.body;
      const category = await categoryService.updateCategory(req.params.id, { name, slug });
      res.json(category);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
];

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private
const deleteCategory = async (req, res) => {
  try {
    const result = await categoryService.deleteCategory(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { createCategory, getCategories, getCategory, updateCategory, deleteCategory };