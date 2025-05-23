const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createNewComment = async ({ postId, content, authorId }) => {
  if (!content) {
    throw new Error('Content is required');
  }
  const post = await prisma.post.findUnique({ where: { id: parseInt(postId) } });
  if (!post) {
    throw new Error('Post not found');
  }
  const comment = await prisma.comment.create({
    data: { content, postId: parseInt(postId), authorId },
    include: { author: { select: { name: true } } },
  });
  return comment;
};

const fetchCommentsByPostId = async (postId) => {
  const post = await prisma.post.findUnique({ where: { id: parseInt(postId) } });
  if (!post) {
    throw new Error('Post not found');
  }
  const comments = await prisma.comment.findMany({
    where: { postId: parseInt(postId) },
    include: { author: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
  });
  return comments;
};

const modifyComment = async (id, authorId, { content }) => {
  if (!content) {
    throw new Error('Content is required');
  }
  const comment = await prisma.comment.findUnique({ where: { id: parseInt(id) } });
  if (!comment) {
    throw new Error('Comment not found');
  }
  if (comment.authorId !== authorId) {
    throw new Error('Unauthorized');
  }
  const updatedComment = await prisma.comment.update({
    where: { id: parseInt(id) },
    data: { content },
    include: { author: { select: { name: true } } },
  });
  return updatedComment;
};

const removeComment = async (id, authorId) => {
  const comment = await prisma.comment.findUnique({ where: { id: parseInt(id) } });
  if (!comment) {
    throw new Error('Comment not found');
  }
  if (comment.authorId !== authorId) {
    throw new Error('Unauthorized');
  }
  await prisma.comment.delete({ where: { id: parseInt(id) } });
  return { message: 'Comment deleted successfully' };
};

module.exports = { createNewComment, fetchCommentsByPostId, modifyComment, removeComment };