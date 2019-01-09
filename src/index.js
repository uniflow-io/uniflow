import React from 'react'
import { render } from 'react-dom'

import App from './App'

const ENV = {
    facebookAppId: process.env.FACEBOOK_APP_ID,
    githubAppId: process.env.GITHUB_APP_ID,
    mediumAppId: process.env.MEDIUM_APP_ID
}

render(<App env={ENV} />, document.getElementById('app'))
