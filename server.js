require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sequelize = require("./config/db");
const cookieParser = require("cookie-parser");

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
app.use("/resorts", require("./routes/resortRoutes"));
app.use("/rooms", require("./routes/roomRouter"));
app.use('/checkins', require('./routes/checkInRoutes'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

sequelize
  .sync({ alter: true }) // Updates tables without dropping data
  .then(() => console.log("✅ Database & tables synced successfully!"))
  .catch((err) => console.error("❌ Error syncing database:", err));