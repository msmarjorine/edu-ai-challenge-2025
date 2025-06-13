/**
 * Comprehensive Test Suite for Data Validation Library
 * 
 * This test suite covers all core functionality of the validation library
 * including primitive validators, complex object validation, error handling,
 * and edge cases. Tests serve as both correctness checks and usage documentation.
 */

// Import the validation library
const {
  Schema,
  StringValidator,
  NumberValidator,
  BooleanValidator,
  DateValidator,
  ArrayValidator,
  ObjectValidator
} = require('./schema.js');

/**
 * Simple test framework for running tests without external dependencies
 */
class TestFramework {
  constructor() {
    this.tests = [];
    this.results = {
      passed: 0,
      failed: 0,
      total: 0
    };
  }

  /**
   * Add a test case
   * @param {string} name - Test name
   * @param {Function} testFn - Test function
   */
  test(name, testFn) {
    this.tests.push({ name, testFn });
  }

  /**
   * Assert that a condition is true
   * @param {boolean} condition - Condition to check
   * @param {string} message - Error message if assertion fails
   */
  assert(condition, message = 'Assertion failed') {
    if (!condition) {
      throw new Error(message);
    }
  }

  /**
   * Assert that two values are equal
   * @param {*} actual - Actual value
   * @param {*} expected - Expected value
   * @param {string} message - Error message if assertion fails
   */
  assertEqual(actual, expected, message = `Expected ${expected}, got ${actual}`) {
    if (actual !== expected) {
      throw new Error(message);
    }
  }

  /**
   * Assert that two values are deeply equal (for objects/arrays)
   * @param {*} actual - Actual value
   * @param {*} expected - Expected value
   * @param {string} message - Error message if assertion fails
   */
  assertDeepEqual(actual, expected, message = 'Deep equality assertion failed') {
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
      throw new Error(`${message}\nExpected: ${JSON.stringify(expected)}\nActual: ${JSON.stringify(actual)}`);
    }
  }

  /**
   * Assert that a function throws an error
   * @param {Function} fn - Function that should throw
   * @param {string} message - Error message if assertion fails
   */
  assertThrows(fn, message = 'Expected function to throw') {
    let threw = false;
    try {
      fn();
    } catch (error) {
      threw = true;
    }
    if (!threw) {
      throw new Error(message);
    }
  }

  /**
   * Run all tests and display results
   */
  run() {
    console.log('=== Running Data Validation Library Tests ===\n');
    
    this.results.total = this.tests.length;
    
    for (const test of this.tests) {
      try {
        test.testFn();
        console.log(`✓ ${test.name}`);
        this.results.passed++;
      } catch (error) {
        console.log(`✗ ${test.name}`);
        console.log(`  Error: ${error.message}`);
        this.results.failed++;
      }
    }

    console.log('\n=== Test Results ===');
    console.log(`Total tests: ${this.results.total}`);
    console.log(`Passed: ${this.results.passed}`);
    console.log(`Failed: ${this.results.failed}`);
    console.log(`Success rate: ${((this.results.passed / this.results.total) * 100).toFixed(1)}%`);

    return this.results;
  }
}

// Create test framework instance
const test = new TestFramework();

// ============================================================================
// BASE VALIDATOR TESTS
// ============================================================================

test.test('Base Validator - optional() method', () => {
  const validator = new StringValidator();
  const result = validator.optional();
  test.assert(result === validator, 'optional() should return validator instance');
  test.assert(validator.isOptional === true, 'isOptional should be true');
});

test.test('Base Validator - withMessage() method', () => {
  const validator = new StringValidator();
  const customMessage = 'Custom error message';
  const result = validator.withMessage(customMessage);
  test.assert(result === validator, 'withMessage() should return validator instance');
  test.assertEqual(validator.customMessage, customMessage);
});

test.test('Base Validator - transform() method', () => {
  const validator = new StringValidator();
  const transformFn = (val) => val.toString();
  const result = validator.transform(transformFn);
  test.assert(result === validator, 'transform() should return validator instance');
  test.assertEqual(validator.transformFn, transformFn);
});

test.test('Base Validator - optional values (null)', () => {
  const validator = new StringValidator().optional();
  const result = validator.validate(null);
  test.assert(result.success, 'Optional validator should accept null');
  test.assertEqual(result.value, null);
  test.assertEqual(result.errors.length, 0);
});

