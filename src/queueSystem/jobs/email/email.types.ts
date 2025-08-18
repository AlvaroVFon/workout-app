import { TemplateEnum } from '../../../utils/enums/templates.enum'

export interface sendEmailJobData {
  from?: string
  to: string
  subject?: string
}

export interface signUpEmailJobData extends sendEmailJobData {
  code: string
  uuid: string
}

export interface resetPasswordEmailJobData extends sendEmailJobData {
  code: string
  resetPasswordToken: string
}

export interface sendWelcomeEmailJobData extends sendEmailJobData {
  userName: string
}

export type EmailJobData<T extends TemplateEnum = TemplateEnum> = {
  type: string
  template: T
  payload: EmailPayloadMap[T]
}

export type EmailPayloadMap = {
  [TemplateEnum.GENERIC]: sendEmailJobData
  [TemplateEnum.SIGNUP]: signUpEmailJobData
  [TemplateEnum.SIGNUP_SUCCEED]: sendEmailJobData
  [TemplateEnum.PASSWORD_RECOVERY]: resetPasswordEmailJobData
  [TemplateEnum.RESET_PASSWORD_OK]: sendEmailJobData
  [TemplateEnum.WELCOME]: sendWelcomeEmailJobData
}
