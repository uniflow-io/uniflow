import React from 'react'
import { Admin } from '../views'
import { requireAuthentication } from '../components'

const AuthAdmin = requireAuthentication(Admin, 'ROLE_SUPER_ADMIN')

export default () => <AuthAdmin />
