import { Cpu } from './Cpu';
import { MMU } from './MMU';
import { Memory } from './Memory';

const memory = new Memory(true); 
const mmu = new MMU(memory); 
const cpu = new Cpu(); 
cpu.setMMU(mmu);



class CPU {
    accumulator: any;

    writeImmediate(address: number, data: number): void {
        console.log(`Writing to address ${address.toString(16)}: ${data.toString(16)}`);        
        mmu.write(address, data);
    }

    powersProgram() {
        mmu.writeImmediate(0x0000, 0xA9);
        mmu.writeImmediate(0x0000, 0xA9);
        mmu.writeImmediate(0x0002, 0x8D);
        mmu.writeImmediate(0x0003, 0x40);
        mmu.writeImmediate(0x0004, 0x00);
        mmu.writeImmediate(0x0005, 0xA9);
        mmu.writeImmediate(0x0006, 0x01);
        mmu.writeImmediate(0x0007, 0x6D);
        mmu.writeImmediate(0x0008, 0x40);
        mmu.writeImmediate(0x0009, 0x00);
        mmu.writeImmediate(0x000A, 0x8D);
        mmu.writeImmediate(0x000B, 0x40);
        mmu.writeImmediate(0x000C, 0x00);
        mmu.writeImmediate(0x000D, 0xAC);
        mmu.writeImmediate(0x000E, 0x40);   
        mmu.writeImmediate(0x000F, 0x00);
        mmu.writeImmediate(0x0010, 0xA2);
        mmu.writeImmediate(0x0011, 0x01);
        mmu.writeImmediate(0x0012, 0xFF);
        mmu.writeImmediate(0x0013, 0xA2);
        mmu.writeImmediate(0x0014, 0x03);
        mmu.writeImmediate(0x0015, 0xFF);
        mmu.writeImmediate(0x0018, 0xD0);
        mmu.writeImmediate(0x0019, 0xED);
        mmu.writeImmediate(0x0050, 0x2C);
        mmu.writeImmediate(0x0052, 0x00);

    }

