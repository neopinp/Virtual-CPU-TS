"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Memory = void 0;
const ASCII_1 = require("./ASCII");
const Hardware_1 = require("./Hardware");
class Memory extends Hardware_1.Hardware {
    constructor(debug = true) {
        super("Memory", debug);
        this.mar = 0x0000;
        this.mdr = 0x00;
        this.memory = new Uint8Array(65536); // Initialize memory array with 64K size
        this.reset();
        this.log(`Memory initialized with addressable space: ${this.memory.length}`);
    }
    pulse() {
        this.log('Received clock pulse');
    }
    reset() {
        this.memory.fill(0x00);
        this.mar = 0x0000;
        this.mdr = 0x00;
        this.log("Memory and registers reset to default states.");
    }
    // read and write 
    read(address) {
        return this.memory[address];
    }
    write(address, data) {
        if (address >= 0 && address < this.memory.length) {
            this.memory[address] = data;
        }
        else {
            console.error("Memory write error: Address out of bounds");
        }
    }
    displayMemory(startAddress, endAddress) {
        this.log(`Displaying memory from address ${startAddress} to ${endAddress}`);
        for (let address = startAddress; address <= endAddress; address++) {
            if (address < this.memory.length) {
                const data = this.memory[address];
                const charRepresentation = ASCII_1.default.byteToChar(data); // Convert byte to ASCII character
                this.hexAndCharLog(address, data, charRepresentation); // Log both hex and character representation
            }
            else {
                this.log(`Address 0x${address.toString(16).toUpperCase()}: Out of bounds`);
            }
        }
    }
    hexLog(address, data) {
        const hexAddress = address.toString(16).toUpperCase().padStart(4, '0');
        let message = data !== undefined ?
            `Address: ${hexAddress} contains value: 0x${data.toString(16).toUpperCase().padStart(2, '0')}` :
            `Address: ${hexAddress} contains value: ERR`;
        this.log(message);
    }
    hexAndCharLog(address, data, char) {
        const hexAddress = address.toString(16).toUpperCase().padStart(4, '0');
        const hexData = data.toString(16).toUpperCase().padStart(2, '0');
        const displayChar = char.replace(/[\x00-\x1F]/g, '.'); // Replace non-printable characters with '.'
        let message = `Address: ${hexAddress} | Data: ${hexData} ('${displayChar}')`;
        this.log(message);
    }
}
exports.Memory = Memory;
//# sourceMappingURL=Memory.js.map