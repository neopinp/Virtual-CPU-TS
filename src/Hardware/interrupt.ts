interface Interrupt {
    irq: number;
    priority: number;
    name: string;
    inputBuffer?: Buffer;
    outputBuffer?: Buffer;
    triggerInterrupt(): void;
}

export default Interrupt;
