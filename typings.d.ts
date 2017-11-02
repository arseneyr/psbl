declare module 'fuse.js' {
  var _fusejs: any;
  export = _fusejs;
}

declare module 'googleapis' {
  var _googleapis: any;
  export = _googleapis;
}

declare module 'mailcomposer' {
  var _mailcomposer: any;
  export = _mailcomposer;
}

declare interface ConfigJsonSchema {
  mailAuth: {
    user: string,
    clientId: string,
    clientSecret: string,
    refreshToken: string
  },

  mailFromName: string,
  dbConnection: string,
  teams: {
    day: string,
    name: string,
    players: {
      name: string,
      address: string
    }[]
  }[]
}