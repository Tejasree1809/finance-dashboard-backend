require("dotenv").config();

const express = require("express");
const { router: userRoutes, users } = require("./routes/userRoutes");
const { router: recordRoutes, records } = require("./routes/recordRoutes");
const { router: dashboardRoutes, setRecords } = require("./routes/dashboardRoutes");
const { login, setUsers } = require("./controllers/authController");
const { setUsers: setAuthUsers } = require("./middleware/auth");

const app = express();

// Connect data between modules
setAuthUsers(users);
setUsers(users);
setRecords(records);

app.use(express.json());

// Login route (no authentication needed)
app.post("/api/login", login);

// Your routes
app.use("/api", userRoutes);
app.use("/api", recordRoutes);
app.use("/api", dashboardRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Server running",
    timestamp: new Date().toISOString()
  });
});

// Test route without auth
app.get("/", (req, res) => {
  res.json({
    message: "Finance API is running",
    endpoints: {
      login: "POST /api/login",
      users: "GET /api/users (requires token and admin)",
      records: "GET/POST /api/records (requires token)",
      dashboard: "GET /api/dashboard (requires analyst+)"
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
  console.log("\nTest with these commands:");
  console.log("1. Get token: POST http://localhost:5000/api/login");
  console.log("2. Use token: Add header 'Authorization: Bearer demo-token'");
});