"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MMU = void 0;
class MMU {
    constructor(memory) {
        this.cpu = null; // Initialize as null to be set later
        this.memory = memory;
    }
    setCPU(cpu) {
        this.cpu = cpu;
    }
    // read method 
    read(address) {
        const value = this.memory.read(address);
        //logging console.log(`MMU read: Address ${address.toString(16)} = ${value.toString(16)}`);
        return value;
    }
    // write method 
    write(address, data) {
        //logging console.log(`MMU write: Address ${address.toString(16)} = ${data.toString(16)}`);
        this.memory.write(address, data);
    }
    getAddressFromParts(lowByte, highByte) {
        return (highByte << 8) | lowByte;
    }
    //indirect addressing 
    readIndirect(address) {
        const lowByte = this.read(address);
        const highByte = this.read(address + 1);
        const fullAddress = this.getAddressFromParts(lowByte, highByte);
        return this.read(fullAddress);
    }
    writeIndirect(address, data) {
        const lowByte = this.read(address);
        const highByte = this.read(address + 1);
        const fullAddress = this.getAddressFromParts(lowByte, highByte);
        this.write(fullAddress, data);
    }
    setLowOrderByte(address, lowByte) {
        this.write(address, lowByte);
    }
    //get address in two parts 
    setHighOrderByte(address, highByte) {
        this.write(address + 1, highByte);
    }
    writeImmediate(address, data) {
        // logging console.log(`Writing to address ${address.toString(16)}: ${data.toString(16)}`);        
        this.write(address, data);
    }
    // dump memory contents 
    memoryDump(startAddress, endAddress) {
        console.log(`[HW - MMU id: 0 - ${Date.now()}]: Memory Dump: Debug`);
        console.log(`[HW - MMU id: 0 - ${Date.now()}]: --------------------------------------`);
        for (let address = startAddress; address <= endAddress; address++) {
            const data = this.read(address);
            console.log(`[HW - MMU id: 0 - ${Date.now()}]: Addr ${address.toString(16).padStart(4, '0')}: | ${data.toString(16).toUpperCase()}`);
        }
        console.log(`[HW - MMU id: 0 - ${Date.now()}]: --------------------------------------`);
        console.log(`[HW - MMU id: 0 - ${Date.now()}]: Memory Dump: Complete`);
    }
}
exports.MMU = MMU;
//# sourceMappingURL=MMU.js.map