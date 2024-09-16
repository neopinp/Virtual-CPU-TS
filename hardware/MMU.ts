import { Memory } from './Memory';
import { Hardware } from './Hardware';

export class MMU extends Hardware {
    private memory: Memory;

    constructor(memory: Memory) {
        super(0, 'MMU');
        this.memory = memory;
    }

    // Method to set the MAR from a 16-bit address
    setMARFromAddress(address: number): void {
        this.memory.setMAR(address);
    }

    // Method to set the MAR from two single bytes in little-endian format
    setMARFromLittleEndian(byte1: number, byte2: number): void {
        const address = (byte2 << 8) | byte1;
        this.memory.setMAR(address);
    }



    readMemory(address: number): number {
    	return this.memory.read(address);
    }


    // Method to write data to memory
    writeMemory(address: number, data: number): void {
      this.memory.write(address, data);
    }

    // Method to load a "static" program into memory
    writeImmediate(address: number, data: number): void {
        this.memory.setMAR(address);
        this.memory.setMDR(data);
        this.memory.write(address,data);
    }


    // Method to display memory contents within a specified address range
    displayMemoryDump(fromAddress: number, toAddress: number): void {
        this.memory.displayMemoryDump(fromAddress, toAddress);
    }


    loadAndDisplayStaticProgram(): void {
        // Load the static program into memory using the writeImmediate method
        this.writeImmediate(0x0000, 0xA9);
        this.writeImmediate(0x0001, 0x02);
        this.writeImmediate(0x0002, 0x8D);
        this.writeImmediate(0x0003, 0x10);
        this.writeImmediate(0x0004, 0x00);
        this.writeImmediate(0x0005, 0x6D);
        this.writeImmediate(0x0006, 0x10);
        this.writeImmediate(0x0007, 0x00);
        this.writeImmediate(0x0008, 0xA2);
        this.writeImmediate(0x0009, 0x01);
        this.writeImmediate(0x000A, 0xA8);
        this.writeImmediate(0x000B, 0xFF);
        this.writeImmediate(0x000C, 0x00);
	this.writeImmediate(0x000D, 0x00);
	this.writeImmediate(0x000E, 0x00);
	this.writeImmediate(0x000F, 0x00);
	this.writeImmediate(0x0010, 0x00);
	this.writeImmediate(0x0011, 0x00);
	this.writeImmediate(0x0012, 0x00);
	this.writeImmediate(0x0013, 0x00);
	this.writeImmediate(0x0014, 0x00);
	this.writeImmediate(0x0015, 0x00);





        // Display the memory contents within the specified address range
        this.displayMemoryDump(0x0000, 0x0015);
    }
}
