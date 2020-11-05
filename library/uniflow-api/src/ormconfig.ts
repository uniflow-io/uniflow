import { default as Container } from './container'
import { ConnectionConfig } from './config'

module.exports = Container.get(ConnectionConfig).getConfig()