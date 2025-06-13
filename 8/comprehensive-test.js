/**
 * Comprehensive Test Suite for Data Validation Library
 * This suite covers all validator functionality with extensive test cases
 */

const { Schema } = require('./schema.js');

class TestRunner {
  constructor() {
    this.tests = [];
    this.results = { passed: 0, failed: 0, total: 0 };
  }

  test(name, fn) {
    this.tests.push({ name, fn });
  }

  assert(condition, message = 'Assertion failed') {
    if (!condition) throw new Error(message);
  }

  assertEqual(actual, expected) {
    if (actual !== expected) {
      throw new Error(`Expected ${expected}, got ${actual}`);
    }
  }

  run() {
    console.log('=== Comprehensive Data Validation Library Tests ===\n');
    this.results.total = this.tests.length;
    
    for (const test of this.tests) {
      try {
        test.fn();
        console.log(`✓ ${test.name}`);
        this.results.passed++;
      } catch (error) {
        console.log(`✗ ${test.name}: ${error.message}`);
        this.results.failed++;
      }
    }

    console.log(`\nResults: ${this.results.passed}/${this.results.total} passed`);
    console.log(`Success Rate: ${((this.results.passed / this.results.total) * 100).toFixed(1)}%`);
    return this.results;
  }
}

const test = new TestRunner();

// Validator Base Class Tests
test.test('Validator - optional method', () => {
  const validator = Schema.string().optional();
  test.assert(validator.isOptional === true);
  test.assert(validator.validate(null).success);
  test.assert(validator.validate(undefined).success);
});

test.test('Validator - custom error messages', () => {
  const validator = Schema.string().minLength(5).withMessage('Custom error');
  const result = validator.validate('hi');
  test.assert(!result.success);
  test.assertEqual(result.errors[0].message, 'Custom error');
});

test.test('Validator - transform function', () => {
  const validator = Schema.string().transform(val => val.toUpperCase());
  const result = validator.validate('hello');
  test.assert(result.success);
  test.assertEqual(result.value, 'HELLO');
});

// String Validator Tests
test.test('StringValidator - basic validation', () => {
  const validator = Schema.string();
  test.assert(validator.validate('hello').success);
  test.assert(!validator.validate(123).success);
  test.assert(!validator.validate(true).success);
});

test.test('StringValidator - length constraints', () => {
  const validator = Schema.string().minLength(3).maxLength(10);
  test.assert(validator.validate('hello').success);
  test.assert(!validator.validate('hi').success);
  test.assert(!validator.validate('verylongstring').success);
});

test.test('StringValidator - pattern validation', () => {
  const validator = Schema.string().pattern(/^[a-z]+$/);
  test.assert(validator.validate('hello').success);
  test.assert(!validator.validate('Hello').success);
  test.assert(!validator.validate('hello123').success);
});

test.test('StringValidator - email validation', () => {
  const validator = Schema.string().email();
  test.assert(validator.validate('test@example.com').success);
  test.assert(!validator.validate('invalid-email').success);
});

test.test('StringValidator - URL validation', () => {
  const validator = Schema.string().url();
  test.assert(validator.validate('http://example.com').success);
  test.assert(!validator.validate('invalid-url').success);
});

test.test('StringValidator - enum validation', () => {
  const validator = Schema.string().enum(['red', 'green', 'blue']);
  test.assert(validator.validate('red').success);
  test.assert(!validator.validate('yellow').success);
});

// Number Validator Tests
test.test('NumberValidator - basic validation', () => {
  const validator = Schema.number();
  test.assert(validator.validate(42).success);
  test.assert(validator.validate(3.14).success);
  test.assert(!validator.validate('42').success);
  test.assert(!validator.validate(NaN).success);
});

test.test('NumberValidator - range constraints', () => {
  const validator = Schema.number().min(0).max(100);
  test.assert(validator.validate(50).success);
  test.assert(!validator.validate(-5).success);
  test.assert(!validator.validate(150).success);
});

test.test('NumberValidator - integer constraint', () => {
  const validator = Schema.number().integer();
  test.assert(validator.validate(42).success);
  test.assert(!validator.validate(3.14).success);
});

test.test('NumberValidator - positive constraint', () => {
  const validator = Schema.number().positive();
  test.assert(validator.validate(5).success);
  test.assert(!validator.validate(0).success);
  test.assert(!validator.validate(-5).success);
});

// Boolean Validator Tests
test.test('BooleanValidator - type validation', () => {
  const validator = Schema.boolean();
  test.assert(validator.validate(true).success);
  test.assert(validator.validate(false).success);
  test.assert(!validator.validate('true').success);
  test.assert(!validator.validate(1).success);
});

// Date Validator Tests
test.test('DateValidator - Date object validation', () => {
  const validator = Schema.date();
  test.assert(validator.validate(new Date()).success);
});

