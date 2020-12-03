import React from "react"
import { MDXProvider } from "@mdx-js/react"
import { Link } from "gatsby"
import { Ace } from "../components"

const components = {
  h1: (props) => (
    <h3 className={"mb-3"} {...props}>
      {props.children}
    </h3>
  ),
  h2: (props) => <h4 {...props}>{props.children}</h4>,
  h3: (props) => <h5 {...props}>{props.children}</h5>,
  h4: (props) => <h5 {...props}>{props.children}</h5>,
  a: (props) => {
    if (props.href.indexOf("https://uniflow.io") === 0) {
      const to = props.href.slice(18)
      return <Link to={to.length === 0 ? "/" : to}>{props.children}</Link>
    }

    return (
      <a href={props.href} target="_blank" rel="noopener noreferrer">
        {props.children}
      </a>
    )
  },
  img: (props) => (
    <span className="d-flex">
      <img className="img-fluid mx-auto" alt={props.alt} {...props} />
    </span>
  ),
  Link,
  code: (props) => {
    let mode = ""
    if (props.className === "language-bash") {
      mode = "batchfile"
    }
    if (props.className === "language-javascript") {
      mode = "javascript"
    }
    if (props.className === "language-jsx") {
      mode = "jsx"
    }

    return (
      <code {...props}>
        <Ace layout="text" value={props.children} mode={mode} />
      </code>
    )
  },
}

export default (props) => <MDXProvider components={components}>{props.children}</MDXProvider>
