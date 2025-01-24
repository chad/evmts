```typescript
interface Instruction {
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
    } else if (opcode === '01') {
      instructions.push({ opcode: 'ADD' });
    }
  }
  return instructions;
}

export function interpretBytecode(bytecode: string): number | undefined {
  const stack: number[] = [];
  const instructions = parseBytecode(bytecode);
  for (const instruction of instructions) {
    if (instruction.opcode === 'PUSH1') {
      stack.push(parseInt(instruction.operand!, 16));
    } else if (instruction.opcode === 'ADD') {
      const a = stack.pop()!;
      const b = stack.pop()!;
      stack.push(a + b);
    }
  }
  return stack.pop();
}
```