test.test('Base Validator - optional values (undefined)', () => {
  const validator = new StringValidator().optional();
  const result = validator.validate(undefined);
  test.assert(result.success, 'Optional validator should accept undefined');
  test.assertEqual(result.value, undefined);
  test.assertEqual(result.errors.length, 0);
});

test.test('Base Validator - transform with valid transformation', () => {
  const validator = new NumberValidator().transform(val => parseInt(val));
  const result = validator.validate('123');
  test.assert(result.success, 'Transform should work with valid transformation');
  test.assertEqual(result.value, 123);
});

test.test('Base Validator - transform with failing transformation', () => {
  const validator = new StringValidator().transform(val => val.nonExistentMethod());
  const result = validator.validate('test');
  test.assert(!result.success, 'Transform should fail with invalid transformation');
  test.assert(result.errors.length > 0, 'Should have errors');
});

// ============================================================================
// STRING VALIDATOR TESTS
// ============================================================================

test.test('StringValidator - valid string', () => {
  const validator = Schema.string();
  const result = validator.validate('hello');
  test.assert(result.success, 'Valid string should pass validation');
  test.assertEqual(result.value, 'hello');
  test.assertEqual(result.errors.length, 0);
});

test.test('StringValidator - invalid type (number)', () => {
  const validator = Schema.string();
  const result = validator.validate(123);
  test.assert(!result.success, 'Number should fail string validation');
  test.assert(result.errors.length > 0, 'Should have validation errors');
  test.assert(result.errors[0].message.includes('Expected string'), 'Should have type error message');
});

test.test('StringValidator - minLength constraint', () => {
  const validator = Schema.string().minLength(5);
  const shortResult = validator.validate('hi');
  const validResult = validator.validate('hello');
  
  test.assert(!shortResult.success, 'Short string should fail minLength validation');
  test.assert(validResult.success, 'Valid length string should pass');
});

test.test('StringValidator - maxLength constraint', () => {
  const validator = Schema.string().maxLength(5);
  const longResult = validator.validate('hello world');
  const validResult = validator.validate('hello');
  
  test.assert(!longResult.success, 'Long string should fail maxLength validation');
  test.assert(validResult.success, 'Valid length string should pass');
});

test.test('StringValidator - pattern constraint', () => {
  const validator = Schema.string().pattern(/^\d+$/);
  const invalidResult = validator.validate('abc123');
  const validResult = validator.validate('123');
  
  test.assert(!invalidResult.success, 'Non-matching pattern should fail');
  test.assert(validResult.success, 'Matching pattern should pass');
});

test.test('StringValidator - enum constraint', () => {
  const validator = Schema.string().enum(['red', 'green', 'blue']);
  const invalidResult = validator.validate('yellow');
  const validResult = validator.validate('red');
  
  test.assert(!invalidResult.success, 'Invalid enum value should fail');
  test.assert(validResult.success, 'Valid enum value should pass');
});

test.test('StringValidator - email validation', () => {
  const validator = Schema.string().email();
  const invalidResults = [
    validator.validate('invalid-email'),
    validator.validate('user@'),
    validator.validate('@domain.com'),
    validator.validate('user@domain')
  ];
  const validResult = validator.validate('user@domain.com');
  
  invalidResults.forEach(result => {
    test.assert(!result.success, 'Invalid email should fail validation');
  });
  test.assert(validResult.success, 'Valid email should pass validation');
});

test.test('StringValidator - URL validation', () => {
  const validator = Schema.string().url();
  const invalidResults = [
    validator.validate('not-a-url'),
    validator.validate('ftp://example.com'),
    validator.validate('example.com')
  ];
  const validResults = [
    validator.validate('http://example.com'),
    validator.validate('https://example.com/path?query=value')
  ];
  
  invalidResults.forEach(result => {
    test.assert(!result.success, 'Invalid URL should fail validation');
  });
  validResults.forEach(result => {
    test.assert(result.success, 'Valid URL should pass validation');
  });
});

test.test('StringValidator - method chaining', () => {
  const validator = Schema.string().minLength(3).maxLength(10).pattern(/^[a-zA-Z]+$/);
  const validResult = validator.validate('hello');
  const invalidResults = [
    validator.validate('hi'), // too short
    validator.validate('verylongstring'), // too long
    validator.validate('hello123') // invalid pattern
  ];
  
  test.assert(validResult.success, 'Valid chained validation should pass');
  invalidResults.forEach(result => {
    test.assert(!result.success, 'Invalid chained validation should fail');
  });
});

// ============================================================================
// NUMBER VALIDATOR TESTS
// ============================================================================

