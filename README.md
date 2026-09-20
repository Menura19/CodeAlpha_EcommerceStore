# CodeAlpha Full Stack Starter

Your Day 1 skeleton. Registration, sign in, bcrypt password hashing, JWT, protected
API routes, protected React routes, and a deploy-ready config — already built and wired
together.

Copy this folder three times, rename it, and add only the parts that make each project
different. The authentication layer never changes.

- `CodeAlpha_EcommerceStore`
- `CodeAlpha_SocialMediaPlatform`
- `CodeAlpha_ProjectManagementTool`

**Stack:** React 18 + Vite + Tailwind v4 + React Router 6 · Express 4 + MongoDB (Mongoose) + JWT

---

## Get it running (about 15 minutes, once)

### 1. MongoDB Atlas

1. Sign up at mongodb.com/atlas and create a free **M0** cluster.
2. **Database Access** → add a user. Save the password somewhere; you cannot view it again.
3. **Network Access** → Add IP Address → **Allow access from anywhere** (`0.0.0.0/0`).
   Render's IPs change, so a narrower rule will break your deploy.
4. **Connect** → **Drivers** → copy the connection string.

### 2. Backend

```bash
cd server
npm install
cp .env.example .env
```

Open `.env` and fill in three things:

- `MONGO_URI` — your Atlas string, with `<password>` replaced by the real password and a
  database name after the host, e.g. `.../codealpha_ecommerce?retryWrites=true&w=majority`
- `JWT_SECRET` — generate one:
  ```bash
  node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
  ```
- `CLIENT_URL` — leave as `http://localhost:5173` for now

Then:

```bash
npm run dev
```

You should see `MongoDB connected: ...` and `Server running ... on port 5000`.
Check it: open `http://localhost:5000/api/health` — you should get `{"status":"ok",...}`.

If you see `MongoDB connection failed`, the password in your URI is wrong or contains a
special character. URL-encode it (`@` → `%40`, `#` → `%23`).

### 3. Frontend

In a **second terminal**:

```bash
cd client
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:5173`. You'll be redirected to `/login`. Click **Create one**,
register, and you'll land on the dashboard showing your own account record.

Refresh the page. You stay signed in — that's the token in local storage being exchanged
for your user via `GET /api/auth/me`.

**Both terminals must stay running.** The frontend on 5173 talks to the backend on 5000.

---

## What is already built

### Backend

| File | What it does |
|---|---|
| `server.js` | Express app, CORS whitelist, route mounting, health check |
| `config/db.js` | Mongoose connection, exits loudly if `MONGO_URI` is missing |
| `models/User.js` | User schema, bcrypt pre-save hook, `matchPassword()`, password stripped from JSON |
| `middleware/auth.js` | `protect` (requires a valid token) and `adminOnly` |
| `middleware/errorHandler.js` | Turns CastError, duplicate keys and validation errors into clean JSON |
| `controllers/authController.js` | register, login, getMe, updateMe |
| `utils/generateToken.js` | Signs a JWT holding only the user id |

### Frontend

| File | What it does |
|---|---|
| `api/axios.js` | Base URL from env, attaches the token, converts errors into readable messages |
| `context/AuthContext.jsx` | `user`, `login`, `register`, `logout`, session restore on load |
| `components/ProtectedRoute.jsx` | Redirects to `/login` and remembers where you were going |
| `components/AuthLayout.jsx` | Split-screen shell for the auth pages |
| `components/Field.jsx`, `Button.jsx` | Consistent form controls |
| `src/index.css` | **Six colour tokens.** Re-theme an entire project by editing this block |

---

## API reference

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Auth | Body | Returns |
|---|---|---|---|---|
| GET | `/health` | — | — | `{ status, time }` |
| POST | `/auth/register` | — | `{ name, email, password }` | `{ user, token }` |
| POST | `/auth/login` | — | `{ email, password }` | `{ user, token }` |
| GET | `/auth/me` | Bearer | — | `{ user }` |
| PUT | `/auth/me` | Bearer | `{ name?, avatar?, password? }` | `{ user }` |

Test these in Postman or Thunder Client **before** you write any React. When an endpoint
works in Postman and fails in the browser, the bug is in your frontend — that split saves
you hours.

---

## How to add a feature (the loop you'll repeat ~30 times)

1. **Model** — `server/models/Thing.js`, a Mongoose schema
2. **Controller** — `server/controllers/thingController.js`, each function wrapped in
   `try { ... } catch (error) { next(error); }`
