import React from 'react'
import { render } from 'react-dom'

import App from './App'

const ENV = {
    facebookAppId: process.env.FACEBOOK_APP_ID,
}

render(<App env={ENV} />, document.getElementById('app'))
