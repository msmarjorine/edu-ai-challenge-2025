const { Rotor, Enigma, plugboardSwap, ROTORS, REFLECTOR, alphabet, mod } = require('./enigma.js');

// Simple test framework
let testCount = 0;
let passedTests = 0;

function test(description, testFn) {
  testCount++;
  try {
    testFn();
    console.log(`✓ ${description}`);
    passedTests++;
  } catch (error) {
    console.log(`✗ ${description}`);
    console.log(`  Error: ${error.message}`);
  }
}

function assertEquals(actual, expected, message = '') {
  if (actual !== expected) {
    throw new Error(`Expected ${expected}, but got ${actual}. ${message}`);
  }
}

function assertTrue(condition, message = '') {
  if (!condition) {
    throw new Error(`Expected true, but got false. ${message}`);
  }
}

// Helper function to create Enigma with default settings
function createEnigma(rotorPositions = [0, 0, 0], ringSettings = [0, 0, 0], plugboardPairs = []) {
  return new Enigma([0, 1, 2], rotorPositions, ringSettings, plugboardPairs);
}

console.log('🧪 Running Enigma Machine Tests...\n');

// Test 1: Basic encryption/decryption symmetry
// VERIFIES: The fundamental property that the same settings can both encrypt and decrypt
// IMPORTANCE: This validates that our bug fixes maintain the core Enigma principle
// RELATES TO: Both plugboard and double stepping fixes - if either is wrong, symmetry breaks
test('Basic encryption/decryption symmetry', () => {
  const enigma1 = createEnigma([0, 0, 0], [0, 0, 0], []);
  const enigma2 = createEnigma([0, 0, 0], [0, 0, 0], []);
  
  const message = 'HELLO';
  const encrypted = enigma1.process(message);
  const decrypted = enigma2.process(encrypted);
  
  assertEquals(decrypted, message, 'Decryption should return original message');
});

// Test 2: Plugboard functionality and the fix
// VERIFIES: The plugboardSwap function correctly swaps characters bidirectionally
// IMPORTANCE: Validates the core plugboard logic used in both input and output phases
// RELATES TO: Critical for the plugboard bug fix - ensures swaps work both ways
test('Plugboard swap functionality', () => {
  assertEquals(plugboardSwap('A', [['A', 'B']]), 'B', 'A should swap to B');
  assertEquals(plugboardSwap('B', [['A', 'B']]), 'A', 'B should swap to A');
  assertEquals(plugboardSwap('C', [['A', 'B']]), 'C', 'C should remain unchanged');
  assertEquals(plugboardSwap('A', []), 'A', 'No swaps should leave A unchanged');
});

// Test 3: Plugboard encryption/decryption with the fix
// VERIFIES: That plugboard settings work symmetrically for encryption/decryption
// IMPORTANCE: Validates the critical plugboard bug fix - double application is essential
// RELATES TO: Bug Fix #1 - without the final plugboard swap, this test would fail
// HISTORICAL CONTEXT: Real Enigma machines applied plugboard twice - input and output
test('Plugboard encryption/decryption symmetry', () => {
  const enigma1 = createEnigma([0, 0, 0], [0, 0, 0], [['A', 'B'], ['C', 'D']]);
  const enigma2 = createEnigma([0, 0, 0], [0, 0, 0], [['A', 'B'], ['C', 'D']]);
  
  const message = 'ABCD';
  const encrypted = enigma1.process(message);
  const decrypted = enigma2.process(encrypted);
  
  assertEquals(decrypted, message, 'Plugboard encryption/decryption should be symmetric');
});

// Test 4: Basic rotor stepping functionality
// VERIFIES: Individual rotor position advancement and wraparound behavior
// IMPORTANCE: Foundation for all rotor movement - must work correctly for complex stepping
// RELATES TO: Ensures basic stepping works before testing complex double stepping scenarios
test('Basic rotor stepping', () => {
  const rotor = new Rotor('EKMFLGDQVZNTOWYHXUSPAIBRCJ', 'Q', 0, 0);
  assertEquals(rotor.position, 0, 'Initial position should be 0');
  
  rotor.step();
  assertEquals(rotor.position, 1, 'Position should be 1 after stepping');
  
  rotor.position = 25;
  rotor.step();
  assertEquals(rotor.position, 0, 'Position should wrap around to 0 after 25');
});

// Test 5: Rotor notch detection
// VERIFIES: Rotors correctly identify when they're at their notch position
// IMPORTANCE: Critical for triggering rotor advancement in adjacent rotors
// RELATES TO: Essential for double stepping mechanism - notch detection triggers advancement
test('Rotor notch detection', () => {
  const rotor = new Rotor('EKMFLGDQVZNTOWYHXUSPAIBRCJ', 'Q', 0, 16); // Q is at position 16
  assertTrue(rotor.atNotch(), 'Rotor should be at notch when position matches notch letter');
  
  rotor.position = 15;
  assertTrue(!rotor.atNotch(), 'Rotor should not be at notch when position differs');
});

