const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Test configurations
const tests = [
  { name: 'Quick Test', file: 'quick-test.yml', description: 'Rapid feedback test' },
  { name: 'Load Test', file: 'load-test.yml', description: 'Normal expected load' },
  { name: 'Stress Test', file: 'stress-test.yml', description: 'Find breaking point' },
  { name: 'Spike Test', file: 'spike-test.yml', description: 'Sudden traffic spikes' }
];

// Create results directory if it doesn't exist
const resultsDir = path.join(__dirname, 'results');
if (!fs.existsSync(resultsDir)) {
  fs.mkdirSync(resultsDir);
}

console.log('🚀 Payroll API Performance Testing Suite\n');

// Function to run a single test
function runTest(test) {
  console.log(`\n📊 Running: ${test.name}`);
  console.log(`📝 Description: ${test.description}`);
  console.log('─'.repeat(50));
  
  try {
    const startTime = Date.now();
    const result = execSync(`artillery run ${test.file}`, { 
      cwd: __dirname, 
      encoding: 'utf8',
      stdio: 'pipe'
    });
    const duration = Date.now() - startTime;
    
    console.log(`✅ ${test.name} completed in ${duration}ms`);
    
    // Save individual test results
    const resultFile = path.join(resultsDir, `${test.name.toLowerCase().replace(/\s+/g, '-')}-results.txt`);
    fs.writeFileSync(resultFile, result);
    
    return { success: true, duration, result };
  } catch (error) {
    console.log(`❌ ${test.name} failed: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Function to run all tests
async function runAllTests() {
  const results = [];
  
  for (const test of tests) {
    const result = runTest(test);
    results.push({ ...test, ...result });
    
    // Wait a bit between tests to let the system recover
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  // Summary
  console.log('\n📈 Performance Test Summary');
  console.log('─'.repeat(50));
  
  results.forEach(result => {
    const status = result.success ? '✅ PASS' : '❌ FAIL';
    const duration = result.success ? `(${result.duration}ms)` : '';
    console.log(`${status} ${result.name} ${duration}`);
  });
  
  const passed = results.filter(r => r.success).length;
  const total = results.length;
  
  console.log(`\n🎯 Results: ${passed}/${total} tests passed`);
  
  if (passed === total) {
    console.log('🎉 All performance tests completed successfully!');
  } else {
    console.log('⚠️  Some tests failed. Check the results above for details.');
  }
}

// Function to run a specific test
function runSpecificTest(testName) {
  const test = tests.find(t => t.name.toLowerCase().includes(testName.toLowerCase()));
  if (test) {
    runTest(test);
  } else {
    console.log(`❌ Test "${testName}" not found. Available tests:`);
    tests.forEach(t => console.log(`  - ${t.name}`));
  }
}

// Main execution
const args = process.argv.slice(2);
if (args.length > 0) {
  runSpecificTest(args[0]);
} else {
  runAllTests();
}
