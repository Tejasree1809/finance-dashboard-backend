const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { restrictTo } = require("../middleware/roleCheck");
const { validateUser } = require("../utils/validation");

// Your existing users array
let users = [
  {
    id: 1,
    name: "Tejasree",
    email: "tejasree@example.com",
    role: "Admin",
    status: "Active"
  }
];

// GET all users - Now requires authentication
router.get("/users", protect, restrictTo("Admin"), (req, res) => {
  res.json({
    success: true,
    data: users
  });
});

// POST create user - Now requires authentication
router.post("/users", protect, restrictTo("Admin"), validateUser, (req, res) => {
  const newUser = {
    id: users.length + 1,
    ...req.body,
    status: req.body.status || "Active"
  };
  users.push(newUser);
  res.json({
    success: true,
    message: "User added successfully",
    data: newUser
  });
});

// Export users array for auth middleware
module.exports = { router, users };