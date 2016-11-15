import { GameDay, fetchScheduledGames } from './game';

fetchScheduledGames(GameDay.Sunday)
  .then(games => {
    debugger;
  })