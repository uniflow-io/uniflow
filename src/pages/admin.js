import React from 'react'
import {Admin} from '../views'
import Layout from "../layouts";
import {requireAuthentication} from '../components'

const AuthAdmin = requireAuthentication(Admin, 'ROLE_SUPER_ADMIN')

export default ({location}) => <Layout location={location}><AuthAdmin/></Layout>
