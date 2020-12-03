import React, { Component } from "react"
import { StaticQuery, graphql } from "gatsby"

class Changelog extends Component {
  render() {
    return (
      <section className="section container-fluid">
        <div className="row">
          <div className="col-md-12">
            <h3>Changelog</h3>
            <ul className="timeline">
              <StaticQuery
                query={graphql`
                  query ChangelogQuery {
                    allChangelogYaml {
                      edges {
                        node {
                          date(formatString: "MMMM Do YYYY")
                          label
                          tag
                        }
                      }
                    }
                  }
                `}
                render={(data) => {
                  const items = data.allChangelogYaml.edges
                  return items.map((item, index) => (
                    <li key={index}>
                      <a
                        href={
                          items[index + 1]
                            ? `https://github.com/uniflow-io/uniflow/compare/${items[index + 1].node.tag}...${
                                items[index].node.tag
                              }`
                            : `https://github.com/uniflow-io/uniflow/releases/tag/${item.node.tag}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {item.node.tag}
                      </a>
                      <span className="float-right">{item.node.date}</span>
                      <p>
                        {item.node.label.split("\n").map((item, key) => {
                          return (
                            <span key={key}>
                              {item}
                              <br />
                            </span>
                          )
                        })}
                      </p>
                      <hr />
                    </li>
                  ))
                }}
              />
            </ul>
          </div>
        </div>
      </section>
    )
  }
}

export default Changelog
