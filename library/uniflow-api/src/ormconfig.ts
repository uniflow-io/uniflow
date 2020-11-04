import { Container } from 'typedi'
import { ConnectionConfig } from './config'

Container.set('env', process.env.NODE_ENV || 'development')
module.exports = Container.get(ConnectionConfig).getConfig()