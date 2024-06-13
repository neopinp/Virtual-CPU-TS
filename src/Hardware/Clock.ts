// Clock.ts
import { Hardware } from "./Hardware";
import { ClockListener } from "./Imp/ClockListener";

//registers listeners (Cpu,Memory)
export class Clock extends Hardware {
  private listeners: ClockListener[] = [];
  private intervalId: ReturnType<typeof setInterval> | undefined;

  constructor(debug: boolean = true) {
    super('Clock',debug);
    this.log('created');
  }

  registerListener(listener: ClockListener): void {
    this.listeners.push(listener);
  }
//starts the clock that calls the tick() method 
  startClock(interval: number): void {
    this.log('Clock Pulse Initialized'); //log start 
    this.intervalId = setInterval(() => this.tick(), interval);
  }

// Clears interval set and stops clock 
  stopClock(): void {
    if (this.intervalId !== undefined) clearInterval(this.intervalId);
  }

  private tick(): void {
    this.listeners.forEach(listener => listener.pulse());
  }
}
