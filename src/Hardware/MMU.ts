// MMU.ts
import { Memory } from "./Memory";
import { Cpu } from "./Cpu";

export class MMU {
    private memory: Memory;
    private cpu: Cpu | null = null; 

    constructor(memory: Memory) {
        this.memory = memory;
    }

    public setCPU(cpu: Cpu): void {
        this.cpu = cpu;
    }

    // read method 

    public read(address: number): number {
        const value = this.memory.read(address);
        //logging console.log(`MMU read: Address ${address.toString(16)} = ${value.toString(16)}`);
        return value;
    }

    // write method 
    public write(address: number, data: number): void {
        //logging console.log(`MMU write: Address ${address.toString(16)} = ${data.toString(16)}`);
        this.memory.write(address, data);
    }

    public getAddressFromParts(lowByte: number, highByte: number): number {
        return (highByte << 8) | lowByte;
    }

    //indirect addressing 
    public readIndirect(address: number): number {
        const lowByte = this.read(address);
        const highByte = this.read(address + 1);
        const fullAddress = this.getAddressFromParts(lowByte, highByte);
        return this.read(fullAddress);
    }

    public writeIndirect(address: number, data: number): void {
        const lowByte = this.read(address);
        const highByte = this.read(address + 1);
        const fullAddress = this.getAddressFromParts(lowByte, highByte);
        this.write(fullAddress, data);
    }

    public setLowOrderByte(address: number, lowByte: number): void {
        this.write(address, lowByte);
    }
//get address in two parts 
    public setHighOrderByte(address: number, highByte: number): void {
        this.write(address + 1, highByte);
    }

    public writeImmediate(address: number, data: number): void {
        // logging console.log(`Writing to address ${address.toString(16)}: ${data.toString(16)}`);        
        this.write(address, data);
    }


    // dump memory contents 
    public memoryDump(startAddress: number, endAddress: number): void {
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