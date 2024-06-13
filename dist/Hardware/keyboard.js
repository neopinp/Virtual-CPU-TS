"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Keyboard {
    constructor(name, irq, priority, outputBuffer, interruptController) {
        this.name = name;
        this.irq = irq;
        this.priority = priority;
        this.outputBuffer = outputBuffer;
        this.interruptController = interruptController;
    }
    triggerInterrupt() {
        this.interruptController.acceptInterrupt(this);
    }
    // Method to monitor keys and trigger interrupts
    monitorKeys() {
    }
}
exports.default = Keyboard;
//# sourceMappingURL=keyboard.js.map