import * as google from 'googleapis';
import * as Promise from 'bluebird';
import * as mailcomposer from 'mailcomposer';
import base64url from 'base64url';

const config: config.JsonSchema = require('../config.json');

const oauth2Client = new google.auth.OAuth2(config.mailAuth.clientId, config.mailAuth.clientSecret);
oauth2Client.setCredentials({
  refresh_token: config.mailAuth.refreshToken
});

const gmail = google.gmail({version: 'v1', params: { userId: 'me' }, auth: oauth2Client });
Promise.promisifyAll(gmail.users.messages);
Promise.promisifyAll(gmail.users.threads);

function getHeaderValue(message: {headers: {name:string, value:string}[]}, headerName: string) {
  const header = message.headers.find(e => e.name === headerName);
  return header ? header.value : null;
}

interface Recipient {
  name?: string,
  address: string
}

interface SendMailOpts {
  to?: Recipient[],
  from?: string,
  subject?: string,
  text?: string,
  html?: string
}

function sendMail(options: SendMailOpts): Promise<string> {

  const message = mailcomposer({
    from: {
      address: config.mailAuth.user,
      name: options.from
    },
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html
  });

  const build: ()=>Promise<any> = Promise.promisify(message.build, {context: message});

  return <Promise<string>>build()
    .then(message => gmail.users.messages.sendAsync({resource: {raw: base64url.encode(message)}}))
    .get('threadId');
}

function reply(threadId: string, options: SendMailOpts): Promise<any> {

  return gmail.users.threads.getAsync({id: threadId})
    .then((response: any) => {
      const lastMessage = response.messages[response.messages.length - 1].payload;
      debugger;
      let opts = Object.assign({}, options, {
        from: {
          address: config.mailAuth.user,
          name: options.from
        },
        subject: getHeaderValue(lastMessage, 'Subject'),
        to: getHeaderValue(lastMessage, 'To') + ', ' + getHeaderValue(lastMessage, 'From'),
        cc: getHeaderValue(lastMessage, 'Cc')
      });
      const message = mailcomposer(opts);

      const build: ()=>Promise<any> = Promise.promisify(message.build, {context: message});
      return build()
        .then(message => gmail.users.messages.sendAsync({resource: {threadId, raw: base64url.encode(message)}}));
    });
}

export { sendMail, reply };