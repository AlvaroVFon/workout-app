import NotFoundException from '../../../exceptions/NotFoundException'
import mailService from '../../../services/mail.service'
import { TemplateEnum } from '../../../utils/enums/templates.enum'
import { EmailJobData, EmailPayloadMap } from '../../jobs/email/email.types'

const emailHandlers: {
  [K in TemplateEnum]: (payload: EmailPayloadMap[K]) => Promise<void>
} = {
  [TemplateEnum.GENERIC]: (payload) => mailService.sendMail(payload),
  [TemplateEnum.SIGNUP]: (payload) => mailService.sendSignupEmail(payload.to, payload.code, payload.uuid),
  [TemplateEnum.SIGNUP_SUCCEED]: (payload) => mailService.sendSignupSucceedEmail(payload.to),
  [TemplateEnum.PASSWORD_RECOVERY]: (payload) =>
    mailService.sendPasswordRecoveryEmail(payload.to, payload.code, payload.resetPasswordToken),
  [TemplateEnum.RESET_PASSWORD_OK]: (payload) => mailService.sendResetPasswordOkEmail(payload.to),
  [TemplateEnum.WELCOME]: (payload) => mailService.sendWelcomeEmail(payload.to, payload.userName),
}

async function emailHandler<T extends TemplateEnum>(job: EmailJobData<T>): Promise<void> {
  const handler = emailHandlers[job.template]
  if (!handler) throw new NotFoundException(`Handler not found for template: ${job.template}`)

  return handler(job.payload)
}

export { emailHandler }
