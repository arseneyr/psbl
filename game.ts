import * as moment from 'moment-timezone';
import * as rp from 'request-promise'
import * as Promise from 'bluebird';
import * as cheerio from 'cheerio';
import { Location, fetchLocation } from './location';

export interface Game {
  date: Date,
  location: Location,
  locationNote?: string,
  homeTeam: string,
  awayTeam: string
}

export function fetchScheduledGames(day: string): Promise<Game[]> {
  return rp(`https://pugetsoundbasketball.com/schedule/?day=${day.toLowerCase()}`)
    .then(html => {
      const $ = cheerio.load(html);
      const dateString: string = $('#title_game_date').text();
      let ret: Promise<Game>[] = [];

      return Promise.all($('#games_table tr').has('.team').get().map(e => {
        const row: Cheerio = $(e);
        const teams: Cheerio = row.find('.team');
        const date: moment.Moment = moment.tz(`${dateString} ${row.find('.time').text()}`, 'dddd, MMMM DD YYYY h:mm a', 'America/Los_Angeles');
        if (!date.isValid()) {
          throw 'Invalid date';
        }

        let game: Game = <any>{};
        const location: Cheerio = row.find('.gym');

        game.date = date.toDate();
        game.homeTeam = teams.first().text();
        game.awayTeam = teams.last().text();
        game.locationNote = location.find('span').text();

        return fetchLocation(location.find('a').attr('href'))
          .then(loc => {
            game.location = loc;
            return game;
          })
          .catch(() => {
            game.location = { name: location.find('a').text() };
            return game;
          });
      }));
    })
}