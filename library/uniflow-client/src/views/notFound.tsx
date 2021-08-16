import React, { Component } from 'react';

export interface NotFoundProps {}

export default class NotFound extends Component<NotFoundProps> {
  render() {
    return (
      <section className="section container-fluid">
        <div className="row">
          <div className="col-md-12">
            <h3>404</h3>
          </div>
        </div>
      </section>
    );
  }
}