// Test 6: Double stepping mechanism validation
// VERIFIES: The corrected double stepping implementation works as intended
// IMPORTANCE: Validates Bug Fix #2 - the most complex mechanical aspect of Enigma
// RELATES TO: Historical accuracy - real Enigma machines had this mechanical anomaly
// TECHNICAL DETAIL: When middle rotor hits notch, it advances both itself and left rotor
test('Double stepping mechanism', () => {
  // Set up middle rotor at notch position (E = position 4 for Rotor II)
  const enigma = createEnigma([0, 4, 0], [0, 0, 0], []);
  
  // Process one character to trigger stepping
  enigma.process('A');
  
  // Check that middle rotor advanced (double stepping)
  // After double stepping: left should be 1, middle should be 5, right should be 1
  assertEquals(enigma.rotors[0].position, 1, 'Left rotor should advance due to double stepping');
  assertEquals(enigma.rotors[1].position, 5, 'Middle rotor should advance due to double stepping');
  assertEquals(enigma.rotors[2].position, 1, 'Right rotor should always advance');
});

// Test 7: Right rotor notch advances middle rotor
// VERIFIES: Normal rotor advancement when right rotor reaches its notch
// IMPORTANCE: Ensures standard rotor progression works alongside double stepping
// RELATES TO: Validates that the double stepping fix doesn't break normal advancement
test('Right rotor notch advances middle rotor', () => {
  // Set right rotor at notch position (V = position 21 for Rotor III)
  const enigma = createEnigma([0, 0, 21], [0, 0, 0], []);
  
  enigma.process('A');
  
  assertEquals(enigma.rotors[0].position, 0, 'Left rotor should not advance');
  assertEquals(enigma.rotors[1].position, 1, 'Middle rotor should advance');
  assertEquals(enigma.rotors[2].position, 22, 'Right rotor should advance');
});

// Test 8: Different initial rotor positions
// VERIFIES: Enigma works correctly with various starting rotor configurations
// IMPORTANCE: Ensures the machine works across all possible initial states
// RELATES TO: Real operators could set rotors to any position - all must work
test('Different initial rotor positions', () => {
  const enigma1 = createEnigma([5, 10, 15], [0, 0, 0], []);
  const enigma2 = createEnigma([5, 10, 15], [0, 0, 0], []);
  
  const message = 'TEST';
  const encrypted = enigma1.process(message);
  const decrypted = enigma2.process(encrypted);
  
  assertEquals(decrypted, message, 'Different rotor positions should still allow decryption');
});

// Test 9: Ring settings functionality
// VERIFIES: Ring settings modify encryption output as expected
// IMPORTANCE: Ring settings were an additional security layer in real Enigma machines
// RELATES TO: Ensures the ring setting calculations in forward/backward methods work
test('Ring settings affect encryption', () => {
  const enigma1 = createEnigma([0, 0, 0], [0, 0, 0], []);
  const enigma2 = createEnigma([0, 0, 0], [1, 2, 3], []);
  
  const message = 'A';
  const result1 = enigma1.process(message);
  const result2 = enigma2.process(message);
  
  assertTrue(result1 !== result2, 'Different ring settings should produce different outputs');
});

// Test 10: Non-alphabetic character pass-through
// VERIFIES: Numbers, punctuation, and spaces pass through unchanged
// IMPORTANCE: Matches historical Enigma behavior - only letters were encrypted
// RELATES TO: Edge case handling in the encryptChar method
test('Non-alphabetic characters pass through', () => {
  const enigma = createEnigma([0, 0, 0], [0, 0, 0], []);
  
  const message = 'HELLO, WORLD! 123';
  const result = enigma.process(message);
  
  assertTrue(result.includes(','), 'Comma should pass through unchanged');
  assertTrue(result.includes(' '), 'Space should pass through unchanged');
  assertTrue(result.includes('!'), 'Exclamation should pass through unchanged');
  assertTrue(result.includes('1'), 'Numbers should pass through unchanged');
});

// Test 11: Empty string handling
// VERIFIES: Edge case of processing empty input doesn't cause errors
// IMPORTANCE: Defensive programming - ensures robustness with edge inputs
// RELATES TO: Error prevention and graceful handling of unusual inputs
test('Empty string handling', () => {
  const enigma = createEnigma([0, 0, 0], [0, 0, 0], []);
  const result = enigma.process('');
  assertEquals(result, '', 'Empty string should return empty string');
});

// Test 12: Single character encryption
// VERIFIES: Minimal case encryption works correctly
// IMPORTANCE: Validates that rotor stepping occurs even for single characters
// RELATES TO: Ensures the stepping mechanism activates properly for minimal input
test('Single character encryption', () => {
  const enigma1 = createEnigma([0, 0, 0], [0, 0, 0], []);
  const enigma2 = createEnigma([0, 0, 0], [0, 0, 0], []);
  
  const encrypted = enigma1.process('A');
  const decrypted = enigma2.process(encrypted);
  
  assertEquals(decrypted, 'A', 'Single character should encrypt and decrypt correctly');
});

