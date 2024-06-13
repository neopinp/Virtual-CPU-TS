"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Keyboard = void 0;
const ASCII_1 = require("./Hardware/ASCII");
const Hardware_1 = require("./Hardware/Hardware");
class Keyboard extends Hardware_1.Hardware {
    constructor(debug, interruptController) {
        super('Keyboard', debug);
        this.interruptController = interruptController;
        this.inputBuffer = [];
        this.outputBuffer = [];
        this.irq = 1; // Define appropriate IRQ number
        this.priority = 1; // Define appropriate priority
        this.monitorKeys();
    }
    monitorKeys() {
        const stdin = process.stdin;
        stdin.setRawMode(true);
        stdin.resume();
        stdin.setEncoding('utf8');
        stdin.on('data', (key) => {
            let keyPressed = ASCII_1.default.byteToChar(key[0]);
            this.log(`Key pressed - ${keyPressed}`);
            if (key.toString() === '\u0003') { // Compare string representations
                process.exit();
            }
            this.outputBuffer.push(keyPressed);
            this.interruptController.acceptInterrupt(this);
        });
    }
    generateInterrupt() {
        if (this.outputBuffer.length > 0) {
            this.interruptController.acceptInterrupt(this);
        }
    }
}
exports.Keyboard = Keyboard;
//# sourceMappingURL=Keyboard.js.map