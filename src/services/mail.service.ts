import { parameters } from '../config/parameters'
import transporter from '../config/nodemailer'
import logger from '../utils/logger'
import type { MailOptions } from 'nodemailer/lib/sendmail-transport'

class MailService {
  private readonly smtpFrom: string = parameters.smtpFrom
  private readonly smtpFromName: string = parameters.smtpFromName

  async sendMail(options: MailOptions): Promise<void> {
    const { from = `"${this.smtpFromName}" <${this.smtpFrom}>`, to, subject, html } = options

    await transporter.sendMail({
      from,
      to,
      subject,
      html,
    })

    logger.debug(`Email sent from ${from} to ${to} with subject "${subject}"`)
  }
}

export default new MailService()
