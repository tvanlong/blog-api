const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();

const registerUser = async ({ email, password, name, avatarUrl }) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error('Email already exists');
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, password: hashedPassword, name, avatarUrl },
  });
  const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = await createRefreshToken(user.id);
  return { user, accessToken, refreshToken };
};

const loginUser = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error('Invalid credentials');
  }
  const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = await createRefreshToken(user.id);
  return { user, accessToken, refreshToken };
};

const createRefreshToken = async (userId) => {
  const token = require('crypto').randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
  const refreshToken = await prisma.refreshToken.create({
    data: { token, userId, expiresAt },
  });
  return refreshToken.token;
};

const refreshToken = async (refreshToken) => {
  const token = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
    include: { user: true },
  });
  if (!token || token.expiresAt < new Date()) {
    throw new Error('Invalid or expired refresh token');
  }
  const accessToken = jwt.sign({ userId: token.userId }, process.env.JWT_SECRET, { expiresIn: '15m' });
  const newRefreshToken = await createRefreshToken(token.userId);
  await prisma.refreshToken.delete({ where: { token: refreshToken } });
  return { user: token.user, accessToken, refreshToken: newRefreshToken };
};

const logoutUser = async (userId) => {
  await prisma.refreshToken.deleteMany({ where: { userId } });
};

const getUserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, email: true, name: true, avatarUrl: true, createdAt: true, updatedAt: true },
  });
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

const updateUser = async (id, { email, password, name, avatarUrl }) => {
  const data = {};
  if (email) data.email = email;
  if (password) data.password = await bcrypt.hash(password, 10);
  if (name) data.name = name;
  if (avatarUrl !== undefined) data.avatarUrl = avatarUrl;
  const user = await prisma.user.update({
    where: { id },
    data,
    select: { id: true, email: true, name: true, avatarUrl: true, createdAt: true, updatedAt: true },
  });
  return user;
};

const deleteUser = async (id) => {
  await prisma.user.delete({ where: { id } });
};

module.exports = { registerUser, loginUser, refreshToken, logoutUser, getUserById, updateUser, deleteUser };