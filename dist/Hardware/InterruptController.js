"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterruptController = void 0;
const Hardware_1 = require("./Hardware");
class InterruptController extends Hardware_1.Hardware {
    constructor(debug = true) {
        super('InterruptController', debug);
        this.interruptQueue = [];
        this.log('Interrupt controller initialized');
    }
    registerDevice(device) {
        this.log(`Device registered: ${device.name}`);
    }
    acceptInterrupt(device) {
        this.log(`Interrupt accepted from: ${device.name}`);
        // Insert the device into the queue based on its priority
        const element = { device, priority: device.priority };
        this.interruptQueue.push(element);
        this.interruptQueue.sort((a, b) => b.priority - a.priority); // Sort descending by priority
    }
    getHighestPriorityInterrupt() {
        const element = this.interruptQueue.shift();
        return element ? element.device : null;
    }
    handleInterrupts() {
        const device = this.getHighestPriorityInterrupt();
        if (device) {
            this.log(`Handling interrupt from: ${device.name}`);
            // Additional logic to handle the specific interrupt
        }
    }
}
exports.InterruptController = InterruptController;
//# sourceMappingURL=InterruptController.js.map