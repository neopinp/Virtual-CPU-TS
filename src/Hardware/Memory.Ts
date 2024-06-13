import Ascii from "./ASCII";
import { Hardware } from "./Hardware"; 
import { ClockListener } from "./Imp/ClockListener";

export class Memory extends Hardware implements ClockListener {
    private memory: Uint8Array;
    private mar: number = 0x0000; 
    private mdr: number = 0x00;   
    static Memory: any;

    constructor(debug: boolean = true) {
        super("Memory", debug);
        this.memory = new Uint8Array(65536); // Initialize memory array with 64K size
        this.reset();
        this.log(`Memory initialized with addressable space: ${this.memory.length}`);
    }

    pulse(): void {
        this.log('Received clock pulse');
    }

    public reset(): void {
        this.memory.fill(0x00); 
        this.mar = 0x0000;
        this.mdr = 0x00;
        this.log("Memory and registers reset to default states.");
    }
// read and write 
    public read(address: number): number {
        return this.memory[address];
    }

    public write(address: number, data: number): void {
        if (address >= 0 && address < this.memory.length) {
            this.memory[address] = data;
        } else {
            console.error("Memory write error: Address out of bounds");
        }
    }
    

    public displayMemory(startAddress: number, endAddress: number): void {
        this.log(`Displaying memory from address ${startAddress} to ${endAddress}`);
        for (let address = startAddress; address <= endAddress; address++) {
            if (address < this.memory.length) {
                const data = this.memory[address];
                const charRepresentation = Ascii.byteToChar(data);  // Convert byte to ASCII character
                this.hexAndCharLog(address, data, charRepresentation);  // Log both hex and character representation
            } else {
                this.log(`Address 0x${address.toString(16).toUpperCase()}: Out of bounds`);
            }
        }
    }

    public hexLog(address: number, data?: number): void {
        const hexAddress = address.toString(16).toUpperCase().padStart(4, '0');
        let message = data !== undefined ? 
         `Address: ${hexAddress} contains value: 0x${data.toString(16).toUpperCase().padStart(2, '0')}` : 
         `Address: ${hexAddress} contains value: ERR`;
        this.log(message);
    }


    public hexAndCharLog(address: number, data: number, char: string): void {
        const hexAddress = address.toString(16).toUpperCase().padStart(4, '0');
        const hexData = data.toString(16).toUpperCase().padStart(2, '0');
        const displayChar = char.replace(/[\x00-\x1F]/g, '.'); 
        let message = `Address: ${hexAddress} | Data: ${hexData} ('${displayChar}')`;
        this.log(message);
    }
}
