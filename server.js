require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sequelize = require("./config/db");
const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/user", require("./routes/userAuthRoutes"));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

sequelize
  .sync({ alter: true }) // Updates tables without dropping data
  .then(() => console.log("✅ Database & tables synced successfully!"))
  .catch((err) => console.error("❌ Error syncing database:", err));