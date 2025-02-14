import { describe, it, expect } from '@jest/globals'


import { parseBytecode, interpretBytecode } from '../src/evm' 

describe('EVM Bytecode Basics', () => {
  it('parses simple PUSH/ADD sequence correctly', () => {
    // 0x6001600201 => PUSH1 0x01, PUSH1 0x02, ADD
    const bytecode = '6001600201'
    const instructions = parseBytecode(bytecode)
    expect(instructions).toHaveLength(3)
    expect(instructions[0]).toEqual({ opcode: 'PUSH1', operand: '01' })
    expect(instructions[1]).toEqual({ opcode: 'PUSH1', operand: '02' })
    expect(instructions[2]).toEqual({ opcode: 'ADD' })
  })

  it('interprets simple PUSH/ADD sequence correctly', () => {
    const bytecode = '6001600201'
    const result = interpretBytecode(bytecode)
    expect(result).toBe(3) // 1 + 2 = 3
  })

  it('handles an empty bytecode string gracefully', () => {
    const bytecode = ''
    const instructions = parseBytecode(bytecode)
    expect(instructions).toHaveLength(0)
    const result = interpretBytecode(bytecode)
    expect(result).toBeUndefined() 
  })

  it('interprets multiple operations in sequence', () => {
   const bytecode = '6003600202600401' // PUSH1 03, PUSH1 02, MUL, PUSH1 04, ADD
   const result = interpretBytecode(bytecode)
   expect(result).toBe(10) // (3 * 2) + 4 = 10
  })

  it('handles invalid opcodes gracefully', () => {
    const bytecode = '60016002FF' // PUSH1 01, PUSH1 02, Invalid opcode FF
    expect(() => interpretBytecode(bytecode)).toThrow('Invalid opcode: FF')
  })
  it('handles SUB operation correctly', () => {
    const bytecode = '6005600403' // PUSH1 05, PUSH1 04, SUB
    const result = interpretBytecode(bytecode)
    expect(result).toBe(1) // 5 - 4 = 1
   })

  it('processes multiple PUSH operations', () => {
    const bytecode = '60016002600360040101' // PUSH1 01, PUSH1 02, PUSH1 03, PUSH1 04, ADD, ADD
    const result = interpretBytecode(bytecode)
    expect(result).toBe(10) // 1 + 2 + 3 + 4 = 10
  })

  it('handles byte values greater than 0x0F', () => {
    const bytecode = '60FF600102' // PUSH1 FF, PUSH1 01, MUL
    const result = interpretBytecode(bytecode)
    expect(result).toBe(255) // 255 * 1 = 255
  })

  it('parses mixed length PUSH operations', () => {
    const bytecode = '6001610100' // PUSH1 01, PUSH2 0100
    const instructions = parseBytecode(bytecode)
    expect(instructions).toHaveLength(2)
    expect(instructions[0]).toEqual({ opcode: 'PUSH1', operand: '01' })
    expect(instructions[1]).toEqual({ opcode: 'PUSH2', operand: '0100' })
  })
})
