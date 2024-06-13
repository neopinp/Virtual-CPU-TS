"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hardware = void 0;
// hardware.ts
class Hardware {
    constructor(name, debug = true) {
        this.id = Hardware.nextId++;
        this.name = name;
        this.debug = debug;
    }
    //logs message if debugging is enabled 
    log(message, type) {
        if (this.debug) {
            const timestamp = Date.now();
            console.log(`[HW - ${this.name} id: ${this.id} - ${timestamp}]: ${message}`);
        }
    }
    hexLog(address, data, addressLength = 4, dataLength = 2) {
        const hexAddress = address.toString(16).toUpperCase().padStart(addressLength, '0');
        let message = `Address: ${hexAddress}`;
        if (data !== undefined) {
            const hexData = data.toString(16).toUpperCase().padStart(dataLength, '0');
            message += ` Contains Value: ${hexData}`;
        }
        if (this.debug) {
            console.log(`[HW - ${this.name} id: ${this.id}]: ${message}`);
        }
    }
}
exports.Hardware = Hardware;
Hardware.nextId = 0; //unique ID 
//# sourceMappingURL=Hardware.js.map