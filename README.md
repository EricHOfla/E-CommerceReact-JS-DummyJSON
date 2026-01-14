🛒 EROH Shop – E-Commerce Application

A modern, full-featured e-commerce web application built with **React**, **Vite**, and **Tailwind CSS**. It integrates the DummyJSON API to deliver realistic shopping flows: product browsing, cart and wishlist management, authentication, and an admin dashboard.

## 🚀 Live Demo
- Live: https://erohshop.vercel.app
- Portfolio: https://oflacoder.vercel.app/

## ✨ Features
- 🔐 Authentication (login, logout) with protected routes
- 🛍️ Product catalog with categories
- 🔎 Search and filtering
- 🛒 Cart (add, remove, update quantities)
- ❤️ Wishlist
- 👤 User dashboard
- 🧑‍💼 Admin dashboard
- 📱 Fully responsive design
- ⚡ Axios-powered API integration
- 🧠 Global state via React Context API

## 🧰 Tech Stack
- Frontend: React 19.2.0
- Build: Vite 7.2.4
- Styling: Tailwind CSS 4.1.18
- Routing: React Router DOM 7.12.0
- HTTP: Axios 1.13.2
- API: DummyJSON (fake REST API)

## 📦 Prerequisites
- Node.js v14+ (v18+ recommended)
- npm or yarn
- Git

## ⚙️ Setup
1) Clone
```bash
git clone https://github.com/EricHOfla/E-CommerceReact-JS-DummyJSON.git
cd E-CommerceReact-JS-DummyJSON
```
2) Install
```bash
npm install
# or
yarn install
```
3) Run dev server
```bash
npm run dev
# or
yarn dev
```
App runs at http://localhost:5173

4) Production build & preview
```bash
npm run build
npm run preview
```

## 📁 Project Structure
```
src/
├── admin/           # Admin components
├── api/             # Axios configuration
├── assets/          # Images & static files
├── components/      # Reusable UI components
├── context/         # Auth, Cart, Products, Wishlist contexts
├── pages/           # Application pages
├── App.jsx
├── main.jsx
└── index.css
```

## 🌐 API Integration (DummyJSON)
- GET /products
- GET /products/categories
- GET /products/category/{name}
- POST /auth/login
- GET /cart

## 🚀 Deployment
**Vercel (recommended)**
- Build: `npm run build`
- Output: `dist`
- Framework: Vite

**Netlify**
- Build: `npm run build`
- Publish: `dist`

## 🧪 Troubleshooting
- Port in use: `npm run dev -- --port 3000`
- Module not found: remove `node_modules` and lockfile, then reinstall
```bash
rm -rf node_modules package-lock.json
npm install
```

## 🔑 Environment Variables (optional)
Create `.env.local`:
```
VITE_API_URL=https://dummyjson.com
VITE_APP_NAME=EROH Shop
```

## 📸 Screenshots
Add images for home, product, cart, and admin pages here.

## 🤝 Contributing
1. Fork the repo
2. Create a feature branch
3. Commit your changes
4. Push and open a PR

## 📄 License
MIT License

## 📞 Support
Email: support@erohshop.com

## 🙏 Acknowledgments
React · Vite · Tailwind CSS · DummyJSON · React Router

## 🧑‍💻 Author
HABUMUGISHA Eric
- GitHub: https://github.com/EricHOfla
- Portfolio: https://oflacoder.vercel.app/

Last Updated: January 2026
