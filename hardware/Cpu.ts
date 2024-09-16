import { Hardware } from './Hardware';
import { ClockListener } from './imp/ClockListener';
import { MMU } from './MMU';
import { Keyboard } from './Keyboard';


enum PipelineStep {
  FetchInstruction = 'FETCH_INSTRUCTION',
  DecodeInstruction = 'DECODE_INSTRUCTION',
  ExecuteInstruction = 'EXECUTE_INSTRUCTION',
  WriteBackResult = 'WRITE_BACK_RESULT',
  InterruptHandling = 'INTERRUPT_HANDLING',
}

export class Cpu extends Hardware implements ClockListener {
  private cpuClockCount: number = 0;
  private accumulator: number = 0;
  private xRegister: number = 0;
  private yRegister: number = 0;
  private programCounter: number = 0;
  private instructionRegister: number = 0;
  private zeroFlag: boolean = false;
  private pipelineStep: PipelineStep = PipelineStep.FetchInstruction;
  private _MMU: MMU;
  private carryFlag: boolean = false;
  private memoryAddress: number = 0;
  private operand: number = 0;





  constructor(_MMU: MMU) {
    super(0, 'CPU');
    this._MMU = _MMU;
    this.resetCpuClockCount();
  }

  getAccumulator(): number {
    return this.accumulator;
  }

  setAccumulator(value: number): void {
    this.accumulator = value;
  }

  getXRegister(): number {
    return this.xRegister;
  }

  setXRegister(value: number): void {
    this.xRegister = value;
  }

  getYRegister(): number {
    return this.yRegister;
  }

  setYRegister(value: number): void {
    this.yRegister = value;
  }

  getProgramCounter(): number {
    return this.programCounter;
  }

  setProgramCounter(value: number): void {
    this.programCounter = value;
  }

  getInstructionRegister(): number {
    return this.instructionRegister;
  }

  setInstructionRegister(value: number): void {
    this.instructionRegister = value;
  }

  getZeroFlag(): boolean {
    return this.zeroFlag;
  }

  setZeroFlag(value: boolean): void {
    this.zeroFlag = value;
  }

    getCarryFlag(): boolean {
    return this.carryFlag;
  }

  setCarryFlag(value: boolean): void {
    this.carryFlag = value;
  }

  getPipelineStep(): PipelineStep {
    return this.pipelineStep;
  }

  setPipelineStep(step: PipelineStep): void {
    this.pipelineStep = step;
  }

  private resetCpuClockCount(): void {
    this.cpuClockCount = 0;
  }

  private logCpuState(): void {
    const logMessage = `[HW - CPU id: ${this.getId()} - ...]: CPU State | Mode: 0 PC: ${this.hexLog(
      this.programCounter,
      4
    )} IR: ${this.hexLog(this.instructionRegister, 2)} Acc: ${this.hexLog(this.accumulator, 2)} xReg: ${this.hexLog(
      this.xRegister,
      2
    )} yReg: ${this.hexLog(this.yRegister, 2)} zFlag: ${this.zeroFlag ? 1 : 0} Step: ${this.pipelineStep}`;

    this.log(logMessage);
  }

    private updateZeroAndCarryFlags(): void {
    // Implement the logic to update zero and carry flags based on accumulator value
    // For example:
    this.zeroFlag = this.accumulator === 0;
    this.carryFlag = this.accumulator > 255;
  }


  private getAddressFromOperands(): number {
    // Your logic to calculate the memory address based on operands goes here
    // For example:
    const operand1 = this._MMU.readMemory(this.programCounter + 1);
    const operand2 = this._MMU.readMemory(this.programCounter + 2);
    return operand1 | (operand2 << 8);
}

private handleSysCall(): void {
    // Implement the logic to handle system calls
    // For example, you can switch based on the value of the X register
    if (this.xRegister === 0x01) {
      // Option 1: Print the integer in the Y register
      console.log(this.yRegister);
    } else if (this.xRegister === 0x02) {
      // Option 2: Print the 0x00 terminated string stored at the address in the Y register
      // Implement readStringFromMemory function
      let stringAddress = this.yRegister;
      let charCode = this._MMU.readMemory(stringAddress);
      let string = '';

      while (charCode !== 0x00) {
        string += String.fromCharCode(charCode);
        stringAddress += 1;
        charCode = this._MMU.readMemory(stringAddress);
      }

      console.log(string);
    } else if (this.xRegister === 0x03) {
      // Option 3: Print the 0x00 terminated string from the address in the operand
      // Implement readStringFromMemory function
      let operandAddress = this._MMU.readMemory(this.programCounter + 1);
      let operandCharCode = this._MMU.readMemory(operandAddress);
      let operandString = '';

      while (operandCharCode !== 0x00) {
        operandString += String.fromCharCode(operandCharCode);
        operandAddress += 1;
        operandCharCode = this._MMU.readMemory(operandAddress);
      }

      console.log(operandString);
    } else {
      // Handle unknown X register value for SYS opcode
      console.log(`Unknown SYS option for X register value: ${this.xRegister}`);
    }
  }


