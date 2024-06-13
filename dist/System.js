"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.System = void 0;
// System.ts
const Cpu_1 = require("./Hardware/Cpu");
const Clock_1 = require("./Hardware/Clock");
const Hardware_1 = require("./Hardware/Hardware");
const MMU_1 = require("./Hardware/MMU");
const InterruptController_1 = require("./Hardware/InterruptController");
const Keyboard_1 = require("./Keyboard");
const Memory_1 = require("./Hardware/Memory");
class System extends Hardware_1.Hardware {
    constructor(debug = true) {
        super('System', debug);
        this.running = false;
        //initializations
        this.memory = new Memory_1.Memory(debug); // memory 
        this.interruptController = new InterruptController_1.InterruptController(debug);
        this.keyboard = new Keyboard_1.Keyboard(debug, this.interruptController); // initalizes keyboard with interrupt controller instance
        this.cpu = new Cpu_1.Cpu(debug); // initalizes CPU without an MMU instance 
        this.cpu.setInterruptController(this.interruptController);
        this.mmu = new MMU_1.MMU(this.memory); // initalizes MMU with Memory instance
        this.cpu.setMMU(this.mmu); // sets MMU instance in CPU
        this.mmu.setCPU(this.cpu); // sets CPU instance in MMU
        this.clock = new Clock_1.Clock(debug); //initalize clock 
        this.clock.registerListener(this.cpu); //register cpu as listener 
        this.clock.registerListener(this.memory); //register memeory as listener 
        this.interruptController.registerDevice(this.keyboard);
        this.log('created');
    }
    startSystem() {
        this.log('System started');
        this.clock.startClock(1000);
        this.running = true;
    }
    stopSystem() {
        this.clock.stopClock();
        this.log('System stopped');
        this.running = false;
    }
    dumpMemory(startAddress, endAddress) {
        this.log(`Dumping memory from address ${startAddress} to ${endAddress}`);
        this.mmu.memoryDump(startAddress, endAddress);
    }
}
exports.System = System;
//# sourceMappingURL=System.js.map