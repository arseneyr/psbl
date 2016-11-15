import { GameDay, fetchScheduledGames } from './game';
import { sendMail, reply } from './sendMail';

fetchScheduledGames(GameDay.Sunday)
  .then(games => sendMail({
      from: 'PSBLBLOT',
      to: [{address: 'psbl.mailbot@gmail.com'}, {name: 'arse', address: 'doutful@gmail.com'}],
      subject: 'newcooltest',
      text: 'yup',
      html: 'yup'
    }))
  .then(threadId => reply(threadId, {from: 'DUMMY', text: 'secondreply'}))