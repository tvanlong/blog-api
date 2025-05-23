# Blog API

A RESTful API for a blog platform built with Node.js, Express, and PostgreSQL. It supports user authentication (JWT), post creation with markdown, commenting, categories, search, and Swagger documentation.

## Features

- **User Management**: Register, login, logout, refresh token, update (with avatar), and delete user accounts.
- **Post Management**: Create, read, update, delete posts with markdown and category support.
- **Comment Management**: Add, read, update, delete comments on posts.
- **Category Management**: Create, read, update, delete categories for posts.
- **Search**: Search posts by title or content (`/posts?search=keyword`).
- **Authentication**: JWT access tokens (15m) and refresh tokens (30d).
- **Security**: Helmet, CORS, and sanitize-html for safe markdown rendering.
- **Pagination**: Paginated post retrieval with search and category filters.
- **Validation**: Request validation using Zod.
- **API Documentation**: Swagger UI at `/api-docs`.
- **Development**: Nodemon for auto-restart.

## Requirements

- **Node.js**: v18 or higher
- **PostgreSQL**: v14 or higher
- **Prisma CLI**: For migrations
- **Dependencies**:
  - `express`, `dotenv`, `prisma`, `@prisma/client`, `jsonwebtoken`, `bcryptjs`, `marked`, `swagger-ui-express`, `yamljs`, `cors`, `helmet`, `sanitize-html`, `uuid`, `zod`
- **Dev Dependencies**:
  - `nodemon`

## Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd blog-api
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up PostgreSQL**:
   - Create a database named `blog_db`.
   - Configure `.env`:
     ```
     DATABASE_URL="postgresql://username:password@localhost:5432/blog_db?schema=public"
     JWT_SECRET="your_random_strong_secret_key_32_chars_or_more"
     REFRESH_TOKEN_SECRET="another_random_strong_secret_key_32_chars_or_more"
     PORT=3000
     ```
   - Generate secrets:
     ```javascript
     require('crypto').randomBytes(32).toString('hex');
     ```

4. **Initialize Prisma**:
   ```bash
   npx prisma init
   ```

5. **Run database migrations**:
   ```bash
   npm run migrate
   ```

6. **Seed the database (optional)**:
   ```bash
   npm run seed
   ```

7. **Start the server**:
   - Development:
     ```bash
     npm run start:dev
     ```
   - Production:
     ```bash
     npm start
     ```

8. **Access API documentation**:
   - Open `http://localhost:3000/api-docs`.

## Project Structure

```
blog-api/
├── prisma/
│   └── schema.prisma          # Prisma schema
├── src/
│   ├── controllers/          # Request handlers
│   │   ├── userController.js
│   │   ├── postController.js
│   │   ├── commentController.js
│   │   └── categoryController.js
│   ├── middleware/           # Middleware
│   │   ├── authMiddleware.js
│   │   └── validate.js
│   ├── routes/              # Express routes
│   │   ├── userRoutes.js
│   │   ├── postRoutes.js
│   │   ├── commentRoutes.js
│   │   └── categoryRoutes.js
│   ├── services/            # Business logic
│   │   ├── userService.js
│   │   ├── postService.js
│   │   ├── commentService.js
│   │   └── categoryService.js
│   ├── utils/               # Utilities
│   │   └── markdown.js
│   ├── docs/                # Swagger setup
│   │   └── swagger.js
│   └── index.js             # Server entry point
├── swagger.yaml             # Swagger documentation
├── seed.js                  # Seed script
├── .env                     # Environment variables
├── package.json             # Dependencies and scripts
└── README.md                # Documentation
```

## API Endpoints

See Swagger UI (`http://localhost:3000/api-docs`) for details.

### User
| Method | Endpoint                   | Description                          | Authentication |
|--------|----------------------------|--------------------------------------|----------------|
| POST   | `/users/register`          | Register a new user (with avatar)    | None           |
| POST   | `/users/login`             | Login a user                         | None           |
| POST   | `/users/refresh-token`     | Refresh access token                 | None           |
| POST   | `/users/logout`            | Logout a user                        | Bearer Token   |
| GET    | `/users/{id}`              | Get user by ID                       | Bearer Token   |
| PUT    | `/users/{id}`              | Update user (email, password, name, avatar) | Bearer Token   |
| DELETE | `/users/{id}`              | Delete a user                        | Bearer Token   |

### Post
| Method | Endpoint                   | Description                          | Authentication |
|--------|----------------------------|--------------------------------------|----------------|
| GET    | `/posts?page=1&limit=10&search=keyword&category=slug` | Get paginated posts (search by title/content, filter by category) | None |
| POST   | `/posts`                   | Create a new post (with categories)  | Bearer Token   |
| GET    | `/posts/{id}`              | Get post by ID (includes comments, categories) | None           |
| PUT    | `/posts/{id}`              | Update a post (with categories)      | Bearer Token   |
| DELETE | `/posts/{id}`              | Delete a post                        | Bearer Token   |

### Comment
| Method | Endpoint                        | Description                          | Authentication |
|--------|---------------------------------|--------------------------------------|----------------|
| GET    | `/posts/{postId}/comments`      | Get comments for a post              | None           |
| POST   | `/posts/{postId}/comments`      | Create a new comment                 | Bearer Token   |
| PUT    | `/comments/{id}`                | Update a comment                     | Bearer Token   |
| DELETE | `/comments/{id}`                | Delete a comment                     | Bearer Token   |

### Category
| Method | Endpoint                   | Description                          | Authentication |
|--------|----------------------------|--------------------------------------|----------------|
| GET    | `/categories`              | Get all categories                   | None           |
| POST   | `/categories`              | Create a new category                | Bearer Token   |
| GET    | `/categories/{id}`         | Get category by ID (includes posts)  | None           |
| PUT    | `/categories/{id}`         | Update a category                    | Bearer Token   |
| DELETE | `/categories/{id}`         | Delete a category                    | Bearer Token   |

**Response Format for `GET /posts/{id}`**:
```json
{
  "id": "uuid",
  "title": "string",
  "content": "string",
  "authorId": "uuid",
  "author": {
    "name": "string",
    "avatarUrl": "string"
  },
  "createdAt": "2025-05-20T13:39:48.691Z",
  "updatedAt": "2025-05-20T13:39:48.691Z",
  "comments": [
    {
      "id": "uuid",
      "content": "string",
      "postId": "uuid",
      "authorId": "uuid",
      "author": {
        "name": "string",
        "avatarUrl": "string"
      },
      "createdAt": "2025-05-20T13:39:48.691Z",
      "updatedAt": "2025-05-20T13:39:48.691Z"
    }
  ],
  "categories": [
    {
      "id": "uuid",
      "name": "string",
      "slug": "string",
      "createdAt": "2025-05-20T13:39:48.691Z",
      "updatedAt": "2025-05-20T13:39:48.691Z"
    }
  ]
}
```

## Sample Data

Run the seed script to populate the database:

### Seed Script (`seed.js`)

```javascript
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
          authorId: users[(index + 2) % users.length].id