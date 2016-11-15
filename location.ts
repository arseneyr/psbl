import * as Promise from 'bluebird';
import * as rp from 'request-promise';
import * as cheerio from 'cheerio';

export interface Location {
  name: string,
  address?: string,
  directions?: string
}

let locationCache: { [url: string]: Promise<Location> } = {};

export function fetchLocation(url: string): Promise<Location> {
  if (!locationCache[url]) {
    locationCache[url] = rp(url)
      .then(html => {
        const $ = cheerio.load(html);
        const main = $('#main');
        let address: string, directions: string;
        let match = main.text().match(/Address:\s*(.*)\s*$/m);
        if (match) {
          address = match[1];
        }

        match = main.text().match(/Directions:\s*(.*)\s*$/);
        if (match) {
          directions = match[1];
        }

        return {
          name: main.children('h2').text(),
          address,
          directions
        };
      })
  }

  return locationCache[url];
}