const jwt = require("jsonwebtoken");

// Use your existing users array (we'll connect it)
let users = []; // Will be populated from your routes

const setUsers = (usersArray) => {
  users = usersArray;
};

const protect = (req, res, next) => {
  try {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized"
      });
    }
    
    // For demo, accept demo-token
    if (token === "demo-token") {
      req.user = users[0] || { id: 1, name: "Tejasree", role: "Admin" };
      return next();
    }
    
    res.status(401).json({
      success: false,
      message: "Invalid token"
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Not authorized"
    });
  }
};

module.exports = { protect, setUsers };