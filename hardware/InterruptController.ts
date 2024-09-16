import { Hardware } from './Hardware';
import { ClockListener } from './imp/ClockListener';
import { Keyboard } from './Keyboard';
import { Cpu } from './Cpu';

export class InterruptController extends Hardware implements ClockListener {
  private interruptQueue: { hardware: Hardware; data?: any }[] = [];
  private cpu: Cpu;

  constructor(cpu: Cpu) {
    super(0, 'InterruptController');
    this.cpu = cpu;
  }

  handleInterrupt(hardware: Hardware, data?: any): void {
    this.interruptQueue.push({ hardware, data });
  }

  pulse(): void {
  // Process interrupts in the queue
  while (this.interruptQueue.length > 0) {
    const interrupt = this.interruptQueue.shift();
    if (interrupt) {
      this.sendInterruptToCpu(interrupt.hardware, interrupt.data);
    }
  }
}

private sendInterruptToCpu(hardware: Hardware, data?: any): void {
  // Forward the interrupt to the CPU along with interruptData
  this.cpu.handleInterrupt(hardware, data);
}
}
