require("dotenv").config();
const express = require("express");
const cors = require("cors");

const path = require("path");

const connectDB = require("./src/config/db");
const authRoutes = require("./src/routes/authRoutes");
const postRoutes = require("./src/routes/postRoutes");
const commentRoutes = require("./src/routes/commentRoutes");
const userRoutes = require("./src/routes/userRoutes");

const app = express();
connectDB();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());

// Body Parser ayarları
app.use(express.urlencoded({ extended: true })); // Form verilerini okumak için ekledik

// --- STATİK KLASÖR TANIMLAMASI ---
// 'uploads' klasöründeki dosyalara http://localhost:5000/uploads/... şeklinde erişmeni sağlar
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comment", commentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/comments", commentRoutes);

app.get("/", (req, res) => {
  res.send("API ÇALIŞIYOR 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
