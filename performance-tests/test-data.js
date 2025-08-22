// Generate random employee names without external dependencies
function generateEmployeeName() {
  const firstNames = ['John', 'Jane', 'Mike', 'Sarah', 'David', 'Lisa', 'Tom', 'Emma', 'Chris', 'Anna'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
  
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  
  return `${firstName} ${lastName}`;
}

// Generate random employee ID (simulating existing employees for read operations)
function generateRandomEmployeeId() {
  return `emp_${Math.random().toString(36).substr(2, 9)}`;
}

// Generate random string for testing
function generateRandomString() {
  return Math.random().toString(36).substr(2, 8);
}

// Export functions for use in Artillery
module.exports = {
  generateEmployeeName,
  generateRandomEmployeeId,
  generateRandomString
};

// Artillery will use these functions automatically
// You can also use faker.js functions directly in your test files
