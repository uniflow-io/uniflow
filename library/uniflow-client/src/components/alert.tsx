import React, { useState } from 'react';

export enum AlertType {
  SUCCESS = 'SUCCESS',
  DANGER = 'DANGER',
}

export interface AlertProps {
  type: AlertType
  children: React.ReactNode
  onClose?: React.MouseEventHandler<HTMLButtonElement>
}

function Alert(props: AlertProps) {
  const {type, children, onClose} = props
  const [isClosed, setIsClosed] = useState<Boolean>(false)

  const defaultOnClose: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();

    setIsClosed(true)
  }

  return isClosed ? (
    <></>
  ) : (
    <div className={`alert alert-${type === AlertType.DANGER ? 'danger' : 'success'} alert-dismissible fade show`} role="alert">
      {type === AlertType.SUCCESS && (
      <svg className="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Success:"><use xlinkHref="#check-circle-fill"/></svg>
      )}
      {type === AlertType.DANGER && (
      <svg className="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Danger:"><use xlinkHref="#exclamation-triangle-fill"/></svg>
      )}
      {children}
      <button
        type="button"
        className="btn-close"
        data-dismiss="alert"
        aria-label="Close"
        onClick={onClose ?? defaultOnClose}
      ></button>
    </div>
  );
}

export default Alert