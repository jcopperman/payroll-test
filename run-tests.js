const { execSync } = require('child_process');

function run(cmd, label) {
  console.log(`\n=== Running: ${label} ===`);
  try {
    execSync(cmd, { stdio: 'inherit' });
    console.log(`\n✅ ${label} passed.`);
  } catch (err) {
    console.error(`\n❌ ${label} failed.`);
    process.exitCode = 1;
  }
}

const args = process.argv.slice(2);
const allTypes = ['unit', 'contract', 'perf', 'e2e'];
const selected = args.length ? args : allTypes;

if (selected.includes('unit')) {
  run('npx jest unit-tests', 'Unit (Jest)');
}
if (selected.includes('contract')) {
  run('npx jest pact-tests/consumer.test.js', 'Contract: Consumer (Pact)');
  run('npx jest pact-tests/provider.test.js', 'Contract: Provider (Pact)');
}
if (selected.includes('perf')) {
  run('npm run test:performance:quick', 'Performance: Quick (Artillery)');
}
if (selected.includes('e2e')) {
  run('cd frontend && npm run test:e2e', 'E2E: Playwright');
}

console.log('\n=== Selected tests complete ===');
if (process.exitCode === 1) {
  console.log('Some tests failed. See above for details.');
} else {
  console.log('All selected tests passed!');
}
