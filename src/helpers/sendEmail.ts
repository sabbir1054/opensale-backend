import nodemailer from 'nodemailer';
import config from '../config';

type IEmailOptions = {
  to: string;
  subject: string;
  html: string;
};

export const sendEmail = async (options: IEmailOptions) => {
  const transporter = nodemailer.createTransport({
    host: config.email_host.name,
    port: Number(config.email_host.port),
    auth: {
      user: config.email_host.user,
      pass: config.email_host.password,
    },
  });

  await transporter.sendMail({
    from: config.email_host.user,
    to: options.to,
    subject: options.subject,
    html: options.html,
  });
};
