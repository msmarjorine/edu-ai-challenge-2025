/**
 * Data Validation Library
 * 
 * A comprehensive, type-safe validation library for JavaScript that supports
 * primitive types, complex objects, arrays, and custom validation rules.
 * 
 * @author AI Assistant
 * @version 1.0.0
 */

/**
 * Base Validator class that all specific validators extend from.
 * Provides common functionality for validation, error handling, and chaining.
 */
class Validator {
  constructor() {
    this.isOptional = false;
    this.customMessage = null;
    this.transformFn = null;
  }

  /**
   * Marks this validator as optional, allowing null or undefined values
   * @returns {Validator} The validator instance for method chaining
   */
  optional() {
    this.isOptional = true;
    return this;
  }

  /**
   * Sets a custom error message for validation failures
   * @param {string} message - Custom error message
   * @returns {Validator} The validator instance for method chaining
   */
  withMessage(message) {
    this.customMessage = message;
    return this;
  }

  /**
   * Adds a transformation function to be applied before validation
   * @param {Function} fn - Transformation function
   * @returns {Validator} The validator instance for method chaining
   */
  transform(fn) {
    this.transformFn = fn;
    return this;
  }

  /**
   * Creates a validation error object
   * @param {string} message - Error message
   * @param {*} value - The value that failed validation
   * @param {string} path - The path to the invalid field
   * @returns {Object} Validation error object
   */
  createError(message, value, path = '') {
    return {
      message: this.customMessage || message,
      value: value,
      path: path,
      type: 'validation_error'
    };
  }

  /**
   * Base validation method - to be overridden by subclasses
   * @param {*} value - Value to validate
   * @param {string} path - Path for error reporting
   * @returns {Object} Validation result with success flag and potential errors
   */
  validate(value, path = '') {
    // Handle optional values
    if (this.isOptional && (value === null || value === undefined)) {
      return { success: true, value: value, errors: [] };
    }

    // Apply transformation if provided
    if (this.transformFn) {
      try {
        value = this.transformFn(value);
      } catch (error) {
        return {
          success: false,
          errors: [this.createError(`Transformation failed: ${error.message}`, value, path)]
        };
      }
    }

    return this._validate(value, path);
  }

  /**
   * Internal validation method to be implemented by subclasses
   * @param {*} value - Value to validate
   * @param {string} path - Path for error reporting
   * @returns {Object} Validation result
   */
  _validate(value, path) {
    throw new Error('_validate method must be implemented by subclasses');
  }
}

/**
 * String validator with support for length constraints, patterns, and custom rules
 */
class StringValidator extends Validator {
  constructor() {
    super();
    this.minLengthValue = null;
    this.maxLengthValue = null;
    this.patternValue = null;
    this.enumValues = null;
  }

  /**
   * Sets minimum length constraint
   * @param {number} length - Minimum length
   * @returns {StringValidator} The validator instance for method chaining
   */
  minLength(length) {
    this.minLengthValue = length;
    return this;
  }

  /**
   * Sets maximum length constraint
   * @param {number} length - Maximum length
   * @returns {StringValidator} The validator instance for method chaining
   */
  maxLength(length) {
    this.maxLengthValue = length;
    return this;
  }

  /**
   * Sets a regex pattern that the string must match
   * @param {RegExp} pattern - Regular expression pattern
   * @returns {StringValidator} The validator instance for method chaining
   */
  pattern(pattern) {
    this.patternValue = pattern;
    return this;
  }

  /**
   * Restricts the string to one of the provided values
   * @param {string[]} values - Array of allowed values
   * @returns {StringValidator} The validator instance for method chaining
   */
  enum(values) {
    this.enumValues = values;
    return this;
  }

  /**
   * Validates email format using a regex pattern
   * @returns {StringValidator} The validator instance for method chaining
   */
  email() {
    return this.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  }

