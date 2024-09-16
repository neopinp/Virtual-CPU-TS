export class Ascii {
  // Convert character to ASCII byte
  static charToByte(char: string): number {
    return char.charCodeAt(0);
  }

  // Convert ASCII byte to character
  static byteToChar(byte: number): string {
    return String.fromCharCode(byte);
  }
}//test


// Convert character to byte
const byteValue = Ascii.charToByte('A');
console.log(`Byte value for 'A': ${byteValue}`);

// Convert byte to character
const charValue = Ascii.byteToChar(65);
console.log(`Character for byte value 65: ${charValue}`);
