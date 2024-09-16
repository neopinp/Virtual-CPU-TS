export interface Interrupt {
  irqNumber: number;
  priority: number;
  name: string;
  inputBuffer?: string[];
  outputBuffer?: string[]; 
  data?: any;
  generateInterrupt(data?: any): void;
  handleInterrupt(): void;
}
