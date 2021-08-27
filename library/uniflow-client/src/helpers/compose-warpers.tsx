import React from 'react';
import { FC } from 'react';

export default function composeWrappers(
  wrappers: FC[]
): FC {
  return wrappers.reduce((Acc, Current): FC => {
    return props => <Current><Acc {...props} /></Current>
  });
}
