const { PrismaClient } = require('@prisma/client');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const prisma = new PrismaClient();

async function seed() {
  // Clear existing data
  await prisma.refreshToken.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.postCategory.deleteMany();
  await prisma.post.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        id: uuidv4(),
        email: 'user1@example.com',
        password: await bcrypt.hash('password123', 10),
        name: 'John Doe',
        avatarUrl: 'https://example.com/avatars/john.jpg',
      },
    }),
    prisma.user.create({
      data: {
        id: uuidv4(),
        email: 'user2@example.com',
        password: await bcrypt.hash('password123', 10),
        name: 'Jane Smith',
        avatarUrl: 'https://example.com/avatars/jane.jpg',
      },
    }),
    prisma.user.create({
      data: {
        id: uuidv4(),
        email: 'user3@example.com',
        password: await bcrypt.hash('password123', 10),
        name: 'Alice Johnson',
        avatarUrl: 'https://example.com/avatars/alice.jpg',
      },
    }),
    prisma.user.create({
      data: {
        id: uuidv4(),
        email: 'user4@example.com',
        password: await bcrypt.hash('password123', 10),
        name: 'Bob Brown',
        avatarUrl: 'https://example.com/avatars/bob.jpg',
      },
    }),
    prisma.user.create({
      data: {
        id: uuidv4(),
        email: 'user5@example.com',
        password: await bcrypt.hash('password123', 10),
        name: 'Emma Davis',
        avatarUrl: 'https://example.com/avatars/emma.jpg',
      },
    }),
  ]);

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        id: uuidv4(),
        name: 'Technology',
        slug: 'technology',
      },
    }),
    prisma.category.create({
      data: {
        id: uuidv4(),
        name: 'Travel',
        slug: 'travel',
      },
    }),
    prisma.category.create({
      data: {
        id: uuidv4(),
        name: 'Food',
        slug: 'food',
      },
    }),
    prisma.category.create({
      data: {
        id: uuidv4(),
        name: 'Fitness',
        slug: 'fitness',
      },
    }),
    prisma.category.create({
      data: {
        id: uuidv4(),
        name: 'Books',
        slug: 'books',
      },
    }),
  ]);

  // Create posts
  const posts = await Promise.all([
    prisma.post.create({
      data: {
        id: uuidv4(),
        title: 'First Post',
        content: '# Welcome to my blog\nThis is my **first post**!',
        authorId: users[0].id,
        categories: {
          create: [{ categoryId: categories[0].id }],
        },
      },
    }),
    prisma.post.create({
      data: {
        id: uuidv4(),
        title: 'Second Post',
        content: '## Another post\nSome _markdown_ content here.',
        authorId: users[1].id,
        categories: {
          create: [{ categoryId: categories[0].id }],
        },
      },
    }),
    prisma.post.create({
      data: {
        id: uuidv4(),
        title: 'Tech Trends 2025',
        content: '### Tech Insights\n- AI advancements\n- Cloud computing',
        authorId: users[2].id,
        categories: {
          create: [{ categoryId: categories[0].id }],
        },
      },
    }),
    prisma.post.create({
      data: {
        id: uuidv4(),
        title: 'Travel Diary',
        content: 'Visited Paris last week. Amazing experience!',
        authorId: users[3].id,
        categories: {
          create: [{ categoryId: categories[1].id }],
        },
      },
    }),
    prisma.post.create({
      data: {
        id: uuidv4(),
        title: 'Cooking Tips',
        content: '# Easy Recipes\nTry this pasta dish at home.',
        authorId: users[4].id,
        categories: {
          create: [{ categoryId: categories[2].id }],
        },
      },
    }),
    prisma.post.create({
      data: {
        id: uuidv4(),
        title: 'Fitness Goals',
        content: '## Stay Fit\nDaily workout routines.',
        authorId: users[0].id,
        categories: {
          create: [{ categoryId: categories[3].id }],
        },
      },
    }),
    prisma.post.create({
      data: {
        id: uuidv4(),
        title: 'Book Review',
        content: 'Just finished reading "1984". Highly recommend!',
        authorId: users[1].id,
        categories: {
          create: [{ categoryId: categories[4].id }],
        },
      },
    }),
    prisma.post.create({
      data: {
        id: uuidv4(),
        title: 'Photography Tips',
        content: '### Capture Moments\nBest camera settings.',
        authorId: users[2].id,
        categories: {
          create: [{ categoryId: categories[0].id }],
        },
      },
    }),
    prisma.post.create({
      data: {
        id: uuidv4(),
        title: 'Gardening Guide',
        content: 'How to grow your own vegetables.',
        authorId: users[3].id,
        categories: {
          create: [{ categoryId: categories[2].id }],
        },
      },
    }),
    prisma.post.create({
      data: {
        id: uuidv4(),
        title: 'Music Playlist',
        content: 'My favorite songs of 2025.',
        authorId: users[4].id,
        categories: {
          create: [{ categoryId: categories[0].id }],
        },
      },
    }),
  ]);

  // Log post IDs for debugging
  console.log('Created posts:', posts.map(p => ({ id: p.id, title: p.title })));

  // Create comments for all posts
  const comments = await Promise.all(
    posts.flatMap((post, index) =>
      [
        {
          id: uuidv4(),
          content: `Great ${post.title.toLowerCase()}!`,
          postId: post.id,
          authorId: users[(index + 1) % users.length].id,
        },
        {
          id: uuidv4(),
          content: `Thanks for sharing about ${post.title.toLowerCase()}!`,
          postId: post.id,
          authorId: users[(index + 2) % users.length].id,
        },
        {
          id: uuidv4(),
          content: `Really enjoyed this ${post.title.toLowerCase()} post.`,
          postId: post.id,
          authorId: users[(index + 3) % users.length].id,
        },
      ].map(comment =>
        prisma.comment.create({
          data: comment,
        })
      )
    )
  );

  // Create refresh tokens (for testing)
  await Promise.all([
    prisma.refreshToken.create({
      data: {
        id: uuidv4(),
        token: crypto.randomBytes(32).toString('hex'),
        userId: users[0].id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    }),
    prisma.refreshToken.create({
      data: {
        id: uuidv4(),
        token: crypto.randomBytes(32).toString('hex'),
        userId: users[1].id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    }),
  ]);

  console.log('Database seeded successfully!');
  console.log(`Created ${users.length} users, ${categories.length} categories, ${posts.length} posts, ${comments.length} comments`);
}

seed()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());