    runProgram() {
        this.powersProgram();

        // Set the program counter to the start of the program
        cpu.setPC(0x0000);

        // Run the CPU
        cpu.run();

        // Output the final state of the CPU and memory
        console.log(`Final Accumulator Value: 0x${this.accumulator.toString(16)}`);
        mmu.memoryDump(0x0000, 0x001A);
        console.log("---------------------------");
        mmu.memoryDump(0x0050, 0x0053);
    }
}
/* AD LDA MEMORY
const program = [
    { address: 0x0000, data: 0xAD }, // LDA Absolute opcode
    { address: 0x0001, data: 0x06 }, // Low byte of the memory address to load from
    { address: 0x0002, data: 0x00 }, // High byte of the memory address to load from
    { address: 0x0003, data: 0x00 }, // BRK opcode to stop execution
    { address: 0x0006, data: 0x07 }  // Value at memory address 0x0006 to load into the accumulator
];

// 8D STA MEMORY

const program = [
    { address: 0x0000, data: 0xA9 }, // LDA Immediate opcode
    { address: 0x0001, data: 0x07 }, // Value to load into the accumulator
    { address: 0x0002, data: 0x8D }, // STA Absolute opcode
    { address: 0x0003, data: 0x06 }, // Low byte of the memory address to store to
    { address: 0x0004, data: 0x00 }, // High byte of the memory address to store to
    { address: 0x0005, data: 0x00 }  // BRK opcode to stop execution
];

//TESTING 8A 
const program = [
    { address: 0x0000, data: 0xA2 }, // LDX Immediate opcode
    { address: 0x0001, data: 0x07 }, // Value to load into the X register
    { address: 0x0002, data: 0x8A }, // TXA opcode
    { address: 0x0003, data: 0x00 }  // BRK opcode to stop execution
];



TESING 98 
const program = [
    0xA0, 0x07,  // LDY #$07
    0x98,        // TYA
    0x00         // BRK
];


TESTING 6D 
const program = [
    { address: 0x0000, data: 0x05 }, // Value 0x05 at memory address 0x0000
    { address: 0x0001, data: 0x07 }, // Value 0x07 at memory address 0x0001
    { address: 0x0002, data: 0x6D }, // ADC Absolute opcode
    { address: 0x0003, data: 0x00 }, // Low byte of the address
    { address: 0x0004, data: 0x00 }, // High byte of the address
    { address: 0x0005, data: 0x00 }  // BRK opcode to stop execution
];
TESTING A2
const program = [
    { address: 0x0000, data: 0xA2 }, // LDX Immediate opcode
    { address: 0x0001, data: 0x07 }, // Value to load into the X register
    { address: 0x0002, data: 0x00 }  // BRK opcode to stop execution
];




const program = [
    { address: 0x0000, data: 0xA0 }, // LDY Immediate opcode
    { address: 0x0001, data: 0x07 }, // Value to load into the Y register
    { address: 0x0002, data: 0x00 }  // BRK opcode to stop execution
];


TESTING AC
const program = [
    { address: 0x0000, data: 0xAC }, // LDY Absolute opcode
    { address: 0x0001, data: 0x05 }, // Low byte of the memory address
    { address: 0x0002, data: 0x00 }, // High byte of the memory address
    { address: 0x0003, data: 0x00 }, // BRK opcode to stop execution
    { address: 0x0005, data: 0x07 }  // Value to load into the Y register
];
TESTING A8 
const program = [
    { address: 0x0000, data: 0xA9 }, // LDA Immediate opcode
    { address: 0x0001, data: 0x07 }, // Value to load into the accumulator
    { address: 0x0002, data: 0xA8 }, // TAY opcode
    { address: 0x0003, data: 0x00 }  // BRK opcode to stop execution
];

TESTING EA
const program = [
    { address: 0x0000, data: 0xEA }, // NOP opcode
    { address: 0x0001, data: 0x00 }  // BRK opcode to stop execution
];

TESTING D0

const program = [
    { address: 0x0000, data: 0xA9 }, // LDA Immediate opcode
    { address: 0x0001, data: 0x01 }, // Value to load into the accumulator
    { address: 0x0002, data: 0xD0 }, // BNE opcode
    { address: 0x0003, data: 0x01 }, // Relative address to branch to if zero flag is clear
    { address: 0x0004, data: 0x00 } // BRK opcode to stop execution
];
cpu.setPC(0x0000);
cpu.run();
// Output the CPU state after execution to verify the results
console.log(`Final X Register Value: 0x${cpu.xRegister.toString(16)}`);
console.log(`Zero Flag: ${cpu.zFlag}`);
console.log(`Carry Flag: ${cpu.carryFlag}`);
console.log(`Negative Flag: ${cpu.nFlag}`);
mmu.memoryDump(0x0000, 0x000A); 

TESTING D0 - BNE 
const program = [
    { address: 0x0000, data: 0xEE }, // INC Absolute
    { address: 0x0001, data: 0x02 }, // Low byte of address
    { address: 0x0002, data: 0x00 }, // High byte of address
    { address: 0x0003, data: 0x00 }  // BRK (end of program)
];

// Load program into memory
program.forEach(({ address, data }) => {
    mmu.writeImmediate(address, data);
});

// Set a value at address 0x0002
mmu.writeImmediate(0x0002, 0x10);

// Run the CPU
cpu.setPC(0x0000);
cpu.run();

// Output the CPU state after execution to verify the results
console.log(`Final Accumulator Value: 0x${cpu.accumulator.toString(16)}`);
console.log(`Zero Flag: ${cpu.zFlag}`);
console.log(`Carry Flag: ${cpu.carryFlag}`);
console.log(`Negative Flag: ${cpu.nFlag}`);
mmu.memoryDump(0x0000, 0x000A); // Dump memory from 0x0000 to 0x000A

const program = [
    { address: 0x0000, data: 0xFF }, // FF system call
    { address: 0x0001, data: 0x02 }, // Operand for case 2
    { address: 0x0002, data: 0x00 } // BRK (end of program)
];

program.forEach(({ address, data }) => {
    mmu.writeImmediate(address, data);
});

cpu.setPC(0x0000);
cpu.run();

console.log(`Final Accumulator Value: 0x${cpu.accumulator.toString(16)}`);
mmu.memoryDump(0x0000, 0x000A); // Dump memory from 0x0000 to 0x000A
*/

