import React from "react"
import Layout from './src/layouts'
import App from './src/App'
export const wrapPageElement = ({ element, props }) => {
    return <Layout {...props}>{element}</Layout>
}
export const wrapRootElement = App
