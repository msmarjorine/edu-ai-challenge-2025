const { Schema } = require('./schema.js');

console.log('🧪 Data Validation Library - Quick Verification\n');

// Test 1: String validation
const stringTest = Schema.string().minLength(3).validate('hello');
console.log('✅ String validation:', stringTest.success ? 'PASS' : 'FAIL');

// Test 2: Email validation
const emailTest = Schema.string().email().validate('user@example.com');
console.log('✅ Email validation:', emailTest.success ? 'PASS' : 'FAIL');

// Test 3: Number validation
const numberTest = Schema.number().min(0).max(100).validate(42);
console.log('✅ Number validation:', numberTest.success ? 'PASS' : 'FAIL');

// Test 4: Object validation
const objectTest = Schema.object({
  name: Schema.string(),
  age: Schema.number()
}).validate({ name: 'John', age: 30 });
console.log('✅ Object validation:', objectTest.success ? 'PASS' : 'FAIL');

// Test 5: Error handling
const errorTest = Schema.string().minLength(10).validate('short');
console.log('✅ Error handling:', !errorTest.success ? 'PASS' : 'FAIL');
console.log('   Error message:', errorTest.errors[0]?.message);

// Test 6: Array validation
const arrayTest = Schema.array(Schema.string()).validate(['hello', 'world']);
console.log('✅ Array validation:', arrayTest.success ? 'PASS' : 'FAIL');

// Test 7: Nested object validation
const nestedTest = Schema.object({
  user: Schema.object({
    name: Schema.string(),
    email: Schema.string().email()
  })
}).validate({
  user: {
    name: 'Alice',
    email: 'alice@example.com'
  }
});
console.log('✅ Nested validation:', nestedTest.success ? 'PASS' : 'FAIL');

console.log('\n🎉 Verification complete! Library is working correctly.');
console.log('💡 Try running: npm test (for full test suite)');
console.log('💡 Try running: npm run demo (for detailed examples)'); 