import React from 'react'
import { render } from 'react-dom'

import App from 'uniflow'

const ENV = {
    facebookAppId: process.env.FACEBOOK_APP_ID,
    githubAppId: process.env.GITHUB_APP_ID,
}

render(<App env={ENV} />, document.getElementById('app'))
