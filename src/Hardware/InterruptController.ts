import { Hardware } from "./Hardware";
import { InterruptibleHardware } from "./InterruptibleHardware";

interface QueueElement {
    device: InterruptibleHardware;
    priority: number;
}

export class InterruptController extends Hardware {
    private interruptQueue: QueueElement[] = [];

    constructor(debug: boolean = true) {
        super('InterruptController', debug);
        this.log('Interrupt controller initialized');
    }

    registerDevice(device: InterruptibleHardware): void {
        this.log(`Device registered: ${device.name}`);
    }

    acceptInterrupt(device: InterruptibleHardware): void {
        this.log(`Interrupt accepted from: ${device.name}`);
        // Insert the device into the queue based on its priority
        const element: QueueElement = { device, priority: device.priority };
        this.interruptQueue.push(element);
        this.interruptQueue.sort((a, b) => b.priority - a.priority); // Sort descending by priority
    }

    getHighestPriorityInterrupt(): InterruptibleHardware | null {
        const element = this.interruptQueue.shift();
        return element ? element.device : null;
    }

    handleInterrupts(): void {
        const device = this.getHighestPriorityInterrupt();
        if (device) {
            this.log(`Handling interrupt from: ${device.name}`);
            // Additional logic to handle the specific interrupt
        }
    }
}
