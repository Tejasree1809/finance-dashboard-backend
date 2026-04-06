const validateRecord = (req, res, next) => {
  const { amount, type, category, date } = req.body;
  const errors = [];
  
  if (!amount || amount <= 0) {
    errors.push("Amount must be greater than 0");
  }
  
  if (!type || !["income", "expense"].includes(type)) {
    errors.push("Type must be 'income' or 'expense'");
  }
  
  if (!category) {
    errors.push("Category is required");
  }
  
  if (!date) {
    errors.push("Date is required");
  }
  
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      errors
    });
  }
  
  next();
};

const validateUser = (req, res, next) => {
  const { name, role, status } = req.body;
  const errors = [];
  
  if (role && !["Admin", "Analyst", "Viewer"].includes(role)) {
    errors.push("Role must be Admin, Analyst, or Viewer");
  }
  
  if (status && !["Active", "Inactive"].includes(status)) {
    errors.push("Status must be Active or Inactive");
  }
  
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      errors
    });
  }
  
  next();
};

module.exports = { validateRecord, validateUser };