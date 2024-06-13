import { Hardware } from "./Hardware";

export interface InterruptibleHardware extends Hardware {
    irq: number;
    priority: number;
    inputBuffer?: any[];
    outputBuffer?: any[];
    generateInterrupt(): void;

}
