import { fetchScheduledGames } from './game';
import { sendMail, reply } from './sendMail';


fetchScheduledGames('Sunday')
  .then(games => {
    debugger;
    return sendMail({
      from: 'PSBLBLOT',
      to: [{address: 'psbl.mailbot@gmail.com'}],
      subject: 'newcooltest',
      text: 'yup',
      html: 'yup'
    });
  })
  .then(threadId => reply(threadId, {from: 'DUMMY', to: {name: 'arse', address: 'doutful@gmail.com'}, text: 'secondreply'}))