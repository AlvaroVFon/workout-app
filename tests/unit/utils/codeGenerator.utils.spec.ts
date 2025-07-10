import { generateCode } from '../../../src/utils/codeGenerator.utils'

describe('codeGenerator', () => {
  it('should generate a code with the correct length', () => {
    const code = generateCode(10)

    expect(code).toHaveLength(10)
    expect(code).toMatch(/^[A-Za-z0-9]+$/)
  })
})
