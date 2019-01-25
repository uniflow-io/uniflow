import React from 'react'
import {Feed} from '../views'
import Layout from "../layouts";
import {requireAuthentication} from '../components'

const Component = requireAuthentication(Feed)

export default ({location}) => <Layout location={location}><Component/></Layout>
