import React, { Component } from 'react'

class Paragraph extends Component {
  render() {
    const { data } = this.props

    if (data.type === 1) {
      return <p>{data.text}</p>
    } else if (data.type === 3) {
      return <h2>{data.text}</h2>
    } else if (data.type === 4) {
      let src = `https://miro.medium.com/fit/c/1400/420/${
        data['metadata']['id']
      }`
      return <img src={src} alt="" className="img-thumbnail" width="100%" />
    }

    return <div />
  }
}

export default Paragraph