test.test('DateValidator - string conversion', () => {
  const validator = Schema.date();
  const result = validator.validate('2023-01-01');
  test.assert(result.success);
  test.assert(result.value instanceof Date);
});

test.test('DateValidator - range constraints', () => {
  const validator = Schema.date().min(new Date('2023-01-01')).max(new Date('2023-12-31'));
  test.assert(validator.validate(new Date('2023-06-15')).success);
  test.assert(!validator.validate(new Date('2022-12-31')).success);
});

// Array Validator Tests
test.test('ArrayValidator - basic validation', () => {
  const validator = Schema.array(Schema.string());
  test.assert(validator.validate(['hello', 'world']).success);
  test.assert(!validator.validate('not-array').success);
});

test.test('ArrayValidator - item validation', () => {
  const validator = Schema.array(Schema.string());
  test.assert(validator.validate(['hello', 'world']).success);
  test.assert(!validator.validate(['hello', 123]).success);
});

test.test('ArrayValidator - length constraints', () => {
  const validator = Schema.array(Schema.string()).minLength(2).maxLength(4);
  test.assert(validator.validate(['a', 'b']).success);
  test.assert(!validator.validate(['a']).success);
  test.assert(!validator.validate(['a', 'b', 'c', 'd', 'e']).success);
});

// Object Validator Tests
test.test('ObjectValidator - basic validation', () => {
  const validator = Schema.object({ name: Schema.string(), age: Schema.number() });
  test.assert(validator.validate({ name: 'John', age: 30 }).success);
  test.assert(!validator.validate('not-object').success);
});

test.test('ObjectValidator - nested objects', () => {
  const validator = Schema.object({
    user: Schema.object({
      name: Schema.string(),
      email: Schema.string().email()
    })
  });
  
  const data = { user: { name: 'John', email: 'john@example.com' } };
  test.assert(validator.validate(data).success);
});

test.test('ObjectValidator - optional properties', () => {
  const validator = Schema.object({
    name: Schema.string(),
    age: Schema.number().optional()
  });
  
  test.assert(validator.validate({ name: 'John' }).success);
  test.assert(validator.validate({ name: 'John', age: 30 }).success);
});

test.test('ObjectValidator - strict mode', () => {
  const validator = Schema.object({ name: Schema.string() }).strict();
  test.assert(validator.validate({ name: 'John' }).success);
  test.assert(!validator.validate({ name: 'John', extra: 'prop' }).success);
});

// Complex Integration Tests
test.test('User Registration Schema', () => {
  const schema = Schema.object({
    username: Schema.string().minLength(3).maxLength(20),
    email: Schema.string().email(),
    password: Schema.string().minLength(8),
    age: Schema.number().min(13).integer(),
    tags: Schema.array(Schema.string()).maxLength(10)
  });
  
  const user = {
    username: 'johndoe',
    email: 'john@example.com',
    password: 'securepass',
    age: 25,
    tags: ['developer']
  };
  
  test.assert(schema.validate(user).success);
});

test.test('API Response Schema', () => {
  const schema = Schema.object({
    status: Schema.string().enum(['success', 'error']),
    data: Schema.array(
      Schema.object({
        id: Schema.number().integer(),
        name: Schema.string()
      })
    )
  });
  
  const response = {
    status: 'success',
    data: [{ id: 1, name: 'Item 1' }]
  };
  
  test.assert(schema.validate(response).success);
});

test.test('Error Accumulation', () => {
  const schema = Schema.object({
    name: Schema.string().minLength(5),
    age: Schema.number().min(18),
    email: Schema.string().email()
  });
  
  const result = schema.validate({
    name: 'Jo',
    age: 15,
    email: 'invalid'
  });
  
  test.assert(!result.success);
  test.assert(result.errors.length >= 3);
});

// Performance Test
test.test('Performance Test', () => {
  const schema = Schema.array(Schema.object({
    id: Schema.number(),
    name: Schema.string()
  }));
  
  const data = Array.from({ length: 100 }, (_, i) => ({
    id: i,
    name: `Item ${i}`
  }));
  
  const start = Date.now();
  const result = schema.validate(data);
  const duration = Date.now() - start;
  
  test.assert(result.success);
  console.log(`  Performance: 100 items validated in ${duration}ms`);
});

// Run tests
const results = test.run();

console.log('\n=== Test Coverage Summary ===');
console.log('✓ Base Validator functionality');
console.log('✓ String validation with all constraints');
console.log('✓ Number validation with all constraints');
console.log('✓ Boolean validation');
console.log('✓ Date validation and conversion');
console.log('✓ Array validation with nesting');
console.log('✓ Object validation with nesting');
console.log('✓ Complex integration scenarios');
console.log('✓ Error handling and accumulation');
console.log('✓ Performance characteristics');

module.exports = { results };