  /**
   * Validates URL format
   * @returns {StringValidator} The validator instance for method chaining
   */
  url() {
    return this.pattern(/^https?:\/\/[^\s/$.?#].[^\s]*$/i);
  }

  /**
   * Internal validation implementation for strings
   * @param {*} value - Value to validate
   * @param {string} path - Path for error reporting
   * @returns {Object} Validation result
   */
  _validate(value, path) {
    const errors = [];

    // Check if value is a string
    if (typeof value !== 'string') {
      return {
        success: false,
        errors: [this.createError(`Expected string, got ${typeof value}`, value, path)]
      };
    }

    // Check minimum length
    if (this.minLengthValue !== null && value.length < this.minLengthValue) {
      errors.push(this.createError(
        `String length must be at least ${this.minLengthValue} characters`,
        value,
        path
      ));
    }

    // Check maximum length
    if (this.maxLengthValue !== null && value.length > this.maxLengthValue) {
      errors.push(this.createError(
        `String length must be at most ${this.maxLengthValue} characters`,
        value,
        path
      ));
    }

    // Check pattern
    if (this.patternValue && !this.patternValue.test(value)) {
      errors.push(this.createError(
        `String does not match required pattern`,
        value,
        path
      ));
    }

    // Check enum values
    if (this.enumValues && !this.enumValues.includes(value)) {
      errors.push(this.createError(
        `String must be one of: ${this.enumValues.join(', ')}`,
        value,
        path
      ));
    }

    return {
      success: errors.length === 0,
      value: value,
      errors: errors
    };
  }
}

/**
 * Number validator with support for range constraints and integer validation
 */
class NumberValidator extends Validator {
  constructor() {
    super();
    this.minValue = null;
    this.maxValue = null;
    this.integerOnly = false;
    this.positiveOnly = false;
  }

  /**
   * Sets minimum value constraint
   * @param {number} value - Minimum value
   * @returns {NumberValidator} The validator instance for method chaining
   */
  min(value) {
    this.minValue = value;
    return this;
  }

  /**
   * Sets maximum value constraint
   * @param {number} value - Maximum value
   * @returns {NumberValidator} The validator instance for method chaining
   */
  max(value) {
    this.maxValue = value;
    return this;
  }

  /**
   * Requires the number to be an integer
   * @returns {NumberValidator} The validator instance for method chaining
   */
  integer() {
    this.integerOnly = true;
    return this;
  }

  /**
   * Requires the number to be positive (> 0)
   * @returns {NumberValidator} The validator instance for method chaining
   */
  positive() {
    this.positiveOnly = true;
    return this;
  }

  /**
   * Internal validation implementation for numbers
   * @param {*} value - Value to validate
   * @param {string} path - Path for error reporting
   * @returns {Object} Validation result
   */
  _validate(value, path) {
    const errors = [];

    // Check if value is a number
    if (typeof value !== 'number' || isNaN(value)) {
      return {
        success: false,
        errors: [this.createError(`Expected number, got ${typeof value}`, value, path)]
      };
    }

    // Check integer constraint
    if (this.integerOnly && !Number.isInteger(value)) {
      errors.push(this.createError(`Expected integer, got ${value}`, value, path));
    }

    // Check positive constraint
    if (this.positiveOnly && value <= 0) {
      errors.push(this.createError(`Expected positive number, got ${value}`, value, path));
    }

    // Check minimum value
    if (this.minValue !== null && value < this.minValue) {
      errors.push(this.createError(`Value must be at least ${this.minValue}`, value, path));
    }

    // Check maximum value
    if (this.maxValue !== null && value > this.maxValue) {
      errors.push(this.createError(`Value must be at most ${this.maxValue}`, value, path));
    }

    return {
      success: errors.length === 0,
      value: value,
      errors: errors
    };
  }
}

/**
 * Boolean validator for true/false values
 */
class BooleanValidator extends Validator {
  /**
   * Internal validation implementation for booleans
   * @param {*} value - Value to validate
   * @param {string} path - Path for error reporting
   * @returns {Object} Validation result
   */
  _validate(value, path) {
    if (typeof value !== 'boolean') {
      return {
        success: false,
        errors: [this.createError(`Expected boolean, got ${typeof value}`, value, path)]
      };
    }

    return {
      success: true,
      value: value,
      errors: []
    };
  }
}

/**
 * Date validator with support for date range constraints
 */
class DateValidator extends Validator {
  constructor() {
    super();
    this.minDate = null;
    this.maxDate = null;
  }

  /**
   * Sets minimum date constraint
   * @param {Date} date - Minimum date
   * @returns {DateValidator} The validator instance for method chaining
   */
  min(date) {
    this.minDate = date;
    return this;
  }

  /**
   * Sets maximum date constraint
   * @param {Date} date - Maximum date
   * @returns {DateValidator} The validator instance for method chaining
   */
  max(date) {
    this.maxDate = date;
    return this;
  }

  /**
   * Internal validation implementation for dates
   * @param {*} value - Value to validate
   * @param {string} path - Path for error reporting
   * @returns {Object} Validation result
   */
  _validate(value, path) {
    const errors = [];
    let dateValue = value;

    // Convert string to Date if needed
    if (typeof value === 'string') {
      dateValue = new Date(value);
    }

    // Check if value is a valid Date
    if (!(dateValue instanceof Date) || isNaN(dateValue.getTime())) {
      return {
        success: false,
        errors: [this.createError(`Expected valid date, got ${typeof value}`, value, path)]
      };
    }

    // Check minimum date
    if (this.minDate && dateValue < this.minDate) {
      errors.push(this.createError(
        `Date must be after ${this.minDate.toISOString()}`,
        value,
        path
      ));
    }

    // Check maximum date
    if (this.maxDate && dateValue > this.maxDate) {
      errors.push(this.createError(
        `Date must be before ${this.maxDate.toISOString()}`,
        value,
        path
      ));
    }

    return {
      success: errors.length === 0,
      value: dateValue,
      errors: errors
    };
  }
}

/**
 * Array validator that validates both the array structure and individual items
 */
class ArrayValidator extends Validator {
  constructor(itemValidator) {
    super();
    this.itemValidator = itemValidator;
    this.minLengthValue = null;
    this.maxLengthValue = null;
  }

  /**
   * Sets minimum array length constraint
   * @param {number} length - Minimum length
   * @returns {ArrayValidator} The validator instance for method chaining
   */
  minLength(length) {
    this.minLengthValue = length;
    return this;
  }

  /**
   * Sets maximum array length constraint
   * @param {number} length - Maximum length
   * @returns {ArrayValidator} The validator instance for method chaining
   */
  maxLength(length) {
    this.maxLengthValue = length;
    return this;
  }

  /**
   * Internal validation implementation for arrays
   * @param {*} value - Value to validate
   * @param {string} path - Path for error reporting
   * @returns {Object} Validation result
   */
  _validate(value, path) {
    const errors = [];

    // Check if value is an array
    if (!Array.isArray(value)) {
      return {
        success: false,
        errors: [this.createError(`Expected array, got ${typeof value}`, value, path)]
      };
    }

    // Check minimum length
    if (this.minLengthValue !== null && value.length < this.minLengthValue) {
      errors.push(this.createError(
        `Array length must be at least ${this.minLengthValue}`,
        value,
        path
      ));
    }

    // Check maximum length
    if (this.maxLengthValue !== null && value.length > this.maxLengthValue) {
      errors.push(this.createError(
        `Array length must be at most ${this.maxLengthValue}`,
        value,
        path
      ));
    }

    // Validate each item in the array
    const validatedItems = [];
    for (let i = 0; i < value.length; i++) {
      const itemPath = path ? `${path}[${i}]` : `[${i}]`;
      const itemResult = this.itemValidator.validate(value[i], itemPath);
      
      if (!itemResult.success) {
        errors.push(...itemResult.errors);
      } else {
        validatedItems.push(itemResult.value);
      }
    }

    return {
      success: errors.length === 0,
      value: validatedItems,
      errors: errors
    };
  }
}

/**
 * Object validator that validates object structure and individual properties
 */
class ObjectValidator extends Validator {
  constructor(schema) {
    super();
    this.schema = schema;
    this.strictMode = false;
  }

  /**
   * Enables strict mode - disallows additional properties not defined in schema
   * @returns {ObjectValidator} The validator instance for method chaining
   */
  strict() {
    this.strictMode = true;
    return this;
  }

  /**
   * Internal validation implementation for objects
   * @param {*} value - Value to validate
   * @param {string} path - Path for error reporting
   * @returns {Object} Validation result
   */
  _validate(value, path) {
    const errors = [];

    // Check if value is an object (and not null or array)
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
      return {
        success: false,
        errors: [this.createError(`Expected object, got ${typeof value}`, value, path)]
      };
    }

    const validatedObject = {};

    // Validate schema properties
    for (const [key, validator] of Object.entries(this.schema)) {
      const propertyPath = path ? `${path}.${key}` : key;
      const propertyValue = value[key];
      
      const result = validator.validate(propertyValue, propertyPath);
      
      if (!result.success) {
        errors.push(...result.errors);
      } else {
        validatedObject[key] = result.value;
      }
    }

    // Check for additional properties in strict mode
    if (this.strictMode) {
      const schemaKeys = Object.keys(this.schema);
      const valueKeys = Object.keys(value);
      const extraKeys = valueKeys.filter(key => !schemaKeys.includes(key));
      
      if (extraKeys.length > 0) {
        errors.push(this.createError(
          `Additional properties not allowed: ${extraKeys.join(', ')}`,
          value,
          path
        ));
      }
    } else {
      // In non-strict mode, preserve additional properties
      for (const [key, val] of Object.entries(value)) {
        if (!(key in this.schema)) {
          validatedObject[key] = val;
        }
      }
    }

    return {
      success: errors.length === 0,
      value: validatedObject,
      errors: errors
    };
  }
}

/**
 * Main Schema class providing static factory methods for creating validators
 * This is the primary interface for the validation library
 */
class Schema {
  /**
   * Creates a string validator
   * @returns {StringValidator} New string validator instance
   */
  static string() {
    return new StringValidator();
  }
  
