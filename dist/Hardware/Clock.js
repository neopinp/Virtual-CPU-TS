"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Clock = void 0;
// Clock.ts
const Hardware_1 = require("./Hardware");
//registers listeners (Cpu,Memory)
class Clock extends Hardware_1.Hardware {
    constructor(debug = true) {
        super('Clock', debug);
        this.listeners = [];
        this.log('created');
    }
    // k
    registerListener(listener) {
        this.listeners.push(listener);
    }
    //starts the clock that calls the tick() method 
    startClock(interval) {
        this.log('Clock Pulse Initialized'); //log start 
        this.intervalId = setInterval(() => this.tick(), interval);
    }
    // Clears interval set and stops clock 
    stopClock() {
        if (this.intervalId !== undefined)
            clearInterval(this.intervalId);
    }
    tick() {
        this.listeners.forEach(listener => listener.pulse());
    }
}
exports.Clock = Clock;
//# sourceMappingURL=Clock.js.map