class Ascii {
    // Converts a character to its corresponding ASCII byte
    static charToByte(char) {
        return char.charCodeAt(0);
    }
    // Converts an ASCII byte to its corresponding character
    static byteToChar(byte) {
        return String.fromCharCode(byte);
    }
}
// Example Usage:
console.log(Ascii.charToByte('A')); // Output: 65
console.log(Ascii.byteToChar(65)); // Output: 'A'
console.log(Ascii.charToByte('a')); // Output: 97
console.log(Ascii.byteToChar(97)); // Output: 'a'
console.log(Ascii.charToByte('0')); // Output: 48
console.log(Ascii.byteToChar(48)); // Output: '0'
console.log(Ascii.charToByte(' ')); // Output: 32
console.log(Ascii.byteToChar(32)); // Output: ' '
console.log(Ascii.charToByte('.')); // Output: 46
console.log(Ascii.byteToChar(46)); // Output: '.'
console.log(Ascii.charToByte('-')); // Output: 45
console.log(Ascii.byteToChar(45)); // Output: '-'
console.log(Ascii.charToByte('!')); // Output: 33
console.log(Ascii.byteToChar(33)); // Output: '!'
console.log(Ascii.charToByte('\n')); // Output: 10
console.log(Ascii.byteToChar(10)); // Output: '\n'
//# sourceMappingURL=Ascii.js.map