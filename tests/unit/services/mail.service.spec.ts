import MailService from '../../../src/services/mail.service'
import transporter from '../../../src/config/nodemailer'
import logger from '../../../src/utils/logger'
import { compileTemplate } from '../../../src/config/templateEngine'
import { TemplateEnum } from '../../../src/utils/enums/templates.enum'
import { parameters } from '../../../src/config/parameters'

jest.mock('../../../src/config/nodemailer')
jest.mock('../../../src/utils/logger')
jest.mock('../../../src/config/templateEngine')
jest.mock('../../../src/config/parameters', () => ({
  parameters: {
    smtpFromName: 'Workout-App',
    smtpFrom: 'admin@localhost',
  },
}))

describe('MailService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('sendMail', () => {
    it('should send an email successfully', async () => {
      const mailOptions = {
        from: 'test@example.com',
        to: 'recipient@example.com',
        subject: 'Test Subject',
        text: 'Test Text',
        html: '',
      }
      ;(transporter.sendMail as jest.Mock).mockResolvedValue({ response: 'Email sent' })
      await MailService.sendMail(mailOptions)
      expect(transporter.sendMail).toHaveBeenCalledWith(mailOptions)
      expect(logger.debug).toHaveBeenCalledWith(
        `Email sent from ${mailOptions.from} to ${mailOptions.to} with subject "${mailOptions.subject}"`,
      )
    })

    it('should throw an error if email sending fails', async () => {
      const mailOptions = {
        from: 'test@example.com',
        to: 'recipient@example.com',
        subject: 'Test Subject',
        text: 'Test Text',
        html: '',
      }
      ;(transporter.sendMail as jest.Mock).mockRejectedValue(new Error('Failed to send email'))

      await expect(MailService.sendMail(mailOptions)).rejects.toThrow('Failed to send email')
      expect(transporter.sendMail).toHaveBeenCalledWith(mailOptions)
    })
  })

  describe('sendMailWithTemplate', () => {
    it('should compile a template and send an email', async () => {
      ;(compileTemplate as jest.Mock).mockReturnValueOnce('<html>Compiled Template</html>')
      ;(transporter.sendMail as jest.Mock).mockResolvedValue({ response: 'Email sent' })
      const mailOptions = {
        to: 'recipient@example.com',
        subject: 'Template Subject',
        template: TemplateEnum.PASSWORD_RECOVERY,
        context: { name: 'John' },
      }
      await MailService.sendMailWithTemplate(mailOptions)
      expect(compileTemplate).toHaveBeenCalledWith(mailOptions.template, mailOptions.context)
      expect(transporter.sendMail).toHaveBeenCalledWith({
        from: `"${parameters.smtpFromName}" <${parameters.smtpFrom}>`,
        to: mailOptions.to,
        subject: mailOptions.subject,
        html: '<html>Compiled Template</html>',
        text: '',
      })
      expect(logger.debug).toHaveBeenCalledWith(
        `Email template "${mailOptions.template}" compiled with context`,
        mailOptions.context,
      )
    })
  })

  describe('sendPasswordRecoveryEmail', () => {
    it('should send a password recovery email', async () => {
      const to = 'recipient@example.com'
      const code = '123456'
      await MailService.sendPasswordRecoveryEmail(to, code)
      expect(compileTemplate).toHaveBeenCalledWith(
        TemplateEnum.PASSWORD_RECOVERY,
        expect.objectContaining({
          code,
          appName: parameters.smtpFromName,
          year: expect.any(Number),
        }),
      )
      expect(transporter.sendMail).toHaveBeenCalled()
    })
  })

  describe('sendResetPasswordOkEmail', () => {
    it('should send a password reset success email', async () => {
      const to = 'recipient@example.com'
      await MailService.sendResetPasswordOkEmail(to)
      expect(compileTemplate).toHaveBeenCalledWith(
        TemplateEnum.RESET_PASSWORD_OK,
        expect.objectContaining({
          appName: parameters.smtpFromName,
          year: expect.any(Number),
        }),
      )
      expect(transporter.sendMail).toHaveBeenCalled()
    })
  })
})
