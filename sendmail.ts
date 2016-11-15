import * as nodemailer from 'nodemailer';
import * as xoauth2 from 'xoauth2';
import * as Promise from 'bluebird';

import template from './mail_template';
const config = require('../config.json');

interface Recipient {
  name?: string,
  address: string
}

function sendMail(to: Recipient[], subject: string, text: string, html: string): Promise<any> {
  const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      xoauth2: xoauth2.createXOAuth2Generator(config.mail_auth)
    }
  })

  return transport.sendMail({
    from: <any>{
      name: config.mail_from_name,
      address: config.mail_auth.user
    },
    to: <any>to,
    subject,
    text,
    html
  });
}

export default sendMail;