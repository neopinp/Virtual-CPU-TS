"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cpu = void 0;
const ASCII_1 = require("./ASCII");
const Hardware_1 = require("./Hardware");
class Cpu extends Hardware_1.Hardware {
    constructor(debug = true) {
        super('Cpu', debug);
        this.pc = 0x0000; // Program Counter
        this.ir = 0x00; // Instruction Register
        this.accumulator = 0x00;
        this.xRegister = 0x00;
        this.yRegister = 0x00;
        this.zFlag = false; // Zero flag for status
        this.carryFlag = false; // Carry flag 
        this.nFlag = false; // Negative flag
        this.operand = 0x0000; // Store operand
        this.step = 0; // Current step in the pipeline
        this.carry = false; // Carry flag
        // toggle logging 
        this.clockLog = true; //toggle
        this.memoryLog = true; //toggle
        this.cpuLog = false; // toggle
        this.log('CPU created', 'cpu');
    }
    setMMU(mmu) {
        this.mmu = mmu;
    }
    updateFlags() {
        this.zFlag = (this.accumulator === 0);
        this.carryFlag = (this.accumulator > 0xFF);
        this.nFlag = ((this.accumulator & 0x80) !== 0);
        if (this.carryFlag) {
            this.accumulator &= 0xFF;
        }
    }
    setInterruptController(controller) {
        this.interruptController = controller;
    }
    pulse() {
        if (this.checkAndHandleInterrupts()) {
            return; // If an interrupt is handled, skip the current cycle
        }
        switch (this.step) {
            case 0:
                this.fetch();
                break;
            case 1:
                this.decode();
                break;
            case 2:
                this.execute();
                break;
            case 3:
                this.writeBack();
                break;
            case 4:
                this.interruptCheck();
                break;
        }
        this.step = (this.step + 1) % 5; // Move to the next step
        this.logState(); // Log the current state for debugging 
    }
    checkAndHandleInterrupts() {
        const interruptDevice = this.interruptController.getHighestPriorityInterrupt();
        if (interruptDevice) {
            this.log(`Interrupt handled by CPU from device: ${interruptDevice.name}`, 'cpu'); // Add the missing second argument 'cpu'
            // Handle the interrupt specific tasks
            return true;
        }
        return false;
    }
    fetch() {
        if (!this.mmu)
            throw new Error("MMU not set.");
        this.ir = this.mmu.read(this.pc++);
        this.log(`Fetched IR: ${this.ir.toString(16)}`, 'cpu'); // Add the missing second argument 'cpu'
    }
    decode() {
        let operandLength = this.getOperandLength(this.ir);
        this.operand = 0;
        if (operandLength == 2) { // Assuming 2-byte operand
            let lowByte = this.mmu.read(this.pc++);
            let highByte = this.mmu.read(this.pc++);
            this.operand = (highByte << 8) | lowByte;
        }
        else if (operandLength == 1) { // Assuming 1-byte operand
            this.operand = this.mmu.read(this.pc++);
        }
    }
    //logs based on type / toggling 
    logState() {
        const zFlagInt = this.zFlag ? 1 : 0;
        //logging console.log("Attempting to log state...");  // Fallback log 
        if (this.cpuLog) {
            this.log(`HW-CPU id:0-${Date.now()}] CPU State|PC:${this.pc.toString()} IR:${this.ir.toString(16)} Acc:${this.accumulator.toString(16)} xReg: ${this.xRegister.toString(16)} yReg: ${this.yRegister.toString(16)} zFlag: ${zFlagInt} Step: ${this.step}`, 'cpu');
        }
        if (this.memoryLog) {
            this.log(`[HW - MMU id: 0 - ${Date.now()}]`, 'memory');
        }
        if (this.clockLog) {
            this.log(`Clock`, 'clock');
        }
    }
    getOperandLength(opcode) {
        switch (opcode) {
            case 0xA9: // LDA Immediate
            case 0xA2: // LDX Immediate
            case 0xA0: // LDY Immediate
            case 0x8D: // STA Absolute
            case 0x8E: // STX Absolute
            case 0x8C: // STY Absolute
            case 0x6D: // ADC Absolute
            case 0xEE: // INC Absolute
            case 0xD0: // BNE
            case 0xFF: // SYS
                return 1; // Operand
            case 0xAD: // LDA Absolute
            case 0xAE: // LDX Absolute
            case 0xAC: // LDY Absolute
                return 2; // 
            case 0x98:
            default:
                return 0; // Only Opcode
        }
    }
    execute() {
        switch (this.ir) {
            case 0xA9: // LDA Immediate
                this.accumulator = this.operand;
                this.zFlag = (this.accumulator === 0);
                // debugging  this.log(`LDA executed. Accumulator now: ${this.accumulator}`, 'cpu'); 
                break;
            case 0xAD: // LDA load from memory
                this.accumulator = this.mmu.read(this.operand);
                this.updateFlags();
                //debugging   this.log(`LDA executed. Accumulator now: ${this.accumulator}`, 'cpu');
                break;
            case 0x8D: // STA Absolute
                this.mmu.write(this.operand, this.accumulator);
                break;
            case 0x98:
                this.accumulator = this.yRegister;
                this.zFlag = (this.accumulator === 0);
                break;
            case 0x6D:
                this.adc(this.operand);
            case 0xA2: // LDX Immediate
                this.xRegister = this.operand;
                this.zFlag = (this.xRegister === 0);
                break;
            case 0xAE: // LDX Absolute
                this.xRegister = this.mmu.read(this.operand);
                this.zFlag = (this.xRegister === 0);
                break;
            case 0xA0: // LDY Immediate
                this.yRegister = this.operand;
                this.zFlag = (this.yRegister === 0);
                break;
            case 0xAC: // LDY Absolute
                this.yRegister = this.mmu.read(this.operand);
                this.zFlag = (this.yRegister === 0);
                break;
            case 0x8E: // STX Absolute
                this.mmu.write(this.operand, this.xRegister);
                break;
            case 0x8C: // STY Absolute
                this.mmu.write(this.operand, this.yRegister);
                break;
            case 0x69: // ADC Absolute
                let value = this.mmu.read(this.operand);
                let result = this.accumulator + value + (this.carryFlag ? 1 : 0);
                this.carryFlag = result > 0xFF;
                this.accumulator = result & 0xFF;
                this.zFlag = (this.accumulator === 0);
                break;
            case 0xEC: // CPX Absolute
                value = this.mmu.read(this.operand);
                result = this.xRegister - value;
                this.carryFlag = (this.xRegister >= value);
                this.zFlag = (result === 0);
                this.carryFlag = ((result & 0x80) !== 0);
                break;
            case 0xD0: // BNE
                if (!this.zFlag) {
                    this.pc += this.signed(this.operand); // Correct branch calculation
                }
                else {
                    this.pc++; // Move to the next instruction if not branching
                }
                break;
            case 0xEE: // INC Absolute
                let memValue = (this.mmu.read(this.operand) + 1) & 0xFF;
                this.mmu.write(this.operand, memValue);
                this.zFlag = (memValue === 0);
                break;
            case 0xEA: // NOP
                this.pc++; // no operation 
                break;
            case 0x00: // BRK
                break;
            case 0xFF: // SYS
                this.handleSysCallWriteBack();
                break;
            default:
                break;
        }
        this.logState();
    }
    adc(address) {
        const memoryValue = this.mmu.read(address);
        let sum = this.accumulator + memoryValue + (this.carryFlag ? 1 : 0);
        this.carryFlag = sum > 0xFF;
        this.accumulator = sum & 0xFF;
        this.zFlag = (this.accumulator === 0);
        this.log(`ADC executed at address ${address.toString(16)}: MemValue=${memoryValue.toString(16)}, Result=${this.accumulator.toString(16)}, Carry=${this.carryFlag}`, 'cpu');
    }
    signed(value) {
        const sign = value & 0x80 ? -1 : 1;
        const absValue = value & 0x7F;
        return sign * absValue;
    }
    writeBack() {
        switch (this.ir) {
            case 0x8D: // STA Absolute
            case 0x8E: // STX Absolute
            case 0x8C: // STY Absolute
                break;
            case 0xA9: // LDA Immediate
                this.accumulator = this.operand; // Confirming the data is written back to the accumulator
                break;
            case 0xA2: // LDX Immediate
                this.xRegister = this.operand;
                break;
            case 0xA0: // LDY Immediate
                this.yRegister = this.operand;
                this.log("Y register updated with immediate value", 'cpu');
                break;
            case 0xFF:
                this.handleSysCallWriteBack();
                break;
        }
    }
    interruptCheck() {
    }
    handleSysCallWriteBack() {
        //logging console.log(`Handling SYS call with xRegister: ${this.xRegister}`);
        switch (this.xRegister) {
            case 0x01: // Print integer from xRegister
                console.log(`Print integer: ${this.yRegister}`);
                break;
            case 0x02: // Print string from memory 
                console.log(`Print string from address: ${this.yRegister}`);
                this.printStringFromMemory(this.yRegister);
                break;
            case 0x03: // Print 0x00 from the operand 
                this.printStringFromMemory(this.operand);
                break;
        }
    }
    printStringFromMemory(address) {
        let result = '';
        let character = this.mmu.read(address);
        while (character !== 0x00) {
            result += ASCII_1.default.byteToChar(character);
            address++;
            character = this.mmu.read(address);
        }
        console.log(`Print string: ${result}`);
    }
    log(message, type) {
        if (!this.debug)
            return;
        switch (type) {
            case 'cpu':
                if (this.cpuLog)
                    console.log(message);
                break;
            case 'memory':
                if (this.memoryLog)
                    console.log(message);
                break;
            case 'clock':
                if (this.clockLog)
                    console.log(message);
                break;
        }
    }
    reset() {
        this.pc = 0x0000; // Reset program counter to start position
        this.accumulator = 0x00; // Reset accumulator
        this.xRegister = 0x00; // Reset X register
        this.yRegister = 0x00; // Reset Y register
        this.ir = 0x00; // Reset instruction register
        this.zFlag = false; // Reset zero flag
        this.carryFlag = false; // Reset carry flag
        this.step = 0; // Reset pipeline step
        console.log("CPU reset.");
    }
    setPC(address) {
        this.pc = address;
        // more logging for debugging console.log(`Program counter set to address: 0x${address.toString(16)}`);
    }
    run() {
        if (!this.mmu) {
            console.log("MMU not initialized.");
            return;
        }
        try {
            while (true) {
                //logging console.log("Running CPU pulse");
                this.pulse(); // Assuming pulse handles one cycle of fetch-decode-execute
                if (this.ir === 0x00) { // Check for BRK instruction
                    // More logging for debugging console.log("BRK - Halt.");
                    break;
                }
            }
        }
        catch (error) {
            console.error("Error", error);
        }
    }
    readMemory(address) {
        if (!this.mmu)
            throw new Error("MMU is not set.");
        return this.mmu.read(address);
    }
    writeMemory(address, data) {
        if (!this.mmu)
            throw new Error("MMU is not set.");
        this.mmu.write(address, data);
    }
}
exports.Cpu = Cpu;
//# sourceMappingURL=Cpu.js.map