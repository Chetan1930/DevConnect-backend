# 🔐 Auth Backend (Passport + JWT + Google OAuth)

This is the backend authentication server built with **Node.js**, **Express**, **Passport.js**, and **MongoDB**. It supports:

- Local authentication with email and password
- Google OAuth 2.0 login
- JWT-based authentication (token returned to frontend)
- Secure password hashing with bcrypt
- Easily integratable with React or any frontend

---

## 📁 Project Structure

```

📦 backend
├── config/
│   └── passport.js        # Passport strategy configuration
├── models/
│   └── User.js            # Mongoose user model
├── routes/
│   └── auth.js            # Auth routes (register, login, Google auth)
├── utils/
│   └── generateToken.js   # JWT generation helper
├── .env                   # Environment variables
├── app.js                 # Main Express app
└── package.json

````

---

## 🚀 Features

- ✅ Local email-password registration/login
- ✅ Google OAuth 2.0 login
- ✅ JSON Web Token (JWT) for secure, stateless auth
- ✅ Middleware to protect private routes
- ✅ React-friendly redirect with token
- ✅ Clean and scalable Passport integration

---

## ⚙️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Chetan1930/DevConnect-backend.git
   cd auth-backend
````

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure Environment Variables**

   Create a `.env` file in the root:

   ```env
   MONGO_URI=your_mongo_db_connection_string
   JWT_SECRET=your_jwt_secret_key
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

4. **Run the server**

   ```bash
   npm start
   ```

---

## 📌 API Endpoints

### 🔐 Auth Routes

| Method | Endpoint                    | Description                    |
| ------ | --------------------------- | ------------------------------ |
| POST   | `/api/auth/register`        | Register new user              |
| POST   | `/api/auth/login`           | Login using email/password     |
| GET    | `/api/auth/google`          | Redirect to Google login       |
| GET    | `/api/auth/google/callback` | Google login callback          |
| GET    | `/api/auth/protected`       | Protected route (JWT required) |

---

## 🔒 JWT Auth Middleware Example

To protect any route:

```js
const protectRoute = require('./middleware/auth');

app.get('/api/dashboard', protectRoute, (req, res) => {
  res.json({ message: `Hello ${req.user.email}` });
});
```

---

## 📦 Tech Stack

* **Backend**: Node.js, Express.js
* **Auth**: Passport.js (Local + Google), JWT
* **Database**: MongoDB with Mongoose
* **Hashing**: bcryptjs

---

## 🔗 Integration with React Frontend

1. Login or register from React.
2. Store the returned JWT in `localStorage`.
3. For Google Login:

   * Redirect user to `/api/auth/google`
   * On redirect, handle `/google/callback?token=...` in React

```js
useEffect(() => {
  const token = new URLSearchParams(window.location.search).get("token");
  if (token) {
    localStorage.setItem("token", token);
    navigate("/dashboard");
  }
}, []);
```

---

## ✨ Author

Made with ❤️ by [Chetan Chauhan](https://www.linkedin.com/in/chetan-c2002)

---

## 📃 License

This project is licensed under the [MIT License](LICENSE).

