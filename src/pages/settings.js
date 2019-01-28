import React from 'react'
import {Settings} from '../views'
import {requireAuthentication} from '../components'

const AuthSettings = requireAuthentication(Settings)

export default () => <AuthSettings/>
