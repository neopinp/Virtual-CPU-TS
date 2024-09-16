import { Cpu } from "./hardware/Cpu";
import { Memory } from "./hardware/Memory";
import { Hardware } from './hardware/Hardware';
import { Clock } from './hardware/Clock'
import { ClockListener } from './hardware/imp/ClockListener'
import { MMU } from './hardware/MMU';


/*
    Constants
 */
// Initialization Parameters for Hardware
// Clock cycle interval
const CLOCK_INTERVAL = 500; // This is in ms (milliseconds) so 1000 = 1 second, 100 = 1/10 second
                          // A setting of 100 is equivalent to 10hz, 1 would be 1,000hz or 1khz,
                          // .001 would be 1,000,000 or 1mhz. Obviously you will want to keep this
                          // small, I recommend a setting of 100, if you want to slow things down
                          // make it larger.//testing

export class System extends Hardware implements ClockListener {
    private _CPU: Cpu = null;
    private _Memory: Memory = null;
    private _Clock: Clock = null;
    private _MMU: MMU;


    constructor() {
        super(0, "System");

        this._Memory = new Memory(65536);
        this._MMU = new MMU(this._Memory); // Initialize the MMU with Memory
        this._CPU = new Cpu(this._MMU);
        this._Clock = new Clock(CLOCK_INTERVAL);

        this._Clock.addListener(this._CPU);
        this._Clock.addListener(this._Memory);

        this.startSystem();
    }

    public startSystem(): void {
        this.log("created");
        this._CPU.log("created");
        this._Memory.log("created");
        this._Memory.reset();
        this._Memory.displayMemory();
        this._Clock.start();
        this.loadStaticProgram(); // Call the method to load the static program
    }
 public stopSystem(): boolean {
        this._Clock.stop();
        return false;
    }

    // Load the static program using the MMU and display the memory dump
    private loadStaticProgram(): void {
        this._MMU.loadAndDisplayStaticProgram();
    }

    pulse(): void {
        this.log("clock pulse");
    }
}

let system: System = new System();

// Start the system
system.startSystem();