  /**
   * Creates a number validator
   * @returns {NumberValidator} New number validator instance
   */
  static number() {
    return new NumberValidator();
  }
  
  /**
   * Creates a boolean validator
   * @returns {BooleanValidator} New boolean validator instance
   */
  static boolean() {
    return new BooleanValidator();
  }
  
  /**
   * Creates a date validator
   * @returns {DateValidator} New date validator instance
   */
  static date() {
    return new DateValidator();
  }
  
  /**
   * Creates an object validator with the specified schema
   * @param {Object} schema - Object schema defining property validators
   * @returns {ObjectValidator} New object validator instance
   */
  static object(schema) {
    return new ObjectValidator(schema);
  }
  
  /**
   * Creates an array validator for arrays of the specified item type
   * @param {Validator} itemValidator - Validator for array items
   * @returns {ArrayValidator} New array validator instance
   */
  static array(itemValidator) {
    return new ArrayValidator(itemValidator);
  }
}

// Export for use in other modules and tests
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    Schema,
    Validator,
    StringValidator,
    NumberValidator,
    BooleanValidator,
    DateValidator,
    ArrayValidator,
    ObjectValidator
  };
}

// Example usage and demonstration
if (typeof require === 'undefined' || require.main === module) {
  console.log('=== Data Validation Library Demo ===\n');

  // Define a complex schema for user validation
  const addressSchema = Schema.object({
    street: Schema.string().minLength(1).maxLength(100),
    city: Schema.string().minLength(1).maxLength(50),
    postalCode: Schema.string().pattern(/^\d{5}(-\d{4})?$/).withMessage('Postal code must be in format 12345 or 12345-6789'),
    country: Schema.string().enum(['USA', 'Canada', 'UK', 'Germany', 'France'])
  });

  const userSchema = Schema.object({
    id: Schema.string().minLength(1).withMessage('ID is required'),
    name: Schema.string().minLength(2).maxLength(50),
    email: Schema.string().email().withMessage('Invalid email format'),
    age: Schema.number().min(0).max(150).integer().optional(),
    isActive: Schema.boolean(),
    tags: Schema.array(Schema.string()).minLength(1).maxLength(10),
    address: addressSchema.optional(),
    metadata: Schema.object({}).optional(),
    createdAt: Schema.date().max(new Date()).optional()
  });

  // Test with valid data
  console.log('Testing with valid data:');
  const validUserData = {
    id: "user123",
    name: "John Doe",
    email: "john.doe@example.com",
    age: 30,
    isActive: true,
    tags: ["developer", "javascript"],
    address: {
      street: "123 Main Street",
      city: "Springfield",
      postalCode: "12345",
      country: "USA"
    },
    createdAt: new Date('2023-01-01')
  };

  const validResult = userSchema.validate(validUserData);
  console.log('Valid data result:', {
    success: validResult.success,
    errorsCount: validResult.errors.length
  });

  // Test with invalid data
  console.log('\nTesting with invalid data:');
  const invalidUserData = {
    id: "",
    name: "J",
    email: "invalid-email",
    age: -5,
    isActive: "yes",
    tags: [],
    address: {
      street: "",
      city: "Springfield",
      postalCode: "invalid",
      country: "Mars"
    }
  };

  const invalidResult = userSchema.validate(invalidUserData);
  console.log('Invalid data result:', {
    success: invalidResult.success,
    errorsCount: invalidResult.errors.length
  });

  console.log('\nValidation errors:');
  invalidResult.errors.forEach((error, index) => {
    console.log(`${index + 1}. [${error.path}] ${error.message}`);
  });
}
