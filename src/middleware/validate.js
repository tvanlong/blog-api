const { z } = require('zod');

// Validation schemas
const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
  avatarUrl: z.string().url().optional(),
});

const userUpdateSchema = z.object({
  email: z.string().email().optional(),
  password: z.string().min(8).optional(),
  name: z.string().min(1).optional(),
  avatarUrl: z.string().url().nullable().optional(),
});

const postSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  categoryIds: z.array(z.string().uuid()).optional(),
});

const commentSchema = z.object({
  content: z.string().min(1),
});

const categorySchema = z.object({
  name: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9-]+$/),
});

// Validation middleware
const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    res.status(400).json({ error: 'Validation failed', details: error.errors });
  }
};

module.exports = {
  validate,
  userSchema,
  userUpdateSchema,
  postSchema,
  commentSchema,
  categorySchema,
};