import React, { Component } from 'react'

const TYPE_PARAGRAPH = 1
const TYPE_TITLE = 3
const TYPE_IMAGE = 4

class Paragraph extends Component {
  render() {
    const { data, headline } = this.props

    if (data.type === TYPE_PARAGRAPH) {
      return <p>{data.text}</p>
    } else if (data.type === TYPE_TITLE) {
      return <h2>{data.text}</h2>
    } else if (data.type === TYPE_IMAGE) {
      let width = headline ? 1400 : data['metadata']['originalWidth']
      let height = headline ? 420 : data['metadata']['originalHeight']
      let src = `https://miro.medium.com/fit/c/${width}/${height}/${
        data['metadata']['id']
      }`
      return <img src={src} alt="" className="img-thumbnail" width="100%" />
    }

    return <div />
  }
}

export default Paragraph
