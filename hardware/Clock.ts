import { ClockListener } from './imp/ClockListener';
/// <reference types="node" />
export class Clock {
    private listeners: ClockListener[] = [];
    private interval: NodeJS.Timeout | null = null; // Store the interval ID
    private readonly intervalTime: number;

    constructor(intervalTime: number) {
        this.intervalTime = intervalTime;
    }

    // Add ClockListener to listener list
    public addListener(listener: ClockListener): void {
        this.listeners.push(listener);
    }

    // Start clock
    public start(): void {
        if (!this.interval) {
            // Set pulse every x milliseconds
            this.interval = setInterval(() => {
                this.pulse();
            }, this.intervalTime);
        }
    }

    // Stop clock
    public stop(): void {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    // pulse and notify
    private pulse(): void {
        for (const listener of this.listeners) {
            listener.pulse();
        }
    }
}


