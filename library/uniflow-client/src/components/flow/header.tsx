import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FC } from 'react';

export interface FlowHeaderProps {
  title?: string;
  clients: string[];
  isPlaying: boolean
  onPop: () => void
  onPlay: () => void
}

const FlowHeader: FC<FlowHeaderProps> = (props) => {
  const onDelete: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();

    props.onPop();
  }

  return (
    <div className="row">
      <div className="col-4 col-sm-2">
        <h4>{props.title ? props.title : 'Flow'}</h4>
      </div>
      <div className="col">
        <div className="btn-toolbar" role="toolbar" aria-label="flow actions">
          <div className="btn-group-sm" role="group">
            {props.clients.indexOf('uniflow') !== -1 && props.isPlaying === false && (
              <button type="button" className="btn btn-primary" onClick={props.onPlay}>
                <FontAwesomeIcon icon={faPlay} />
              </button>
            )}
            {props.clients.indexOf('uniflow') !== -1 && props.isPlaying === true && (
              <button type="button" className="btn">
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                />
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="d-block col-auto">
        <div className="btn-toolbar" role="toolbar" aria-label="flow actions">
          <div className="btn-group-sm" role="group">
            <button type="button" className="btn" onClick={onDelete}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlowHeader;
