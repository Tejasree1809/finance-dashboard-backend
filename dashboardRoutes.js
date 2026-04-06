const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { restrictTo } = require("../middleware/roleCheck");

let records = [];

const setRecords = (recordsArray) => {
  records = recordsArray;
};

// Dashboard requires Analyst or Admin role
router.get("/dashboard", protect, restrictTo("Admin", "Analyst"), (req, res) => {
  // Get user's records
  const userRecords = records.filter(r => r.userId === req.user.id);
  
  // Calculate totals
  const totalIncome = userRecords
    .filter(r => r.type === "income")
    .reduce((sum, r) => sum + r.amount, 0);
  
  const totalExpense = userRecords
    .filter(r => r.type === "expense")
    .reduce((sum, r) => sum + r.amount, 0);
  
  // Category-wise totals
  const categoryTotals = {};
  userRecords.forEach(record => {
    if (!categoryTotals[record.category]) {
      categoryTotals[record.category] = { income: 0, expense: 0 };
    }
    
    if (record.type === "income") {
      categoryTotals[record.category].income += record.amount;
    } else {
      categoryTotals[record.category].expense += record.amount;
    }
  });
  
  // Recent transactions (last 5)
  const recentTransactions = [...userRecords]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);
  
  res.json({
    success: true,
    data: {
      summary: {
        totalIncome,
        totalExpense,
        netBalance: totalIncome - totalExpense,
        totalTransactions: userRecords.length
      },
      categoryTotals,
      recentTransactions
    }
  });
});

module.exports = { router, setRecords };