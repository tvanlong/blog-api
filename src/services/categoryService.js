const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createCategory = async ({ name, slug }) => {
  const existingCategory = await prisma.category.findUnique({ where: { slug } });
  if (existingCategory) {
    throw new Error('Category slug already exists');
  }
  return prisma.category.create({
    data: { name, slug },
  });
};

const getCategories = async () => {
  return prisma.category.findMany({
    orderBy: { name: 'asc' },
  });
};

const getCategoryById = async (id) => {
  const category = await prisma.category.findUnique({
    where: { id },
    include: { posts: { include: { post: true } } },
  });
  if (!category) {
    throw new Error('Category not found');
  }
  return category;
};

const updateCategory = async (id, { name, slug }) => {
  const existingCategory = await prisma.category.findUnique({ where: { slug } });
  if (existingCategory && existingCategory.id !== id) {
    throw new Error('Category slug already exists');
  }
  return prisma.category.update({
    where: { id },
    data: { name, slug },
  });
};

const deleteCategory = async (id) => {
  await prisma.category.delete({ where: { id } });
  return { message: 'Category deleted successfully' };
};

module.exports = { createCategory, getCategories, getCategoryById, updateCategory, deleteCategory };