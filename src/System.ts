// System.ts
import { Cpu } from "./Hardware/Cpu";
import { Clock } from "./Hardware/Clock";
import { Hardware } from "./Hardware/Hardware";
import { MMU } from "./Hardware/MMU";
import { InterruptController } from "./Hardware/InterruptController";
import { Keyboard } from "./Keyboard";
import { Memory } from "./Hardware/Memory";


export class System extends Hardware {
  private cpu: Cpu; 
  private memory: Memory;
  private clock: Clock;
  public mmu: MMU;
  public running: boolean = false;
  private interruptController: InterruptController;
  private keyboard: Keyboard;
  

  constructor(debug: boolean = true) {
    super('System', debug);

//initializations
    this.memory = new Memory(debug); // memory 
    this.interruptController = new InterruptController(debug);
    this.keyboard = new Keyboard(debug, this.interruptController); // initliaze keyboard
    this.cpu = new Cpu(debug); // initalizes CPU 
    this.cpu.setInterruptController(this.interruptController);

        this.mmu = new MMU(this.memory); // initalizes MMU with Memory instance

    this.cpu.setMMU(this.mmu);  // sets MMU instance in CPU
    this.mmu.setCPU(this.cpu); // sets CPU instance in MMU

    this.clock = new Clock(debug); //initalize clock 
    this.clock.registerListener(this.cpu); //register cpu as listener 
    this.clock.registerListener(this.memory); //register memeory as listener 

    this.interruptController.registerDevice(this.keyboard);

    this.log('created');
  }

  public startSystem(): void {
    this.log('System started');
    this.clock.startClock(1000); 
    this.running = true;
  }

  public stopSystem(): void {
    this.clock.stopClock();
    this.log('System stopped');
    this.running = false;
  }

  public dumpMemory(startAddress: number, endAddress: number): void {
    this.log(`Dumping memory from address ${startAddress} to ${endAddress}`);
    this.mmu.memoryDump(startAddress, endAddress); 
  }
}
