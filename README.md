# 🚀 Portfolio V3

![Next.js](https://img.shields.io/badge/Next.js-14-black) ![React](https://img.shields.io/badge/React-18-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC) ![Node.js](https://img.shields.io/badge/Node.js-18-green) ![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248)

A high-performance, visually stunning portfolio website featuring enterprise-grade security, a custom CMS (Admin Panel), and cutting-edge UI animations. Built with a decoupled **Next.js** frontend and **Express** backend.

## ✨ Key Features

### 🎨 Creative UI/UX
- **Smooth Animations**: Framer Motion integration for buttery smooth page transitions and scroll effects.
- **Micro-interactions**: Magnetic buttons, cursor effects, and glowing cards.
- **Responsive Design**: Mobile-first architecture using Tailwind CSS.
- **Dark Mode**: Fully supported system-aware dark/light themes.

### 🛡️ Enterprise-Grade Security
- **Invisible Backend**: API calls are proxied through Next.js Rewrites (`/api/...`), completely hiding the backend URL from `Inspect Element`.
- **Attack Protection**: Secured against XSS, NoSQL Injection, and HTTP Parameter Pollution.
- **Strict Validation**: All data is validated using **Zod** schemas on both client and server.
- **Rate Limiting**: Intelligent limiting to prevent abuse.

### ⚡ Performance
- **Zero CLS**: Optimized font loading and layout stability.
- **Production Optimized**: Source maps disabled, headers secured, and assets compressed.
- **Dynamic Content**: Full Admin Panel to manage Projects, Blogs, Certificates, and Experience without touching code.

---

## 🛠️ Tech Stack

**Frontend**
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + Shadcn UI
- **Animations**: Framer Motion
- **State/Fetching**: React Hooks + Custom API wrapper

**Backend**
- **Runtime**: Node.js + Express
- **Database**: MongoDB (Mongoose)
- **Security**: Helmet, Zod, Rate-Limiter, Mongo-Sanitize
- **Storage**: Cloudinary (for images/resumes)

---

## ⚡ Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB connection string
- Cloudinary credentials

### 1. Installation

```bash
# Clone the repository
git clone https://github.com/Starbuster2004/Portfolio.git

# Install Frontend dependencies
cd client
npm install

# Install Backend dependencies
cd ../server
npm install
```

### 2. Environment Variables

Create `.env` in `server/` and `.env.local` in `client/` based on `.env.example`.

**Client (`client/.env.local`)**
```env
API_URL=http://localhost:5000
```
*(Note: faster local dev use http://localhost:5000, production uses real URL)*

**Server (`server/.env`)**
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
NODE_ENV=development
```

### 3. Running Locally

**Start Backend**
```bash
cd server
npm run dev
# Running on http://localhost:5000
```

**Start Frontend**
```bash
cd client
npm run dev
# Running on http://localhost:3000
```

Visit `http://localhost:3000`. The frontend will proxy requests to the backend automatically.

---

## 🚀 Deployment

- **Frontend**: Deploy `client` folder to **Vercel**. Set `API_URL` environment variable to your backend URL.
- **Backend**: Deploy `server` folder to **Render/Railway**. Set all backend environment variables.

See `deployment_guide.md` in the repository for detailed steps.

---

## 📄 License
MIT License.
