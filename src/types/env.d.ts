import { Boolean, Number, String } from './std';

export type envObj = {
  database: {},
  server: {
    host: String,
    port: Number
  }
  jwtSecret: String
  startWithReset: Boolean,
  sqlDocPath: String
}