3. **Routes** — `server/routes/thingRoutes.js`, add `protect` to anything that needs a user
4. **Mount it** — one line in `server.js`: `app.use('/api/things', thingRoutes);`
5. **Test in Postman**
6. **Then** build the React page and call it with `api.get('/things')`

Never skip step 5.

---

## Extending it per project

### Task 1 — E-commerce Store

Add `models/Product.js` (name, description, price, image, category, stock, rating) and
`models/Order.js` (user ref, `orderItems[]`, shippingAddress, totalPrice, status, timestamps).

Keep the cart in React state plus local storage — you do not need a cart collection.

Write `server/seeder.js` that inserts 15–20 products with real image URLs and run it once.
An empty store looks broken on camera.

### Task 2 — Social Media Platform

Extend `models/User.js` with:

```js
bio: { type: String, default: '', maxlength: 160 },
followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
```

Add `Post` (author ref, text, image, `likes: [ObjectId]`) and `Comment` (post ref, author
ref, text).

Follow and unfollow must update **both** documents. Use `$addToSet` and `$pull` so you
cannot create duplicates:

```js
await User.findByIdAndUpdate(req.user._id, { $addToSet: { following: targetId } });
await User.findByIdAndUpdate(targetId,     { $addToSet: { followers: req.user._id } });
```

Likes are a toggle: if `post.likes` includes the user id, `$pull` it; otherwise `$addToSet`.

### Task 3 — Project Management Tool

Add `Project` (name, description, owner ref, `members: [ObjectId]`), `Task` (project ref,
title, description, `status: 'todo' | 'in-progress' | 'done'`, assignee ref, dueDate),
`Comment` (task ref, author ref, text) and `Notification` (user ref, message, read, link).

For drag and drop use `@dnd-kit/core` — `react-beautiful-dnd` is no longer maintained.

For the bonus marks, add `socket.io` to the server and `socket.io-client` to the client.
Join a room per project and emit after every task mutation:

```js
io.to(projectId).emit('taskUpdated', task);
```

In your demo video, open two browser windows side by side and drag a card in one. Watching
it move in the other is the single most impressive thing you can show a grader.

---

## Deploying

### Backend → Render

1. Push the repo to GitHub, then on Render: **New → Web Service**, connect the repo.
2. **Root Directory:** `server` · **Build:** `npm install` · **Start:** `npm start`
3. Add environment variables in Render's dashboard: `MONGO_URI`, `JWT_SECRET`,
   `NODE_ENV=production`, and `CLIENT_URL` (your Vercel URL — you'll fill this in after
   step 2 below, then redeploy).
4. Visit `https://your-service.onrender.com/api/health` to confirm it's alive.

### Frontend → Vercel

1. **New Project**, import the same repo.
2. **Root Directory:** `client` (Vercel detects Vite automatically).
3. Environment variable: `VITE_API_URL` = your Render URL, **no trailing slash**.
4. Deploy, copy the Vercel URL, put it in Render's `CLIENT_URL`, redeploy the backend.

`vercel.json` is already included so that refreshing on `/login` doesn't 404.

**Render's free tier sleeps after 15 minutes idle.** Open your live link and wait about 60
seconds before you start recording your demo video, and mention the cold start in your
README.

---

## Rules that will cost you the certificate if you break them

- `.gitignore` exists in both `server/` and `client/` and lists `.env`. **Never commit a
  real `.env`.** If a JWT secret or Mongo URI reaches GitHub, rotate it — deleting the file
  doesn't remove it from history.
- Repos must be **public**, named exactly `CodeAlpha_ProjectName`.
- Commit every day with real messages. One giant commit at the end looks like you didn't
  build it.
- No hardcoded `http://localhost:5000` in the frontend. Always
  `import.meta.env.VITE_API_URL`.
- Passwords are never stored or returned in plain text. This skeleton already handles it —
  don't undo it by removing `select: false`.

---

## Troubleshooting

| Symptom | Cause |
|---|---|
| `Cannot reach the server` in the browser | Backend terminal isn't running |
| CORS error in the console | `CLIENT_URL` in `.env` doesn't match the origin you're browsing from |
| `MongoDB connection failed` | Wrong password in `MONGO_URI`, or your IP isn't whitelisted |
| Signed out on every refresh | `GET /api/auth/me` is failing — check the Network tab |
| Tailwind classes do nothing | `@tailwindcss/vite` missing from `vite.config.js` plugins |
| 404 on refresh after deploy | `vercel.json` wasn't committed |

---

Built for the CodeAlpha Full Stack Development internship, 20 Sept – 20 Oct 2026.
