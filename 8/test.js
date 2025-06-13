/**
 * Comprehensive Test Suite for Data Validation Library
 */

const {
  Schema,
  Validator,
  StringValidator,
  NumberValidator,
  BooleanValidator,
  DateValidator,
  ArrayValidator,
  ObjectValidator
} = require('./schema.js');

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

  assertEqual(actual, expected, message) {
    if (actual !== expected) {
      throw new Error(message || `Expected ${expected}, got ${actual}`);
    }
  }

  run() {
    console.log('Running tests...\n');
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
    return this.results;
  }
}

const test = new TestRunner();

// String Validator Tests
test.test('StringValidator - valid string', () => {
  const validator = Schema.string();
  const result = validator.validate('hello');
  test.assert(result.success);
  test.assertEqual(result.value, 'hello');
});

test.test('StringValidator - invalid type', () => {
  const validator = Schema.string();
  const result = validator.validate(123);
  test.assert(!result.success);
  test.assert(result.errors.length > 0);
});

test.test('StringValidator - minLength', () => {
  const validator = Schema.string().minLength(5);
  test.assert(!validator.validate('hi').success);
  test.assert(validator.validate('hello').success);
});

test.test('StringValidator - email validation', () => {
  const validator = Schema.string().email();
  test.assert(!validator.validate('invalid').success);
  test.assert(validator.validate('test@example.com').success);
});

// Number Validator Tests
test.test('NumberValidator - valid number', () => {
  const validator = Schema.number();
  const result = validator.validate(42);
  test.assert(result.success);
  test.assertEqual(result.value, 42);
});

test.test('NumberValidator - min/max constraints', () => {
  const validator = Schema.number().min(0).max(100);
  test.assert(!validator.validate(-5).success);
  test.assert(!validator.validate(150).success);
  test.assert(validator.validate(50).success);
});

test.test('NumberValidator - integer constraint', () => {
  const validator = Schema.number().integer();
  test.assert(!validator.validate(3.14).success);
  test.assert(validator.validate(42).success);
});

// Boolean Validator Tests
test.test('BooleanValidator - valid boolean', () => {
  const validator = Schema.boolean();
  test.assert(validator.validate(true).success);
  test.assert(validator.validate(false).success);
  test.assert(!validator.validate('true').success);
});

// Array Validator Tests
test.test('ArrayValidator - valid array', () => {
  const validator = Schema.array(Schema.string());
  const result = validator.validate(['hello', 'world']);
  test.assert(result.success);
});

test.test('ArrayValidator - invalid items', () => {
  const validator = Schema.array(Schema.string());
  const result = validator.validate(['hello', 123]);
  test.assert(!result.success);
});

// Object Validator Tests
test.test('ObjectValidator - valid object', () => {
  const validator = Schema.object({
    name: Schema.string(),
    age: Schema.number()
  });
  const result = validator.validate({ name: 'John', age: 30 });
  test.assert(result.success);
});

test.test('ObjectValidator - optional properties', () => {
  const validator = Schema.object({
    name: Schema.string(),
    age: Schema.number().optional()
  });
  const result = validator.validate({ name: 'John' });
  test.assert(result.success);
});

// Integration Tests
test.test('Complex schema validation', () => {
  const schema = Schema.object({
    user: Schema.object({
      name: Schema.string().minLength(2),
      email: Schema.string().email(),
      tags: Schema.array(Schema.string()).minLength(1)
    }),
    metadata: Schema.object({
      created: Schema.date()
    }).optional()
  });

  const data = {
    user: {
      name: 'John Doe',
      email: 'john@example.com',
      tags: ['developer']
    }
  };

  const result = schema.validate(data);
  test.assert(result.success);
});

// Run tests and export results
const results = test.run();
module.exports = { TestRunner, results }; 