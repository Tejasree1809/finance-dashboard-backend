const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { restrictTo } = require("../middleware/roleCheck");
const { validateRecord } = require("../utils/validation");

// Your existing records array
let records = [
  {
    id: 1,
    amount: 5000,
    type: "income",
    category: "Salary",
    date: "2026-04-02",
    note: "Monthly salary",
    userId: 1
  }
];

// GET all records - Now requires authentication
router.get("/records", protect, (req, res) => {
  // Filter records for logged in user
  const userRecords = records.filter(r => r.userId === req.user.id);
  
  // Apply filters
  let filteredRecords = [...userRecords];
  
  if (req.query.type) {
    filteredRecords = filteredRecords.filter(r => r.type === req.query.type);
  }
  
  if (req.query.category) {
    filteredRecords = filteredRecords.filter(r => r.category === req.query.category);
  }
  
  if (req.query.startDate) {
    filteredRecords = filteredRecords.filter(r => r.date >= req.query.startDate);
  }
  
  if (req.query.endDate) {
    filteredRecords = filteredRecords.filter(r => r.date <= req.query.endDate);
  }
  
  res.json({
    success: true,
    data: filteredRecords
  });
});

// GET single record
router.get("/records/:id", protect, (req, res) => {
  const record = records.find(r => r.id === parseInt(req.params.id) && r.userId === req.user.id);
  
  if (!record) {
    return res.status(404).json({
      success: false,
      message: "Record not found"
    });
  }
  
  res.json({
    success: true,
    data: record
  });
});

// POST create record - Now requires Analyst or Admin role
router.post("/records", protect, restrictTo("Admin", "Analyst"), validateRecord, (req, res) => {
  const newRecord = {
    id: records.length + 1,
    ...req.body,
    userId: req.user.id
  };
  records.push(newRecord);
  res.json({
    success: true,
    message: "Record added successfully",
    data: newRecord
  });
});

// PUT update record
router.put("/records/:id", protect, restrictTo("Admin", "Analyst"), (req, res) => {
  const recordIndex = records.findIndex(r => r.id === parseInt(req.params.id) && r.userId === req.user.id);
  
  if (recordIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Record not found"
    });
  }
  
  records[recordIndex] = {
    ...records[recordIndex],
    ...req.body,
    id: records[recordIndex].id
  };
  
  res.json({
    success: true,
    data: records[recordIndex]
  });
});

// DELETE record
router.delete("/records/:id", protect, restrictTo("Admin", "Analyst"), (req, res) => {
  const recordIndex = records.findIndex(r => r.id === parseInt(req.params.id) && r.userId === req.user.id);
  
  if (recordIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Record not found"
    });
  }
  
  records.splice(recordIndex, 1);
  
  res.json({
    success: true,
    message: "Record deleted successfully"
  });
});

module.exports = { router, records };