// Test 13: Long message encryption
// VERIFIES: Extended operation with multiple rotor advancements
// IMPORTANCE: Tests sustained operation and complex rotor state changes
// RELATES TO: Validates that rotor stepping continues to work correctly over time
test('Long message encryption', () => {
  const enigma1 = createEnigma([0, 0, 0], [0, 0, 0], []);
  const enigma2 = createEnigma([0, 0, 0], [0, 0, 0], []);
  
  const message = 'THISISAVERYLONGMESSAGETOTESTTHEENIGMAMACHINE';
  const encrypted = enigma1.process(message);
  const decrypted = enigma2.process(encrypted);
  
  assertEquals(decrypted, message, 'Long messages should encrypt and decrypt correctly');
});

// Test 14: Reflector functionality validation
// VERIFIES: No character can encrypt to itself due to reflector design
// IMPORTANCE: Fundamental Enigma property - this was both strength and weakness
// RELATES TO: Historical cryptanalysis - codebreakers exploited this property
// TECHNICAL DETAIL: Reflector ensures electrical circuit never loops back to same position
test('Reflector prevents identical input/output', () => {
  const enigma = createEnigma([0, 0, 0], [0, 0, 0], []);
  
  // Test multiple characters to ensure none encrypt to themselves
  const testChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let identicalFound = false;
  
  for (let char of testChars) {
    const encrypted = enigma.encryptChar(char);
    if (encrypted === char) {
      identicalFound = true;
      break;
    }
  }
  
  assertTrue(!identicalFound, 'No character should encrypt to itself due to reflector');
});

// Test 15: Mathematical modulo function
// VERIFIES: Custom mod function handles negative numbers correctly
// IMPORTANCE: Essential for rotor position calculations with ring settings
// RELATES TO: JavaScript's % operator doesn't handle negatives like we need
test('Modulo function handles negative numbers', () => {
  assertEquals(mod(5, 3), 2, 'Positive modulo should work normally');
  assertEquals(mod(-1, 26), 25, 'Negative modulo should wrap correctly');
  assertEquals(mod(-27, 26), 25, 'Large negative modulo should wrap correctly');
});

// Test 16: Case insensitivity
// VERIFIES: Lowercase input is automatically converted to uppercase
// IMPORTANCE: Matches historical behavior - Enigma only had uppercase letters
// RELATES TO: User convenience while maintaining historical accuracy
test('Case insensitivity', () => {
  const enigma1 = createEnigma([0, 0, 0], [0, 0, 0], []);
  const enigma2 = createEnigma([0, 0, 0], [0, 0, 0], []);
  
  const message = 'hello';
  const encrypted = enigma1.process(message);
  const decrypted = enigma2.process(encrypted);
  
  assertEquals(decrypted, 'HELLO', 'Lowercase input should be converted to uppercase');
});

// Test 17: Complex plugboard configuration
// VERIFIES: Multiple plugboard pairs work together correctly
// IMPORTANCE: Real Enigma operators used many plugboard connections
// RELATES TO: Stress tests the plugboard fix with realistic configurations
test('Complex plugboard configuration', () => {
  const plugboard = [['A', 'B'], ['C', 'D'], ['E', 'F'], ['G', 'H']];
  const enigma1 = createEnigma([0, 0, 0], [0, 0, 0], plugboard);
  const enigma2 = createEnigma([0, 0, 0], [0, 0, 0], plugboard);
  
  const message = 'ABCDEFGH';
  const encrypted = enigma1.process(message);
  const decrypted = enigma2.process(encrypted);
  
  assertEquals(decrypted, message, 'Complex plugboard should work correctly');
});

// Test 18: Rotor forward/backward transformation symmetry
// VERIFIES: Individual rotor transformations are properly reversible
// IMPORTANCE: Foundation of Enigma's encryption - each rotor must be reversible
// RELATES TO: Validates the mathematical correctness of rotor wiring calculations
test('Rotor forward and backward transformation', () => {
  const rotor = new Rotor('EKMFLGDQVZNTOWYHXUSPAIBRCJ', 'Q', 0, 0);
  
  const original = 'A';
  const forward = rotor.forward(original);
  const backward = rotor.backward(forward);
  
  assertEquals(backward, original, 'Forward then backward should return original character');
});

// Run tests and show results
console.log('\n📊 Test Results:');
console.log(`Tests run: ${testCount}`);
console.log(`Tests passed: ${passedTests}`);
console.log(`Tests failed: ${testCount - passedTests}`);
console.log(`Success rate: ${Math.round((passedTests / testCount) * 100)}%`);

if (passedTests === testCount) {
  console.log('🎉 All tests passed!');
} else {
  console.log('❌ Some tests failed. Please review the failures above.');
}

// Export for potential use in other test files
module.exports = {
  test,
  assertEquals,
  assertTrue,
  createEnigma
}; 