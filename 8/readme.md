# Data Validation Library

A comprehensive, type-safe validation library for JavaScript that supports primitive types, complex objects, arrays, and custom validation rules. Built with performance and developer experience in mind.

[![Test Coverage](https://img.shields.io/badge/coverage-88.48%25-brightgreen)](./test_report.md)
[![Tests](https://img.shields.io/badge/tests-28/28_passing-brightgreen)](#testing)
[![Node Version](https://img.shields.io/badge/node-%3E%3D12.0.0-blue)](#requirements)

## Features

- 🛡️ **Type-safe validation** for all JavaScript primitives and complex types
- 🔄 **Method chaining** for fluent and readable validation rules
- 📝 **Custom error messages** with detailed path reporting
- 🚀 **High performance** - validates 100+ objects in <1ms
- 🎯 **Zero dependencies** - lightweight and fast
- 💻 **Developer-friendly** API with comprehensive error reporting
- 🧪 **Well-tested** with 88%+ code coverage
- ✅ **Easy verification** - built-in verification script to test functionality

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Verification](#verification)
- [API Reference](#api-reference)
- [Validator Types](#validator-types)
- [Advanced Usage](#advanced-usage)
- [Error Handling](#error-handling)
- [Performance](#performance)
- [Testing](#testing)
- [Contributing](#contributing)

## Installation

### Node.js

```bash
# Clone or download the library
git clone <repository-url>
cd data-validation-library

# Install dependencies (for development)
npm install

# Verify everything works
node verify.js
```

### Direct Usage

```javascript
// Import the library
const { Schema } = require('./schema.js');

// Start validating!
const validator = Schema.string().email();
const result = validator.validate('user@example.com');
console.log(result.success); // true
```

### ✅ **Verify Installation**

After installation, run the verification script to ensure everything works:

```bash
node verify.js
```

You should see all tests pass with "PASS" status. If any test fails, see the [Troubleshooting](#troubleshooting) section.

## Quick Start

### Basic Validation

```javascript
const { Schema } = require('./schema.js');

// String validation
const nameValidator = Schema.string().minLength(2).maxLength(50);
const result = nameValidator.validate('John Doe');

if (result.success) {
  console.log('Valid name:', result.value);
} else {
  console.log('Validation errors:', result.errors);
}
```

### Complex Object Validation

```javascript
const userSchema = Schema.object({
  username: Schema.string().minLength(3).maxLength(20),
  email: Schema.string().email(),
  age: Schema.number().min(13).integer(),
  isActive: Schema.boolean(),
  tags: Schema.array(Schema.string()).maxLength(10)
});

const userData = {
  username: 'johndoe',
  email: 'john@example.com',
  age: 25,
  isActive: true,
  tags: ['developer', 'javascript']
};

const result = userSchema.validate(userData);
// result.success === true
```

## Verification

### 🚀 **Quick Verification (Recommended)**

The easiest way to verify the library works is to run our built-in verification script:

```bash
node verify.js
```

**Expected Output:**
```
🧪 Data Validation Library - Quick Verification

✅ String validation: PASS
✅ Email validation: PASS
✅ Number validation: PASS
✅ Object validation: PASS
✅ Error handling: PASS
   Error message: String length must be at least 10 characters
✅ Array validation: PASS
✅ Nested validation: PASS

🎉 Verification complete! Library is working correctly.
```

### 📋 **Testing Commands**

| Command | Purpose | Expected Result |
|---------|---------|----------------|
| `node verify.js` | **Quick functional test** | 7/7 tests PASS |
| `npm test` | **Basic test suite** | 13/13 tests passing |
| `npm run test:comprehensive` | **Full test suite** | 28/28 tests passing |
| `npm run demo` | **Library demonstration** | Shows validation examples |
| `npm run test:coverage` | **Coverage analysis** | 88%+ coverage report |

### ✅ **Step-by-Step Verification**

1. **Basic functionality check:**
   ```bash
   node verify.js
   ```

2. **Run test suite:**
   ```bash
   npm test
   ```

3. **See the demo:**
   ```bash
   npm run demo
   ```

4. **Full coverage analysis:**
   ```bash
   npm run test:coverage
   ```

### 🧪 **Manual Testing Examples**

You can also test individual features directly in the terminal:

```bash
# Test email validation
node -p "require('./schema.js').Schema.string().email().validate('test@example.com')"
# Expected: { success: true, value: 'test@example.com', errors: [] }

# Test invalid email
node -p "require('./schema.js').Schema.string().email().validate('invalid-email')"  
# Expected: { success: false, errors: [...] }

# Test number validation
node -p "require('./schema.js').Schema.number().min(0).max(100).validate(42)"
# Expected: { success: true, value: 42, errors: [] }

# Test object validation
node -e "
const { Schema } = require('./schema.js');
const result = Schema.object({
  name: Schema.string(),
  age: Schema.number()
}).validate({ name: 'John', age: 30 });
console.log('Success:', result.success);
console.log('Data:', result.value);
"
```

### 🎯 **What Success Looks Like**

When everything works correctly, you should see:
- ✅ **All verification tests pass** (7/7 PASS in verify.js)
- ✅ **No error messages** (except intentional validation errors in demos)
- ✅ **Test coverage above 88%**
- ✅ **Performance under 1ms** for large datasets
- ✅ **Detailed error messages** when validation intentionally fails

### 🚨 **Troubleshooting**

If verification fails, check:

1. **Node.js version** (requires ≥12.0.0):
   ```bash
   node --version
   ```

2. **Dependencies installed**:
   ```bash
   npm install
   ```

3. **Files present**:
   ```bash
   ls -la *.js *.md
   ```

## API Reference

### Schema Factory Methods

The `Schema` class provides static factory methods for creating validators:

```javascript
const { Schema } = require('./schema.js');

// Create validators
const stringValidator = Schema.string();
const numberValidator = Schema.number();
const booleanValidator = Schema.boolean();
const dateValidator = Schema.date();
const arrayValidator = Schema.array(Schema.string());
const objectValidator = Schema.object({ name: Schema.string() });
```

### Validation Result

All validators return a consistent result object:

```javascript
{
  success: boolean,        // Whether validation passed
  value: any,             // The validated/transformed value
  errors: Array<{         // Array of validation errors
    message: string,      // Error description
    value: any,          // The invalid value
    path: string,        // Path to the invalid field
    type: 'validation_error'
  }>
}
```

## Validator Types

### String Validator

```javascript
const validator = Schema.string()
  .minLength(3)                    // Minimum length
  .maxLength(100)                  // Maximum length
  .pattern(/^[a-zA-Z]+$/)         // Regex pattern
  .enum(['red', 'green', 'blue']) // Allowed values
  .email()                        // Email format
  .url()                          // URL format
  .optional()                     // Allow null/undefined
  .withMessage('Custom error')    // Custom error message
  .transform(val => val.trim());  // Transform before validation

// Examples
Schema.string().validate('hello');                    // ✅ Valid
Schema.string().email().validate('user@domain.com'); // ✅ Valid
Schema.string().minLength(5).validate('hi');         // ❌ Too short
```

### Number Validator

```javascript
const validator = Schema.number()
  .min(0)              // Minimum value
  .max(100)            // Maximum value
  .integer()           // Must be integer
  .positive()          // Must be positive (> 0)
  .optional()          // Allow null/undefined
  .withMessage('Custom error');

// Examples
Schema.number().validate(42);                    // ✅ Valid
Schema.number().integer().validate(3.14);       // ❌ Not integer
Schema.number().positive().validate(-5);        // ❌ Not positive
Schema.number().min(0).max(100).validate(150);  // ❌ Too high
```

### Boolean Validator

```javascript
const validator = Schema.boolean()
  .optional()          // Allow null/undefined
  .withMessage('Custom error');

// Examples
Schema.boolean().validate(true);   // ✅ Valid
Schema.boolean().validate(false);  // ✅ Valid
Schema.boolean().validate('true'); // ❌ Wrong type
```

### Date Validator

```javascript
const validator = Schema.date()
  .min(new Date('2023-01-01'))    // Minimum date
  .max(new Date('2023-12-31'))    // Maximum date
  .optional()                     // Allow null/undefined
  .withMessage('Custom error');

// Examples
Schema.date().validate(new Date());           // ✅ Valid
Schema.date().validate('2023-06-15');        // ✅ Valid (converts string)
Schema.date().validate('invalid-date');      // ❌ Invalid date
```

### Array Validator

```javascript
const validator = Schema.array(Schema.string())  // Item validator
  .minLength(1)                                  // Minimum length
  .maxLength(10)                                 // Maximum length
  .optional()                                    // Allow null/undefined
  .withMessage('Custom error');

// Examples
Schema.array(Schema.string()).validate(['a', 'b']);        // ✅ Valid
Schema.array(Schema.number()).validate([1, 2, 3]);         // ✅ Valid
Schema.array(Schema.string()).validate(['a', 123]);        // ❌ Invalid item
Schema.array(Schema.string()).minLength(2).validate(['a']); // ❌ Too short
```

### Object Validator

```javascript
const validator = Schema.object({
  name: Schema.string(),
  age: Schema.number().optional(),
  email: Schema.string().email()
})
  .strict()            // Reject additional properties
  .optional()          // Allow null/undefined
  .withMessage('Custom error');

// Examples
const schema = Schema.object({
  name: Schema.string(),
  age: Schema.number().optional()
});

schema.validate({ name: 'John', age: 30 });     // ✅ Valid
schema.validate({ name: 'John' });              // ✅ Valid (age optional)
schema.validate({ name: 'John', extra: 'prop' }); // ✅ Valid (non-strict)
schema.strict().validate({ name: 'John', extra: 'prop' }); // ❌ Extra property
```

## Advanced Usage

### Nested Validation

```javascript
const addressSchema = Schema.object({
  street: Schema.string().minLength(1),
  city: Schema.string().minLength(1),
  postalCode: Schema.string().pattern(/^\d{5}(-\d{4})?$/),
  country: Schema.string().enum(['USA', 'Canada', 'UK'])
});

const userSchema = Schema.object({
  name: Schema.string(),
  addresses: Schema.array(addressSchema).maxLength(3),
  primaryAddress: addressSchema.optional()
});
```

### Transform Functions

```javascript
// Clean and normalize data before validation
const cleanStringValidator = Schema.string()
  .transform(val => val.trim().toLowerCase())
  .minLength(3);

const numberFromStringValidator = Schema.string()
  .transform(val => parseInt(val))
  .min(0);

// Example usage
const result = cleanStringValidator.validate('  HELLO  ');
console.log(result.value); // 'hello'
```

### Custom Error Messages

```javascript
const passwordValidator = Schema.string()
  .minLength(8)
  .withMessage('Password must be at least 8 characters long')
  .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
  .withMessage('Password must contain uppercase, lowercase, and number');

const result = passwordValidator.validate('weak');
console.log(result.errors[0].message); // Custom error message
```

### Method Chaining

```javascript
const complexValidator = Schema.object({
  username: Schema.string()
    .minLength(3)
    .maxLength(20)
    .pattern(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username must be 3-20 characters, alphanumeric and underscore only'),
  
  email: Schema.string()
    .email()
    .transform(email => email.toLowerCase())
    .withMessage('Please provide a valid email address'),
  
  age: Schema.number()
    .integer()
    .min(13)
    .max(120)
    .withMessage('Age must be between 13 and 120'),
  
  preferences: Schema.object({
    newsletter: Schema.boolean(),
    theme: Schema.string().enum(['light', 'dark']).optional()
  }).optional()
});
```

## Error Handling

### Error Structure

```javascript
{
  message: "String length must be at least 5 characters",
  value: "hi",
  path: "username",
  type: "validation_error"
}
```

### Handling Multiple Errors

```javascript
const schema = Schema.object({
  name: Schema.string().minLength(2),
  age: Schema.number().min(0),
  email: Schema.string().email()
});

const result = schema.validate({
  name: 'J',           // Too short
  age: -5,             // Negative
  email: 'invalid'     // Invalid format
});

if (!result.success) {
  result.errors.forEach(error => {
    console.log(`${error.path}: ${error.message}`);
  });
  // Output:
  // name: String length must be at least 2 characters
  // age: Value must be at least 0
  // email: String does not match required pattern
}
```

### Error Path Reporting

For nested objects, errors include the full path to the invalid field:

```javascript
const schema = Schema.object({
  user: Schema.object({
    profile: Schema.object({
      name: Schema.string().minLength(2)
    })
  })
});

const result = schema.validate({
  user: {
    profile: {
      name: 'J'
    }
  }
});

console.log(result.errors[0].path); // "user.profile.name"
```

## Performance

The library is optimized for performance:

- **Fast validation**: 100+ objects validated in <1ms
- **Memory efficient**: No memory leaks, efficient object creation
- **Minimal overhead**: Direct validation with no unnecessary processing

### Performance Test Results

```javascript
// Validating 100 complex objects
const schema = Schema.array(Schema.object({
  id: Schema.number(),
  name: Schema.string(),
  tags: Schema.array(Schema.string())
}));

const data = Array.from({ length: 100 }, (_, i) => ({
  id: i,
  name: `Item ${i}`,
  tags: [`tag${i}`]
}));

console.time('validation');
const result = schema.validate(data);
console.timeEnd('validation'); // < 1ms
```

**Note:** The `verify.js` script includes a performance test that validates 100 objects and reports timing.

## Testing

### 🚀 **Quick Testing (Start Here)**

```bash
# Verify core functionality works
node verify.js

# Run basic test suite  
npm test

# Run comprehensive tests
npm run test:comprehensive
```

### 📊 **Full Testing Suite**

```bash
# Quick verification (7 core tests)
node verify.js

# Basic tests (13 tests)
npm test

# Comprehensive test suite (28 tests)
npm run test:comprehensive

# Tests with coverage analysis
npm run test:coverage

# Run the demo
npm run demo
```

### ✅ **Test Results Overview**

| Test Type | Command | Tests | Status |
|-----------|---------|--------|--------|
| **Quick Verification** | `node verify.js` | 7/7 | ✅ PASS |
| **Basic Suite** | `npm test` | 13/13 | ✅ PASS |
| **Comprehensive** | `npm run test:comprehensive` | 28/28 | ✅ PASS |

### 📈 **Test Coverage**

The library maintains excellent test coverage:

- **Statements**: 88.48% (exceeds 60% requirement)
- **Branches**: 94.11%
- **Functions**: 95.12%
- **Lines**: 88.34%

See [test_report.md](./test_report.md) for detailed coverage analysis.

### 🧪 **Writing Custom Tests**

```javascript
const { Schema } = require('./schema.js');

// Test your validation logic
const validator = Schema.string().email();

console.assert(validator.validate('test@example.com').success);
console.assert(!validator.validate('invalid-email').success);

// Test complex schemas
const userSchema = Schema.object({
  name: Schema.string().minLength(2),
  email: Schema.string().email(),
  age: Schema.number().min(18)
});

const testUser = { name: 'John', email: 'john@test.com', age: 25 };
console.assert(userSchema.validate(testUser).success);
```

### 🔍 **Test Categories Covered**

- ✅ **String validation** - Type checking, length, patterns, email/URL formats
- ✅ **Number validation** - Type checking, ranges, integer/positive constraints  
- ✅ **Boolean validation** - Strict type checking
- ✅ **Date validation** - Date objects, string conversion, range constraints
- ✅ **Array validation** - Type checking, item validation, length constraints
- ✅ **Object validation** - Property validation, nesting, optional fields
- ✅ **Error handling** - Error accumulation, path reporting, custom messages
- ✅ **Integration scenarios** - Complex real-world validation patterns
- ✅ **Performance testing** - Large dataset validation efficiency

## Real-World Examples

### Form Validation

```javascript
const contactFormSchema = Schema.object({
  name: Schema.string().minLength(1).maxLength(100),
  email: Schema.string().email(),
  phone: Schema.string().pattern(/^\+?[\d\s\-\(\)]+$/).optional(),
  message: Schema.string().minLength(10).maxLength(1000),
  subscribe: Schema.boolean().optional()
});

// Usage in form handler
function validateContactForm(formData) {
  const result = contactFormSchema.validate(formData);
  
  if (!result.success) {
    return {
      valid: false,
      errors: result.errors.reduce((acc, error) => {
        acc[error.path] = error.message;
        return acc;
      }, {})
    };
  }
  
  return { valid: true, data: result.value };
}
```

### API Request Validation

```javascript
const apiRequestSchema = Schema.object({
  endpoint: Schema.string().url(),
  method: Schema.string().enum(['GET', 'POST', 'PUT', 'DELETE']),
  headers: Schema.object({}).optional(),
  body: Schema.object({}).optional(),
  timeout: Schema.number().min(0).max(30000).optional()
});

const createUserSchema = Schema.object({
  username: Schema.string().minLength(3).maxLength(20),
  email: Schema.string().email(),
  password: Schema.string().minLength(8),
  profile: Schema.object({
    firstName: Schema.string().minLength(1),
    lastName: Schema.string().minLength(1),
    bio: Schema.string().maxLength(500).optional()
  })
});
```

### Configuration Validation

```javascript
const configSchema = Schema.object({
  database: Schema.object({
    host: Schema.string(),
    port: Schema.number().integer().min(1).max(65535),
    name: Schema.string(),
    ssl: Schema.boolean().optional()
  }),
  server: Schema.object({
    port: Schema.number().integer().min(1000).max(65535),
    host: Schema.string().optional(),
    cors: Schema.boolean().optional()
  }),
  logging: Schema.object({
    level: Schema.string().enum(['debug', 'info', 'warn', 'error']),
    file: Schema.string().optional()
  })
});

// Load and validate configuration
function loadConfig(configFile) {
  const config = JSON.parse(fs.readFileSync(configFile, 'utf8'));
  const result = configSchema.validate(config);
  
  if (!result.success) {
    throw new Error('Invalid configuration: ' + 
      result.errors.map(e => `${e.path}: ${e.message}`).join(', '));
  }
  
  return result.value;
}
```

## Requirements

- **Node.js**: ≥12.0.0
- **Dependencies**: None (zero dependencies)

## Best Practices

1. **Define schemas early**: Create validation schemas as constants that can be reused
2. **Use method chaining**: Combine constraints for readable validation rules
3. **Handle errors gracefully**: Always check `result.success` before using the value
4. **Use custom messages**: Provide user-friendly error messages for better UX
5. **Transform data**: Use transform functions to clean and normalize input
6. **Test your schemas**: Write tests for your validation logic

## Troubleshooting

### 🚨 **First Steps**

If you're having issues, start with these diagnostic commands:

```bash
# 1. Check if the library loads
node -p "!!require('./schema.js').Schema"
# Should output: true

# 2. Run quick verification
node verify.js
# Should show all tests passing

# 3. Check Node.js version
node --version
# Should be ≥12.0.0
```

### 🔧 **Installation Issues**

**Problem: `Cannot find module './schema.js'`**
```bash
# Solution: Ensure you're in the correct directory
pwd
ls -la *.js
# You should see schema.js in the list
```

**Problem: `npm command not found`**
```bash
# Solution: Install Node.js and npm
# Visit: https://nodejs.org/
# Or verify installation:
node --version && npm --version
```

### ⚠️ **Common Validation Issues**

1. **"Expected string, got number"**
   ```javascript
   // ❌ Wrong
   Schema.string().validate(123);
   
   // ✅ Right
   Schema.string().validate('123');
   
   // ✅ Or transform first
   Schema.string().transform(val => String(val)).validate(123);
   ```

2. **"Additional properties not allowed"**
   ```javascript
   // ❌ Strict mode rejects extra properties
   Schema.object({ name: Schema.string() }).strict()
     .validate({ name: 'John', extra: 'prop' });
   
   // ✅ Non-strict mode allows extra properties
   Schema.object({ name: Schema.string() })
     .validate({ name: 'John', extra: 'prop' });
   ```

3. **"Array length must be at least X"**
   ```javascript
   // ❌ Wrong
   Schema.array(Schema.string()).minLength(3).validate(['a', 'b']);
   
   // ✅ Right  
   Schema.array(Schema.string()).minLength(3).validate(['a', 'b', 'c']);
   
   // ✅ Or adjust constraint
   Schema.array(Schema.string()).minLength(2).validate(['a', 'b']);
   ```

4. **Email/URL validation failing**
   ```javascript
   // ❌ Common mistakes
   Schema.string().email().validate('user@domain');      // Missing TLD
   Schema.string().url().validate('example.com');        // Missing protocol
   
   // ✅ Correct formats
   Schema.string().email().validate('user@domain.com');  // Valid email
   Schema.string().url().validate('https://example.com'); // Valid URL
   ```

### 🐛 **Debugging Tips**

**Check validation errors:**
```javascript
const result = validator.validate(data);
if (!result.success) {
  console.log('Validation failed:');
  result.errors.forEach(error => {
    console.log(`- ${error.path}: ${error.message}`);
    console.log(`  Value: ${JSON.stringify(error.value)}`);
  });
}
```

**Test individual validators:**
```javascript
// Test each part separately
const stringTest = Schema.string().validate('test');
console.log('String validation:', stringTest.success);

const emailTest = Schema.string().email().validate('test@example.com');
console.log('Email validation:', emailTest.success);
```

### 🚀 **Performance Issues**

**Problem: Slow validation with large datasets**
```javascript
// ❌ Validating huge arrays at once
const hugeArray = new Array(100000).fill(data);
validator.validate(hugeArray); // May be slow

// ✅ Validate in chunks
function validateChunks(data, chunkSize = 1000) {
  for (let i = 0; i < data.length; i += chunkSize) {
    const chunk = data.slice(i, i + chunkSize);
    const result = validator.validate(chunk);
    if (!result.success) return result;
  }
  return { success: true };
}
```

### 💡 **Getting Help**

1. **Run diagnostics:**
   ```bash
   # Full system check
   node verify.js && npm test && echo "✅ Everything working!"
   ```

2. **Check test coverage:**
   ```bash
   npm run test:coverage
   ```

3. **View examples:**
   ```bash
   npm run demo
   ```

4. **Common solutions:**
   - Ensure Node.js ≥12.0.0
   - Run `npm install` for development features
   - Check that all `.js` files are present
   - Verify data types match validator expectations

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass and coverage remains >60%
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

---

**Happy Validating! 🛡️**

### 🚀 **Quick Start Reminder**

1. **Install**: `npm install` (for development features)
2. **Verify**: `node verify.js` (check everything works)
3. **Use**: `const { Schema } = require('./schema.js')`
4. **Test**: `npm test` (run test suite)

For more examples and advanced usage patterns, see the test files in this repository. 