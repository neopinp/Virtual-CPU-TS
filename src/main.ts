import { System } from "./System";

const system = new System(true); 

// Load the static program into memory.
system.mmu.writeImmediate(0x0000, 0x01);

// Perform a memory dump immediately after 
console.log("Performing memory dump...");
system.dumpMemory(0x0000, 0x000F); 

// Start the system
system.startSystem();

// After a delay, stop the system.
setTimeout(() => {
    system.stopSystem();
}, 10000); 