  pulse(): void {
  this.logCpuState(); // Log initial state

  switch (this.pipelineStep) {
    case PipelineStep.FetchInstruction:
      this.fetchInstruction();
      break;
    case PipelineStep.DecodeInstruction:
      this.decodeInstruction();
      break;
    case PipelineStep.ExecuteInstruction:
      this.executeInstruction();
      break;
    case PipelineStep.WriteBackResult:
      this.writeBackResult();
      break;
    case PipelineStep.InterruptHandling:
      this.handleInterrupt();
      break;
    default:
      this.log('Unknown pipeline step');
      break;
  }

  this.logCpuState(); // Log state after the cycle

  // Increment the clock count
  this.cpuClockCount += 1;
}

  private fetchInstruction(): void {
    this.log('Fetching instruction...');

    // Read the opcode from memory
    this.instructionRegister = this._MMU.readMemory(this.programCounter);


    // Log the opcode for debugging
    this.log(`Read opcode: ${this.hexLog(this.instructionRegister, 2)}`);

    // Move to the next pipeline stage
    this.pipelineStep = PipelineStep.DecodeInstruction;
}


   private decodeInstruction(): void {
    this.log('Decoding instruction...');

    // Get the opcode from the instruction register
    const opcode = this.instructionRegister;

    // Determine the number of operands based on the opcode
    let numOperands = 0;

    switch (opcode) {
        case 0xA9: // Load Accumulator with a Constant
            numOperands = 1;
            break;

	case 0xAD: // Load Accumulator from memory
            numOperands = 2;
            break;

        case 0x8D: // Store Accumulator in Memory
            numOperands = 2;
            break;

	case 0x8A: // Load Accumulator from the x register
            numOperands = 0;
            break;

        case 0x98: // Load Accumulator from the y register
            numOperands = 0;
            break;
	    
        case 0x6D: // Add with Carry
            numOperands = 2;
            break;

        case 0xA2: // Load x register with constant
            numOperands = 1;
            break;
        case 0xAE: // Load x register from memory
            numOperands = 2;
            break;
        case 0xAA: // Load x register from accumulator
            numOperands = 0;
            break;
        case 0xA0: // Load y register with constant
            numOperands = 1;
            break;
        case 0xAC: // Load y register from memory
            numOperands = 2;
            break;
        case 0xA8: // Load y register from accumulator
            numOperands = 0;
            break;
        case 0xEA: // no operation
            numOperands = 0;
            break;
        case 0x00: // break
            numOperands = 0;
            break;
        case 0xEC: // compare a byte in memory to x reg
            numOperands = 2;
            break;
        case 0xD0: // branch n bytes
            numOperands = 1;
            break;
        case 0xEE: // increment byte in memory
            numOperands = 2;
            break;
        case 0xFF: // sys calls
            numOperands = 0;
            break;


        default:
            this.log(`Unknown opcode: ${opcode}`);
            return; // Abort decoding if the opcode is unknown
    }

    // Fetch operands from memory
    const operands: number[] = [];
    for (let i = 0; i < numOperands; i++) {
        operands.push(this._MMU.readMemory(this.programCounter));
        this.programCounter += 1; // Move to the next memory location
    }

    // Now, you have the opcode and operands, and you can perform further actions
    // based on the opcode in the executeInstruction method.

    // For now, let's log the decoded information
    this.log(`Decoded: Opcode: ${opcode}, Operands: ${operands}`);

    // Move to the next pipeline stage
    this.pipelineStep = PipelineStep.ExecuteInstruction;
}


