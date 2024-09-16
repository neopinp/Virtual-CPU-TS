import { Hardware } from './Hardware';
import { InterruptController } from './InterruptController';
import { Interrupt } from './Interrupt';

export class Keyboard extends Hardware implements Interrupt {
  irqNumber: number;
  priority: number;
  name: string;
  private interruptController: InterruptController;
  inputBuffer: string[] = [];
  outputBuffer: string[] = [];

  constructor(irqNumber: number, priority: number, name: string, interruptController: InterruptController) {
    super(0, 'Keyboard');
    this.irqNumber = irqNumber;
    this.priority = priority;
    this.name = name;
    this.interruptController = interruptController;

    // Start monitoring keys
    this.monitorKeys();
  }

  generateInterrupt(data?: any): void {
    this.interruptController.handleInterrupt(this);
  }

  handleInterrupt(): void {
    // LOL
  }


  private monitorKeys(): void {
    const stdin = process.stdin;

    // Without this, we would only get streams once Enter is pressed
    stdin.setRawMode(true);

    // Resume stdin in the parent process (node app won't quit all by itself
    // unless an error or process.exit() happens)
    stdin.resume();

    // I don't want binary, do you?
    stdin.setEncoding(null);

    stdin.on('data', function (key) {
      let keyPressed = key.toString();

      this.log("Key pressed - " + keyPressed);

      // Ctrl-C (end of text)
      // This lets us break out with Ctrl-C
      if (key.toString() === '\u0003') {
        process.exit();
      }

      // Write the key to stdout all normal like
      // process.stdout.write( key);
      // Put the key value in the buffer
      this.outputBuffer.enqueue(keyPressed);

      // Set the interrupt with keyPressed information
      this.generateInterrupt(keyPressed);
    }.bind(this));
  }
}
