// hardware/Hardware.ts

export class Hardware {
  private id: number;
  protected name: string;  // Change from private to protected
  public debug: boolean = true;

  constructor(id: number = -1, name: string = 'No Name') {
    this.id = id;
    this.name = name;
  }

  getId(): number {
    return this.id;
  }

  // log messages to display system and cpu information
  public log(message: string): void {
    if (this.debug) {
      const timestamp = new Date().getTime();
      console.log(`[HW - ${this.name} id: ${this.id} - ${timestamp}]: ${message}`);
    }
  }

  // number and desired length inputs, converts number to hex as a string, makes it uppercase (looks better), if less than desired length add a "0"
  public hexLog(num: number, length: number): string {
    const hex = num.toString(16).toUpperCase().padStart(length, '0');
    return hex;
  }
}
