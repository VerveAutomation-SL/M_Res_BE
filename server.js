require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const sequelize = require("./config/db");
const authenticateToken = require("./middleware/authMiddleware");
const vartfyPermission = require("./middleware/verifyPermission");

const app = express();

const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));


// Routes
app.use("/auth", require("./routes/userAuthRoutes"));
app.use("/token", require("./routes/tokenRoutes"));

// protected routes
app.use('/checkins', require('./routes/checkInRoutes'));
app.use("/resorts", require("./routes/resortRoutes"));
app.use("/rooms", require("./routes/roomRoutes"));
app.use("/restaurants", require("./routes/restaurantRoutes"));
app.use("/tables", require("./routes/tableRoutes"));
app.use('/analytics', require('./routes/analyticsRoutes'));
app.use('/reports', require('./routes/reportRoutes'));
app.use("/users", require("./routes/userRoutes"));

app.use("/", (req, res ) => {
  res.status(200).json({
    message: "Welcome to the Hotel Management System API",
    status: "success"
  }); 
});

// 404 fallback route for everything else
app.use((req, res) => {
  res.status(404).json({ message: "Route not found", status: "fail" });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

sequelize
  .sync({ alter: true }) // Updates tables without dropping data
  .then(() => console.log("✅ Database & tables synced successfully!"))
  .catch((err) => console.error("❌ Error syncing database:", err));