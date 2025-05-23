const { PrismaClient } = require('@prisma/client');
const { marked } = require('marked');
const sanitizeHtml = require('sanitize-html');
const prisma = new PrismaClient();

marked.setOptions({
  gfm: true,
  breaks: true,
});

const createNewPost = async ({ title, content, authorId, categoryIds }) => {
  if (!title || !content) {
    throw new Error('Title and content are required');
  }
  const data = {
    title,
    content,
    authorId,
  };
  if (categoryIds && categoryIds.length > 0) {
    data.categories = {
      create: categoryIds.map(categoryId => ({
        category: { connect: { id: categoryId } },
      })),
    };
  }
  const post = await prisma.post.create({
    data,
    include: { categories: { include: { category: true } } },
  });
  return formatPost(post);
};

const fetchPostsWithPagination = async ({ page = 1, limit = 10, search, category }) => {
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  if (pageNum < 1 || limitNum < 1) {
    throw new Error('Invalid page or limit');
  }
  const skip = (pageNum - 1) * limitNum;
  const where = {};
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { content: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (category) {
    where.categories = {
      some: {
        category: { slug: category },
      },
    };
  }
  const posts = await prisma.post.findMany({
    where,
    skip,
    take: limitNum,
    orderBy: { createdAt: 'desc' },
    include: {
      author: { select: { name: true, avatarUrl: true } },
      categories: { include: { category: { select: { name: true, slug: true } } } },
    },
  });
  const total = await prisma.post.count({ where });
  const totalPages = Math.ceil(total / limitNum);
  const parsedPosts = posts.map(post => formatPost(post));
  return { posts: parsedPosts, pagination: { page: pageNum, limit: limitNum, total, totalPages } };
};

const fetchPostById = async (id) => {
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      comments: {
        include: { author: { select: { name: true, avatarUrl: true } } },
        orderBy: { createdAt: 'asc' },
      },
      author: { select: { name: true, avatarUrl: true } },
      categories: { include: { category: { select: { name: true, slug: true } } } },
    },
  });
  if (!post) {
    throw new Error('Post not found');
  }
  post.comments = post.comments || [];
  return formatPost(post);
};

const modifyPost = async (id, authorId, { title, content, categoryIds }) => {
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) {
    throw new Error('Post not found');
  }
  if (post.authorId !== authorId) {
    throw new Error('Unauthorized');
  }
  const data = { title, content };
  if (categoryIds) {
    data.categories = {
      deleteMany: {},
      create: categoryIds.map(categoryId => ({
        category: { connect: { id: categoryId } },
      })),
    };
  }
  const updatedPost = await prisma.post.update({
    where: { id },
    data,
    include: { categories: { include: { category: true } } },
  });
  return formatPost(updatedPost);
};

const removePost = async (id, authorId) => {
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) {
    throw new Error('Post not found');
  }
  if (post.authorId !== authorId) {
    throw new Error('Unauthorized');
  }
  await prisma.post.delete({ where: { id } });
  return { message: 'Post deleted successfully' };
};

const formatPost = (post) => ({
  ...post,
  content: sanitizeHtml(marked(post.content)),
  categories: post.categories.map(pc => pc.category),
});

module.exports = { createNewPost, fetchPostsWithPagination, fetchPostById, modifyPost, removePost };