import React from 'react';
import { Link } from 'gatsby';
import { Remarkable } from 'remarkable';
import { toFeedPath } from '../contexts/feed';
import { useUser } from '../contexts';
import { useState } from 'react';
import { useEffect } from 'react';
import Container from '../container';
import { Api } from '../services';
import { ProgramApiType } from '../models/api-type-interface';
import { FC } from 'react';

const container = new Container();
const api = container.get(Api);

export interface FlowsProps {}

export interface FlowsState {}

const Flows: FC<FlowsProps> = () => {
  const [page, setPage] = useState<number>(1);
  const [programs, setPrograms] = useState<ProgramApiType[]>([]);
  const [state, setState] = useState<'loaded' | 'load-more' | 'loading'>('loaded');
  const { user } = useUser();
  const md = new Remarkable();

  const onFetchPrograms = async () => {
    setState('loading');
    const programsPagination = await api.getPrograms({ page });
    const fetchPrograms = programs.slice().concat(programsPagination.data);
    setPage(page + 1);
    setPrograms(fetchPrograms);
    setState(fetchPrograms.length < programsPagination.total ? 'load-more' : 'loaded');
  };

  useEffect(() => {
    onFetchPrograms();
  }, []);

  return (
    <section className="section container-fluid">
      <div className="row">
        <div className="col-md-12">
          <h3>Flows</h3>
          <dl className="row">
            {programs.map((program, i) => [
              <dt className="col-md-2 text-md-end fw-normal" key={i * 2}>
                <Link to={toFeedPath(program, user)}>{program.name}</Link>
              </dt>,
              <dd
                className="col-md-10"
                key={i * 2 + 1}
                dangerouslySetInnerHTML={{ __html: md.render(program.description) }}
              ></dd>,
            ])}
          </dl>
          {(state === 'loading' || state === 'load-more') && (
            <div className="row">
              <div className="col-md-12">
                <div className="d-grid">
                  {state === 'load-more' && (
                    <button className="btn btn-primary" onClick={onFetchPrograms}>
                      Load more
                    </button>
                  )}
                  {state === 'loading' && (
                    <button className="btn btn-primary" type="button" disabled>
                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Loading...
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Flows;
