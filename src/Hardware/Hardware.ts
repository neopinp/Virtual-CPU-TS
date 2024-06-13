// hardware.ts
export class Hardware {
  static nextId: number = 0; //unique ID 

  id: number;
  name: string;
  debug: boolean; // if true: logging is enabled 

  constructor(name: string, debug: boolean = true) {
    this.id = Hardware.nextId++; 
    this.name = name; 
    this.debug = debug; 
  }   

//logs message if debugging is enabled 
public log(message: string, type?: 'cpu' | 'memory' | 'clock'): void {
  if (this.debug) {
      const timestamp = Date.now();
      console.log(`[HW - ${this.name} id: ${this.id} - ${timestamp}]: ${message}`);
    }
  }




public hexLog(address: number, data?: number, addressLength: number = 4, dataLength: number = 2): void {
  const hexAddress = address.toString(16).toUpperCase().padStart(addressLength, '0');
  let message = `Address: ${hexAddress}`;
  if (data !== undefined) {
      const hexData = data.toString(16).toUpperCase().padStart(dataLength, '0');
      message += ` Contains Value: ${hexData}`;
  }
  if (this.debug) {
      console.log(`[HW - ${this.name} id: ${this.id}]: ${message}`);
  }
}
}
