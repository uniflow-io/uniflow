import React, { Component } from "react"
import { Link } from "gatsby"
import { ApiException } from "../exceptions"
import { createLead } from "../reducers/lead/actions"
import { pathTo } from "../routes"

class Home extends Component {
  state = {
    email: "",
    errors: {},
    state: "form",
  }

  onChangeEmail = (event) => {
    this.setState({ email: event.target.value })
  }

  onSubmit = (e) => {
    e.preventDefault()

    this.setState({ state: "sending" }, () => {
      this.props
        .dispatch(
          createLead({
            email: this.state.email,
            optinNewsletter: true,
            optinBlog: true,
          })
        )
        .then((data) => {
          if (data) {
            this.setState({ state: "sent" })
          }
        })
        .catch((error) => {
          if (error instanceof ApiException) {
            this.setState({ state: "form", errors: { ...error.errors } })
          }
        })
    })
  }

  render() {
    const { email, errors, state } = this.state
    const options = {
      height: 200,
      width: 300,
      amplitude: 20,
      speed: 0.15,
      points: 3,
      fill: "#FF00FF",
    }

    let step = 0

    const calculateWavePoints = () => {
      const points = []
      for (let i = 0; i <= Math.max(options.points, 1); i++) {
        const scale = 100
        const x = (i / options.points) * options.width
        const seed = (step + (i + (i % options.points))) * options.speed * scale
        const height = Math.sin(seed / scale) * options.amplitude
        const y = Math.sin(seed / scale) * height + options.height
        points.push({ x, y })
      }
      return points
    }

    const buildPath = (points) => {
      let svg = `M ${points[0].x} ${points[0].y}`
      const initial = {
        x: (points[1].x - points[0].x) / 2,
        y: points[1].y - points[0].y + points[0].y + (points[1].y - points[0].y),
      }
      const cubic = (a, b) => ` C ${a.x} ${a.y} ${a.x} ${a.y} ${b.x} ${b.y}`
      svg += cubic(initial, points[1])
      let point = initial
      for (let i = 1; i < points.length - 1; i++) {
        point = {
          x: points[i].x - point.x + points[i].x,
          y: points[i].y - point.y + points[i].y,
        }
        svg += cubic(point, points[i + 1])
      }
      svg += ` L ${options.width} ${options.height}`
      svg += ` L 0 ${options.height} Z`
      return svg
    }

    const path = buildPath(calculateWavePoints())
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' version='1.1' width='${options.width}' height='${options.height}'><path d='${path}' fill='${options.fill}' /></svg>`

    return (
      <>
        <div
          className="section-wrapper"
          style={{
            background: `url("data:image/svg+xml;utf8,${svg}")`,
          }}
        >
          <section className="section container vh-100">
            <div className="row h-100 align-items-center">
              <div className="col-md-12 text-center">
                <h1>Unified Workflow Automation Tool</h1>
                <p>Take advantage of Flow Based Programming to automate your recurring tasks.</p>

                <div id="newsletter-optin" className="d-flex justify-content-center pt-md-5">
                  {state === "sent" && (
                    <div className="alert alert-success text-center" role="alert">
                      {email} was succefully registered to the newsletter.
                      <br />
                      Let's check <Link to={pathTo("tag", { tag: "case-study" })}>some cases studies</Link> to get
                      started.
                    </div>
                  )}
                  {(state === "form" || state === "sending") && (
                    <div className={`input-group input-group-lg${errors.email ? " is-invalid" : ""}`}>
                      <input
                        className={`form-control${errors.email ? " is-invalid" : ""}`}
                        id="email{{ _uid }}"
                        type="text"
                        value={email || ""}
                        onChange={this.onChangeEmail}
                        placeholder="Email"
                      />
                      <div className="input-group-append">
                        <button
                          type="submit"
                          className="btn btn-primary btn-block btn-flat"
                          disabled={state === "sending"}
                          onClick={this.onSubmit}
                        >
                          Subscribe to the newsletter
                        </button>
                      </div>
                      {errors.email &&
                        errors.email.map((message, i) => (
                          <div key={`error-${i}`} className="invalid-feedback" htmlFor="email{{ _uid }}">
                            {message}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
        <section className="section container">
          <div className="row py-5">
            <div className="col-lg-12 text-center">
              <h2>Features</h2>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-4 py-md-5">
              <h3>Note taking philosophy</h3>
              <p>Create your Flows as you take note.</p>
            </div>
            <div className="col-lg-4 py-md-5">
              <h3>Modulable</h3>
              <p>Create your own specific Flows.</p>
            </div>
            <div className="col-lg-4 py-md-5">
              <h3>Multiple clients</h3>
              <p>Run your Flows on dedicated Clients.</p>
            </div>
            <div className="col-lg-4 py-md-5">
              <h3>Open</h3>
              <p>Uniflow is fair-code licensed.</p>
            </div>
            <div className="col-lg-4 py-md-5">
              <h3>Control your data</h3>
              <p>Install and run Uniflow locally.</p>
            </div>
            <div className="col-lg-4 py-md-5">
              <h3>Community</h3>
              <p>Get inspiration from community.</p>
            </div>
          </div>
        </section>
      </>
    )
  }
}

export default Home
