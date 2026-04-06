const jwt = require("jsonwebtoken");

let users = [];

const setUsers = (usersArray) => {
  users = usersArray;
};

const login = (req, res) => {
  const { email, password } = req.body;
  
  // Simple login for demo (in real app, check password properly)
  const user = users.find(u => u.email === email);
  
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials"
    });
  }
  
  // Generate demo token
  const token = "demo-token";
  
  res.json({
    success: true,
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      },
      token
    }
  });
};

module.exports = { login, setUsers };