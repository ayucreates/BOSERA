# Deployment

This project can be deployed as one Node web service. The backend serves the API, uploaded product images, and the built React frontend.

## Required Environment Variables

Set these in your hosting provider dashboard:

```text
NODE_ENV=production
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_long_random_secret
JWT_EXPIRE=30d
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

## Render Setup

Create a new Web Service from the GitHub repo.

Use these settings:

```text
Runtime: Node
Build Command: cd backend && npm install && cd ../frontend && npm install && npm run build
Start Command: cd backend && npm start
```

After the deploy finishes, Render gives you a public `.onrender.com` URL.

## MongoDB Atlas

Create an Atlas database, create a database user, and use the Atlas connection string as `MONGO_URI`.

For the network access list, allow your deployed service to connect. During testing, `0.0.0.0/0` is the easiest option, but a narrower allowlist is better for production.

## Uploaded Images

This app stores uploaded product images in `backend/uploads`. On hosts with an ephemeral filesystem, uploaded files can disappear after restarts or deploys unless you add persistent storage or move uploads to a media service such as Cloudinary or S3.

On Render, attach a persistent disk mounted at:

```text
/opt/render/project/src/backend/uploads
```

## Local Production Check

From the project root:

```bash
cd frontend
npm run build
cd ../backend
$env:NODE_ENV='production'
npm start
```

Then open `${import.meta.env.VITE_API_URL}`.
