import nodemailer from 'nodemailer'
import type { Transporter } from 'nodemailer'
import { parameters } from './parameters'

const { smtpHost, smtpPort, smtpSecure } = parameters

const transporter: Transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpSecure,
})

export default transporter
