Here's the TypeScript code that should make the provided tests pass:

export function parseBytecode(bytecode: string): { opcode: string, operand?: string }[] {
  const instructions = [];
  for (let i = 0; i < bytecode.length; i += 2) {
    const opcode = bytecode.slice(i, i + 2);
    if (opcode.startsWith('60')) {
      const pushLength = parseInt(opcode.slice(2), 16) + 1;
      const operand = bytecode.slice(i + 2, i + 2 + pushLength * 2);
      instructions.push({ opcode: `PUSH${pushLength}`, operand });
      i += pushLength * 2;
    } else {
      instructions.push({ opcode: opcodeMap[opcode] });
    }
  }
  return instructions;
}

export function interpretBytecode(bytecode: string): number | undefined {
  const instructions = parseBytecode(bytecode);
  const stack: number[] = [];
  for (const { opcode, operand } of instructions) {
    if (opcode.startsWith('PUSH')) {
      stack.push(parseInt(operand!, 16));
    } else {
      switch (opcode) {
        case 'ADD':
          stack.push(stack.pop()! + stack.pop()!);
          break;
        case 'MUL':
          stack.push(stack.pop()! * stack.pop()!);
          break;
        case 'SUB':
          const a = stack.pop()!;
          const b = stack.pop()!;
          stack.push(b - a);
          break;
        default:
          throw new Error(`Invalid opcode: ${opcode}`);
      }
    }
  }
  return stack.pop();
}

const opcodeMap: { [key: string]: string } = {
  '01': 'ADD',
  '02': 'MUL',
  '03': 'SUB',
};