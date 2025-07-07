import fs from 'fs'
import path from 'path'
import handlebars from 'handlebars'
import { TemplateEnum } from '../utils/enums/templates.enum'

export function compileTemplate(templateName: TemplateEnum, context: object): string {
  const templatePath = path.join(__dirname, '../templates/mail', `${templateName}.hbs`)
  const templateSource = fs.readFileSync(templatePath, 'utf8')
  const compiledTemplate = handlebars.compile(templateSource)
  return compiledTemplate(context)
}
