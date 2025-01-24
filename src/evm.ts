export interface Instruction {
  opcode: string;
  operand?: string;
}

export function parseBytecode(bytecode: string): Instruction[] {
  const instructions: Instruction[] = [];
  for (let i = 0; i < bytecode.length; i += 2) {
    const opcode = bytecode.slice(i, i + 2);
    if (opcode === '60') {
      const operand = bytecode.slice(i + 2, i + 4);
      instructions.push({ opcode: 'PUSH1', operand });
      i += 2;
    } else {
      instructions.push({ opcode: opcodeToString(opcode) });
    }
  }
  return instructions;
}

export function interpretBytecode(bytecode: string): number | undefined {
  const instructions = parseBytecode(bytecode);
  const stack: number[] = [];
  for (const instruction of instructions) {
    switch (instruction.opcode) {
      case 'PUSH1':
        stack.push(parseInt(instruction.operand!, 16));
        break;
      case 'ADD':
        const a = stack.pop()!;
        const b = stack.pop()!;
        stack.push(a + b);
        break;
      case 'MUL':
        const c = stack.pop()!;
        const d = stack.pop()!;
        stack.push(c * d);
        break;
      default:
        throw new Error(`Invalid opcode: ${instruction.opcode}`);
    }
  }
  return stack.pop();
}

function opcodeToString(opcode: string): string {
  switch (opcode) {
    case '01':
      return 'ADD';
    case '02':
      return 'MUL';
    default:
      return opcode;
  }
}