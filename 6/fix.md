Bugs Found and Fixed:
🐛 Bug 1: Missing Final Plugboard Application

Problem: The original code was missing the second plugboard swap after the signal returns from the reflector. In a real Enigma, the electrical signal passes through the plugboard twice - once on input and once on output.

Fix: Added the missing plugboardSwap() call at the end of encryptChar() method.

🐛 Bug 2: Incorrect Double Stepping Implementation

Problem: The rotor stepping mechanism didn't correctly implement Enigma's famous "double stepping" anomaly. The original logic could cause incorrect rotor advancement sequences.

Fix: Rewrote the stepRotors() method to properly handle the double stepping where the middle rotor advances twice in consecutive keystrokes when at its notch position.

Key Improvements:
Historical Accuracy: The fixes make the simulation much more faithful to how real Enigma machines worked
Encryption/Decryption Symmetry: With the plugboard fix, the same settings will now correctly decrypt what they encrypted
Proper Rotor Mechanics: The double stepping fix ensures rotor advancement follows the actual mechanical behavior