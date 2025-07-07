import fs from 'fs'
import path from 'path'
import { compileTemplate } from '../../../src/config/templateEngine'
import { TemplateEnum } from '../../../src/utils/enums/templates.enum'

describe('compileTemplate', () => {
  const templatesPath = path.join(__dirname, '../../../src/templates/mail')

  beforeAll(() => {
    jest.spyOn(fs, 'readFileSync').mockImplementation((filePath: fs.PathOrFileDescriptor) => {
      if (filePath.toString().includes('password-recovery.hbs')) {
        return 'Hello, {{name}}!'
      }
      if (filePath.toString().includes('welcome.hbs')) {
        return 'Welcome, {{user}}!'
      }
      throw new Error('File not found')
    })
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  it('should compile the password recovery template with the given context', () => {
    const result = compileTemplate(TemplateEnum.PASSWORD_RECOVERY, { name: 'John' })
    expect(result).toBe('Hello, John!')
  })

  it('should compile the welcome template with a different context', () => {
    const result = compileTemplate(TemplateEnum.WELCOME, { user: 'Jane' })
    expect(result).toBe('Welcome, Jane!')
  })

  it('should throw an error if the template file does not exist', () => {
    expect(() => compileTemplate('non-existent-template' as any, {})).toThrow()
  })
})
