import { default as Container } from './container'
import { ConnectionConfig } from './config'

module.exports = new Container().get(ConnectionConfig).getConfig()