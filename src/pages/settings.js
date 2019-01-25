import React from 'react'
import {Settings} from '../views'
import Layout from "../layouts";
import {requireAuthentication} from '../components'

const AuthSettings = requireAuthentication(Settings)

export default ({location}) => <Layout location={location}><AuthSettings/></Layout>
