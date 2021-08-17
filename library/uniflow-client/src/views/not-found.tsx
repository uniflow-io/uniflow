import React from 'react';

export interface NotFoundProps {
}

function NotFound(props: NotFoundProps) {
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

export default NotFound