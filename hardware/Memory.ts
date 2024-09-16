import { Hardware } from './Hardware';
import { ClockListener } from './imp/ClockListener';

export class Memory extends Hardware implements ClockListener {
    private mar: number = 0x0000;  // Memory Address Register (16 bits)
    private mdr: number = 0x00;    // Memory Data Register (8 bits)
    private memory: number[];      // Memory Array

    private readonly memSize: number; // Total memory size

    constructor(memSize: number) {
        super(0, 'Memory');
        this.memSize = memSize;
        this.memory = new Array(this.memSize).fill(0x00); // Initialize memory with all elements set to '00'
        this.log(`Created - Addressable space: ${this.memSize}`);
    }

    // Getter and setter for Memory Address Register (MAR)
    getMAR(): number {
        return this.mar;
    }

    setMAR(value: number): void {
        if (value >= 0 && value < this.memSize) {
            this.mar = value;
        }
    }

    // Getter and setter for Memory Data Register (MDR)
    getMDR(): number {
        return this.mdr;
    }

    setMDR(value: number): void {
        if (value >= 0x00 && value <= 0xFF) {
            this.mdr = value;
        }
    }

     read(address: number): number {
    return this.memory[address];
}


    // Public method to write to memory from MDR
    write(address: number, data: number): void {
        this.setMAR(address);
        this.setMDR(data);
        this.memory[this.mar] = this.mdr;
    }


 // Public method to reset memory to all '00' values
    reset(): void {
        this.memory.fill(0x00);
        this.mdr = 0x00;
        this.mar = 0x0000;
    }

    // Public method to display memory contents
    displayMemory(): void {
        for (let address = 0; address < this.memSize; address++) {
            const value = this.memory[address];
            const hexValue = this.hexLog(value, 2);
            this.log(`Address: 0x${this.hexLog(address, 4)} Contains Value: 0x${hexValue}`);
        }
    }

    // Public method to display memory contents within a specified address range
    displayMemoryDump(fromAddress: number, toAddress: number): void {
        this.log('Memory Dump: Debug');
        this.log('--------------------------------------');
        for (let address = fromAddress; address <= toAddress; address++) {
            const value = this.memory[address];
            const hexValue = this.hexLog(value, 2);
            this.log(`Addr ${this.hexLog(address, 4)}: | ${hexValue}`);
        }
        this.log('--------------------------------------');
        this.log('Memory Dump: Complete');
    }
    //pulse() method required by ClockListener
    pulse(): void {
        // Log the received clock pulse
        //this.log('received pulse');
    }
}

