import { parameters } from '../config/parameters'
import transporter from '../config/nodemailer'
import logger from '../utils/logger'
import type { MailOptions } from 'nodemailer/lib/sendmail-transport'
import { TemplateEnum } from '../utils/enums/templates.enum'
import { compileTemplate } from '../config/templateEngine'

class MailService {
  private readonly smtpFrom: string = parameters.smtpFrom
  private readonly smtpFromName: string = parameters.smtpFromName

  async sendMail(options: MailOptions): Promise<void> {
    const { from = `"${this.smtpFromName}" <${this.smtpFrom}>`, to, subject, html = '', text = '' } = options

    await transporter.sendMail({
      from,
      to,
      subject,
      html,
      text,
    })

    logger.debug(`Email sent from ${from} to ${to} with subject "${subject}"`)
  }

  async sendMailWithTemplate({
    from = `"${this.smtpFromName}" <${this.smtpFrom}>`,
    to,
    subject,
    template,
    context,
  }: {
    from?: string
    to: string
    subject: string
    template: TemplateEnum
    context: object
  }) {
    const html = compileTemplate(template, context)

    await this.sendMail({
      from,
      to,
      subject,
      html,
    })
    logger.debug(`Email template "${template}" compiled with context`, context)
  }

  async sendPasswordRecoveryEmail(to: string, code: string): Promise<void> {
    this.sendMailWithTemplate({
      to,
      subject: 'Password Recovery',
      template: TemplateEnum.PASSWORD_RECOVERY,
      context: {
        code,
        appName: this.smtpFromName,
        year: new Date().getFullYear(),
      },
    })
  }

  async sendResetPasswordOkEmail(to: string): Promise<void> {
    this.sendMailWithTemplate({
      to,
      subject: 'Password Reset Successful',
      template: TemplateEnum.RESET_PASSWORD_OK,
      context: {
        appName: this.smtpFromName,
        year: new Date().getFullYear(),
      },
    })
  }
}

export default new MailService()