test.test('NumberValidator - valid number', () => {
  const validator = Schema.number();
  const result = validator.validate(42);
  test.assert(result.success, 'Valid number should pass validation');
  test.assertEqual(result.value, 42);
});

test.test('NumberValidator - invalid type (string)', () => {
  const validator = Schema.number();
  const result = validator.validate('not-a-number');
  test.assert(!result.success, 'String should fail number validation');
  test.assert(result.errors[0].message.includes('Expected number'), 'Should have type error message');
});

test.test('NumberValidator - NaN handling', () => {
  const validator = Schema.number();
  const result = validator.validate(NaN);
  test.assert(!result.success, 'NaN should fail number validation');
});

test.test('NumberValidator - min constraint', () => {
  const validator = Schema.number().min(10);
  const lowResult = validator.validate(5);
  const validResult = validator.validate(15);
  
  test.assert(!lowResult.success, 'Number below minimum should fail');
  test.assert(validResult.success, 'Number above minimum should pass');
});

test.test('NumberValidator - max constraint', () => {
  const validator = Schema.number().max(10);
  const highResult = validator.validate(15);
  const validResult = validator.validate(5);
  
  test.assert(!highResult.success, 'Number above maximum should fail');
  test.assert(validResult.success, 'Number below maximum should pass');
});

test.test('NumberValidator - integer constraint', () => {
  const validator = Schema.number().integer();
  const floatResult = validator.validate(3.14);
  const intResult = validator.validate(42);
  
  test.assert(!floatResult.success, 'Float should fail integer validation');
  test.assert(intResult.success, 'Integer should pass integer validation');
});

test.test('NumberValidator - positive constraint', () => {
  const validator = Schema.number().positive();
  const negativeResult = validator.validate(-5);
  const zeroResult = validator.validate(0);
  const positiveResult = validator.validate(5);
  
  test.assert(!negativeResult.success, 'Negative number should fail positive validation');
  test.assert(!zeroResult.success, 'Zero should fail positive validation');
  test.assert(positiveResult.success, 'Positive number should pass positive validation');
});

test.test('NumberValidator - method chaining', () => {
  const validator = Schema.number().min(0).max(100).integer().positive();
  const validResult = validator.validate(50);
  const invalidResults = [
    validator.validate(-10), // negative
    validator.validate(150), // too high
    validator.validate(50.5) // not integer
  ];
  
  test.assert(validResult.success, 'Valid chained validation should pass');
  invalidResults.forEach(result => {
    test.assert(!result.success, 'Invalid chained validation should fail');
  });
});

// ============================================================================
// BOOLEAN VALIDATOR TESTS
// ============================================================================

test.test('BooleanValidator - valid true', () => {
  const validator = Schema.boolean();
  const result = validator.validate(true);
  test.assert(result.success, 'Boolean true should pass validation');
  test.assertEqual(result.value, true);
});

test.test('BooleanValidator - valid false', () => {
  const validator = Schema.boolean();
  const result = validator.validate(false);
  test.assert(result.success, 'Boolean false should pass validation');
  test.assertEqual(result.value, false);
});

test.test('BooleanValidator - invalid types', () => {
  const validator = Schema.boolean();
  const invalidValues = ['true', 1, 0, null, undefined, {}, []];
  
  invalidValues.forEach(value => {
    const result = validator.validate(value);
    test.assert(!result.success, `Value ${value} should fail boolean validation`);
  });
});

// ============================================================================
// DATE VALIDATOR TESTS
// ============================================================================

test.test('DateValidator - valid Date object', () => {
  const validator = Schema.date();
  const date = new Date('2023-01-01');
  const result = validator.validate(date);
  test.assert(result.success, 'Valid Date object should pass validation');
  test.assert(result.value instanceof Date, 'Result should be Date object');
});

test.test('DateValidator - valid date string', () => {
  const validator = Schema.date();
  const result = validator.validate('2023-01-01T00:00:00.000Z');
  test.assert(result.success, 'Valid date string should pass validation');
  test.assert(result.value instanceof Date, 'Result should be converted to Date object');
});

test.test('DateValidator - invalid date string', () => {
  const validator = Schema.date();
  const result = validator.validate('not-a-date');
  test.assert(!result.success, 'Invalid date string should fail validation');
});

test.test('DateValidator - min date constraint', () => {
  const validator = Schema.date().min(new Date('2023-01-01'));
  const earlyResult = validator.validate(new Date('2022-12-31'));
  const validResult = validator.validate(new Date('2023-01-02'));
  
  test.assert(!earlyResult.success, 'Date before minimum should fail');
  test.assert(validResult.success, 'Date after minimum should pass');
});

