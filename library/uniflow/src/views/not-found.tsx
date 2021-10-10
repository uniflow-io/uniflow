import React from 'react';
import { FC } from 'react';

export interface NotFoundProps {}

const NotFound: FC<NotFoundProps> = () => {
  return (
    <section className="section container-fluid">
      <div className="row">
        <div className="col-md-12">
          <h3>404</h3>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
