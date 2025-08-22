# Performance Testing Suite

This directory contains comprehensive performance tests for the Payroll API using Artillery.

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start your API:**
   ```bash
   npm start
   ```

3. **Run a quick performance test:**
   ```bash
   npm run test:performance:quick
   ```

## 📊 Test Types

### 1. Quick Test (`quick-test.yml`)
- **Duration:** 30 seconds
- **Load:** 5 requests/second
- **Purpose:** Rapid feedback during development
- **Use case:** Quick validation of API changes

### 2. Load Test (`load-test.yml`)
- **Duration:** 7 minutes total
- **Phases:** Warm up → Sustained load → Cool down
- **Load:** 10-20 requests/second
- **Purpose:** Test normal expected load
- **Use case:** Performance validation before deployment

### 3. Stress Test (`stress-test.yml`)
- **Duration:** 9 minutes total
- **Phases:** Warm up → Ramp up → Stress → Peak stress → Recovery
- **Load:** 10-70 requests/second
- **Purpose:** Find the breaking point
- **Use case:** Capacity planning and stress testing

### 4. Spike Test (`spike-test.yml`)
- **Duration:** 2.5 minutes total
- **Phases:** Baseline → Spike → Recovery
- **Load:** 5 → 100 → 5 requests/second
- **Purpose:** Test sudden traffic spikes
- **Use case:** Validate autoscaling and recovery

### 5. Monitoring (`monitoring.yml`)
- **Duration:** 1 hour (continuous)
- **Load:** 2 requests/second
- **Purpose:** Continuous performance monitoring
- **Use case:** Production monitoring and alerting

## 🎯 Test Scenarios

Each test includes realistic scenarios:

- **Employee Management Flow:** Create employee → Clock in → Clock out → View timesheets → Calculate payroll
- **Timesheet Operations:** Clock in/out operations
- **Read Operations:** List employees, view timesheets, calculate payroll
- **Mixed Operations:** Combination of read/write operations

## 📈 Running Tests

### Individual Tests
```bash
# Quick test (30 seconds)
npm run test:performance:quick

# Load test (7 minutes)
npm run test:performance:stress

# Stress test (9 minutes)
npm run test:performance:stress

# Spike test (2.5 minutes)
npm run test:performance:spike

# Continuous monitoring (1 hour)
npm run test:performance:monitor
```

### Run All Tests
```bash
# Run all tests sequentially
npm run test:performance:all

# Or use the runner script directly
node performance-tests/run-tests.js
```

### Run Specific Test
```bash
# Run a specific test by name
node performance-tests/run-tests.js "Load Test"
```

## 📊 Understanding Results

### Key Metrics
- **Response Time:** Average, median, 95th percentile
- **Throughput:** Requests per second
- **Error Rate:** Percentage of failed requests
- **Latency Distribution:** Response time percentiles

### Success Criteria
- **Error Rate:** < 5%
- **Mean Response Time:** < 1000ms
- **95th Percentile:** < 2000ms

### Output Files
Results are saved in the `results/` directory:
- `performance-results.json` - Combined results
- Individual test result files
- Console output with real-time metrics

## ⚙️ Configuration

### Artillery Configuration (`artillery-config.yml`)
- Global settings for all tests
- HTTP timeout and connection pooling
- Output formatting and metrics collection
- Error rate and response time thresholds

### Test Data (`test-data.js`)
- Random employee name generation
- Employee ID generation for testing
- Custom functions for test data

## 🔧 Customization

### Modify Test Parameters
Edit the YAML files to adjust:
- **Duration:** Test length in seconds
- **Arrival Rate:** Requests per second
- **Think Time:** Delays between requests
- **Scenarios:** Test flow and weights

### Add New Scenarios
1. Create new scenario in YAML file
2. Define request flow
3. Set appropriate weights
4. Add to test runner if needed

### Environment Variables
```bash
# Override default settings
export API_URL=http://localhost:3000
export TEST_DURATION=300
export LOAD_LEVEL=50
```

## 📋 Best Practices

1. **Start Small:** Begin with quick tests before running stress tests
2. **Monitor Resources:** Watch CPU, memory, and network usage
3. **Baseline First:** Establish performance baselines before optimization
4. **Gradual Increase:** Ramp up load gradually to identify bottlenecks
5. **Recovery Testing:** Always include recovery phases in stress tests
6. **Realistic Data:** Use realistic test data that matches production

## 🚨 Troubleshooting

### Common Issues
- **Port conflicts:** Ensure API is running on port 3000
- **Memory issues:** Reduce load or increase system resources
- **Network timeouts:** Adjust timeout values in configuration
- **Permission errors:** Check file permissions for results directory

### Debug Mode
```bash
# Run with verbose output
artillery run --debug performance-tests/quick-test.yml
```

## 📚 Additional Resources

- [Artillery Documentation](https://www.artillery.io/docs)
- [Performance Testing Best Practices](https://www.artillery.io/docs/guides/best-practices)
- [Load Testing Patterns](https://www.artillery.io/docs/guides/test-scripting)

## 🤝 Contributing

To add new test scenarios or improve existing ones:
1. Create test configuration in YAML
2. Update test runner if needed
3. Add appropriate documentation
4. Test with different load levels