test.test('DateValidator - max date constraint', () => {
  const validator = Schema.date().max(new Date('2023-12-31'));
  const lateResult = validator.validate(new Date('2024-01-01'));
  const validResult = validator.validate(new Date('2023-12-30'));
  
  test.assert(!lateResult.success, 'Date after maximum should fail');
  test.assert(validResult.success, 'Date before maximum should pass');
});

// ============================================================================
// ARRAY VALIDATOR TESTS
// ============================================================================

test.test('ArrayValidator - valid array of strings', () => {
  const validator = Schema.array(Schema.string());
  const result = validator.validate(['hello', 'world']);
  test.assert(result.success, 'Valid array should pass validation');
  test.assertDeepEqual(result.value, ['hello', 'world']);
});

test.test('ArrayValidator - invalid type (not array)', () => {
  const validator = Schema.array(Schema.string());
  const result = validator.validate('not-an-array');
  test.assert(!result.success, 'Non-array should fail array validation');
});

test.test('ArrayValidator - invalid item types', () => {
  const validator = Schema.array(Schema.string());
  const result = validator.validate(['hello', 123, 'world']);
  test.assert(!result.success, 'Array with invalid item types should fail');
  test.assert(result.errors.length > 0, 'Should have validation errors');
});

test.test('ArrayValidator - minLength constraint', () => {
  const validator = Schema.array(Schema.string()).minLength(2);
  const shortResult = validator.validate(['one']);
  const validResult = validator.validate(['one', 'two']);
  
  test.assert(!shortResult.success, 'Short array should fail minLength validation');
  test.assert(validResult.success, 'Valid length array should pass');
});

test.test('ArrayValidator - maxLength constraint', () => {
  const validator = Schema.array(Schema.string()).maxLength(2);
  const longResult = validator.validate(['one', 'two', 'three']);
  const validResult = validator.validate(['one', 'two']);
  
  test.assert(!longResult.success, 'Long array should fail maxLength validation');
  test.assert(validResult.success, 'Valid length array should pass');
});

test.test('ArrayValidator - nested array validation', () => {
  const validator = Schema.array(Schema.array(Schema.number()));
  const result = validator.validate([[1, 2], [3, 4]]);
  test.assert(result.success, 'Valid nested array should pass validation');
  test.assertDeepEqual(result.value, [[1, 2], [3, 4]]);
});

test.test('ArrayValidator - error path reporting', () => {
  const validator = Schema.array(Schema.string());
  const result = validator.validate(['valid', 123, 'also-valid']);
  test.assert(!result.success, 'Array with invalid item should fail');
  test.assert(result.errors[0].path.includes('[1]'), 'Error should include item index in path');
});

// ============================================================================
// OBJECT VALIDATOR TESTS
// ============================================================================

test.test('ObjectValidator - valid object', () => {
  const validator = Schema.object({
    name: Schema.string(),
    age: Schema.number()
  });
  const result = validator.validate({ name: 'John', age: 30 });
  test.assert(result.success, 'Valid object should pass validation');
  test.assertDeepEqual(result.value, { name: 'John', age: 30 });
});

test.test('ObjectValidator - invalid type (not object)', () => {
  const validator = Schema.object({ name: Schema.string() });
  const results = [
    validator.validate('not-an-object'),
    validator.validate(null),
    validator.validate([])
  ];
  
  results.forEach(result => {
    test.assert(!result.success, 'Non-object should fail object validation');
  });
});

test.test('ObjectValidator - invalid property types', () => {
  const validator = Schema.object({
    name: Schema.string(),
    age: Schema.number()
  });
  const result = validator.validate({ name: 123, age: 'thirty' });
  test.assert(!result.success, 'Object with invalid property types should fail');
  test.assert(result.errors.length >= 2, 'Should have errors for both invalid properties');
});

test.test('ObjectValidator - missing required properties', () => {
  const validator = Schema.object({
    name: Schema.string(),
    age: Schema.number()
  });
  const result = validator.validate({ name: 'John' });
  test.assert(!result.success, 'Object with missing required property should fail');
});

test.test('ObjectValidator - optional properties', () => {
  const validator = Schema.object({
    name: Schema.string(),
    age: Schema.number().optional()
  });
  const result = validator.validate({ name: 'John' });
  test.assert(result.success, 'Object with missing optional property should pass');
});

