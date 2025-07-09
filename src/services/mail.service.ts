import type { MailOptions } from 'nodemailer/lib/sendmail-transport'
import transporter from '../config/nodemailer'
import { parameters } from '../config/parameters'
import { compileTemplate } from '../config/templateEngine'
import { TemplateEnum } from '../utils/enums/templates.enum'
import logger from '../utils/logger'

class MailService {
  private readonly smtpFrom: string = parameters.smtpFrom
  private readonly smtpFromName: string = parameters.smtpFromName
  private readonly frontUrl: string = parameters.frontUrl

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

  async sendSignupEmail(to: string, code: string, uuid: string): Promise<void> {
    this.sendMailWithTemplate({
      to,
      subject: 'Email Verification',
      template: TemplateEnum.SIGNUP,
      context: {
        code,
        appName: this.smtpFromName,
        year: new Date().getFullYear(),
        link: `${this.frontUrl}/signup-verify/${uuid}`,
      },
    })
  }

  async sendSingupSuccedEmail(to: string) {
    this.sendMailWithTemplate({
      to,
      subject: 'Signup Successful',
      template: TemplateEnum.SIGNUP_SUCCEED,
      context: {
        appName: this.smtpFromName,
        year: new Date().getFullYear(),
        link: this.frontUrl,
      },
    })
  }

  async sendPasswordRecoveryEmail(to: string, code: string, resetPasswordToken: string): Promise<void> {
    this.sendMailWithTemplate({
      to,
      subject: 'Password Recovery',
      template: TemplateEnum.PASSWORD_RECOVERY,
      context: {
        code,
        appName: this.smtpFromName,
        year: new Date().getFullYear(),
        link: `${this.frontUrl}/reset-password/${resetPasswordToken}`,
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

  async sendWelcomeEmail(to: string, userName: string): Promise<void> {
    this.sendMailWithTemplate({
      to,
      subject: 'Welcome to Our Service',
      template: TemplateEnum.WELCOME,
      context: {
        appName: this.smtpFromName,
        year: new Date().getFullYear(),
        link: this.frontUrl,
        userName,
      },
    })
  }
}

export default new MailService()