  private executeInstruction(): void {
  this.log('Executing instruction...');

  switch (this.instructionRegister) {
    case 0xA9: // LDA - Load Accumulator with a constant
      this.accumulator = this._MMU.readMemory(this.programCounter);
      this.programCounter += 1;
      break;

    case 0xAD: // LDA - Load Accumulator from memory
      this.memoryAddress = this.getAddressFromOperands();
      this.accumulator = this._MMU.readMemory(this.memoryAddress);
      this.programCounter += 1;
      break;

    case 0x8D: // STA - Store Accumulator in memory
      let storeAddress = this.getAddressFromOperands();
      this._MMU.writeMemory(storeAddress, this.accumulator);
      this.programCounter += 1;
      break;

    case 0x8A: // TXA - Transfer X to Accumulator
      this.accumulator = this.xRegister;
      this.programCounter += 1;
      break;

    case 0x98: // TYA - Transfer Y to Accumulator
      this.accumulator = this.yRegister;
      this.programCounter += 1;
      break;

    case 0x6D: // ADC - Add with carry
      this.operand = this._MMU.readMemory(this.getAddressFromOperands());
      this.accumulator += 2;
      this.updateZeroAndCarryFlags();
      this.programCounter += 1;
      break;

    case 0xA2: // LDX - Load X with a constant
      this.setXRegister(this._MMU.readMemory(this.programCounter));
      this.programCounter += 1;
      break;

    case 0xAE: // LDX - Load X from memory
      let xAddress = this.getAddressFromOperands();
      this.setXRegister(this._MMU.readMemory(xAddress));
      this.programCounter += 1;
      break;

    case 0xAA: // TAX - Transfer Accumulator to X
      this.xRegister = this.accumulator;
      this.programCounter += 1;
      break;

    case 0xA0: // LDY - Load Y register with constant
      this.yRegister = this._MMU.readMemory(this.programCounter);
      this.programCounter += 2;
      break;

    case 0xAC: // LDY - Load Y register from memory
      this.memoryAddress = this.getAddressFromOperands();
      this.yRegister = this._MMU.readMemory(this.memoryAddress);
      this.programCounter += 1;
      break;

    case 0xA8: // TAY - Transfer Accumulator to Y register
      this.yRegister = this.accumulator;
      this.programCounter += 1;
      break;

    case 0xEA: // NOP - No Operation
      this.programCounter += 1;
      break;

    case 0x00: // BRK - Break
      this.log('BRK - Break instruction encountered');
      this.programCounter += 1;
      break;

    case 0xEC: // CPX - Compare X register with memory
      let memoryValue = this._MMU.readMemory(this.getAddressFromOperands());
      this.setZeroFlag(this.xRegister === memoryValue);
      this.programCounter += 1;
      break;

    case 0xD0: // BNE - Branch if Not Equal (Zero flag = 0)
      this.operand = this._MMU.readMemory(this.programCounter);
      if (!this.getZeroFlag()) {
        this.programCounter += this.operand;
      }
      this.programCounter += 1;
      break;

    case 0xEE: // INC - Increment the value of a byte from memory
      let incAddress = this.getAddressFromOperands();
      let value = this._MMU.readMemory(incAddress);
      let result = (value + 1) & 0xFF;
      this._MMU.writeMemory(incAddress, result);
      this.setZeroFlag(result === 0);
      this.programCounter += 1;
      break;

    case 0xFF: // SYS - System Call
      this.handleSysCall();
      break;

    default:
      this.log(`Unknown opcode: ${this.hexLog(this.instructionRegister, 2)}`);
      break;
  }

  this.pipelineStep = PipelineStep.WriteBackResult;
}

  private writeBackResult(): void {
    this.log('Writing back result...');
    // Example: update the register values or write to memory
    this.pipelineStep = PipelineStep.InterruptHandling; // Move to the interrupt handling stage
  }

    handleInterrupt(hardware: Hardware, data?: any): void {
    if (hardware instanceof Keyboard) {
      // Handle the keyboard interrupt, print the key
      this.log(`Key pressed: ${data}`);
       }
       this.pipelineStep = PipelineStep.FetchInstruction;
    }



}
