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

declare namespace config {
  interface JsonSchema {
    mailAuth: {
      user: string,
      clientId: string,
      clientSecret: string,
      refreshToken: string
    },

    mailFromName: string,
    teams: {
      day: string,
      players: {
        name: string,
        address: string
      }[]
    }[]
  }
}