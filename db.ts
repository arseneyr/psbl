import { MongoClient } from 'mongodb';
const config: ConfigJsonSchema = require('../config.json');

export function connect() {
  return MongoClient.connect(config.dbConnection)
    .then(db => {
      db.collection
    })
}