test.test('ObjectValidator - strict mode (no additional properties)', () => {
  const validator = Schema.object({
    name: Schema.string()
  }).strict();
  const result = validator.validate({ name: 'John', extra: 'property' });
  test.assert(!result.success, 'Strict mode should reject additional properties');
});

test.test('ObjectValidator - non-strict mode (allow additional properties)', () => {
  const validator = Schema.object({
    name: Schema.string()
  });
  const result = validator.validate({ name: 'John', extra: 'property' });
  test.assert(result.success, 'Non-strict mode should allow additional properties');
  test.assertEqual(result.value.extra, 'property', 'Additional properties should be preserved');
});

test.test('ObjectValidator - nested object validation', () => {
  const validator = Schema.object({
    user: Schema.object({
      name: Schema.string(),
      email: Schema.string().email()
    }),
    metadata: Schema.object({
      created: Schema.date()
    })
  });
  
  const validData = {
    user: {
      name: 'John Doe',
      email: 'john@example.com'
    },
    metadata: {
      created: new Date('2023-01-01')
    }
  };
  
  const result = validator.validate(validData);
  test.assert(result.success, 'Valid nested object should pass validation');
});

test.test('ObjectValidator - error path reporting', () => {
  const validator = Schema.object({
    user: Schema.object({
      name: Schema.string(),
      age: Schema.number()
    })
  });
  const result = validator.validate({
    user: {
      name: 'John',
      age: 'not-a-number'
    }
  });
  test.assert(!result.success, 'Invalid nested property should fail');
  test.assert(result.errors[0].path.includes('user.age'), 'Error should include nested path');
});

// ============================================================================
// SCHEMA FACTORY TESTS
// ============================================================================

test.test('Schema factory methods return correct types', () => {
  test.assert(Schema.string() instanceof StringValidator, 'Schema.string() should return StringValidator');
  test.assert(Schema.number() instanceof NumberValidator, 'Schema.number() should return NumberValidator');
  test.assert(Schema.boolean() instanceof BooleanValidator, 'Schema.boolean() should return BooleanValidator');
  test.assert(Schema.date() instanceof DateValidator, 'Schema.date() should return DateValidator');
  test.assert(Schema.array(Schema.string()) instanceof ArrayValidator, 'Schema.array() should return ArrayValidator');
  test.assert(Schema.object({}) instanceof ObjectValidator, 'Schema.object() should return ObjectValidator');
});

// ============================================================================
// INTEGRATION TESTS
// ============================================================================

test.test('Complex schema integration test', () => {
  const userSchema = Schema.object({
    id: Schema.string().minLength(1),
    name: Schema.string().minLength(2).maxLength(50),
    email: Schema.string().email(),
    age: Schema.number().min(0).max(150).integer().optional(),
    isActive: Schema.boolean(),
    tags: Schema.array(Schema.string()).minLength(1).maxLength(10),
    address: Schema.object({
      street: Schema.string().minLength(1),
      city: Schema.string().minLength(1),
      postalCode: Schema.string().pattern(/^\d{5}(-\d{4})?$/),
      country: Schema.string().enum(['USA', 'Canada', 'UK'])
    }).optional(),
    metadata: Schema.object({}).optional()
  });

  const validUser = {
    id: 'user123',
    name: 'John Doe',
    email: 'john@example.com',
    age: 30,
    isActive: true,
    tags: ['developer', 'javascript'],
    address: {
      street: '123 Main St',
      city: 'Springfield',
      postalCode: '12345',
      country: 'USA'
    }
  };

  const result = userSchema.validate(validUser);
  test.assert(result.success, 'Complex valid schema should pass validation');
});

test.test('Complex schema with multiple errors', () => {
  const userSchema = Schema.object({
    name: Schema.string().minLength(2),
    email: Schema.string().email(),
    age: Schema.number().min(0).integer()
  });

  const invalidUser = {
    name: 'J', // too short
    email: 'invalid-email', // invalid format
    age: -5.5 // negative and not integer
  };

  const result = userSchema.validate(invalidUser);
  test.assert(!result.success, 'Invalid complex schema should fail validation');
  test.assert(result.errors.length >= 3, 'Should have multiple validation errors');
});

test.test('Custom error messages', () => {
  const validator = Schema.string().minLength(5).withMessage('Custom error message');
  const result = validator.validate('hi');
  test.assert(!result.success, 'Validation should fail');
  test.assertEqual(result.errors[0].message, 'Custom error message', 'Should use custom error message');
});

// Run all tests
const results = test.run();

// Export test results for coverage analysis
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { TestFramework, results };
} 