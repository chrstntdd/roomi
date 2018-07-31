import React from 'react';

import { noop } from '@/util';

interface PState {
  onChange?: (any) => any;
  children: (any) => any;
  initial: any;
}
interface SState {}

export class State extends React.Component<PState, SState> {
  state = { ...this.props.initial };

  internalSetState = (updaterFn, cb = noop) => {
    const { onChange = noop } = this.props;

    this.setState(updaterFn, () => {
      onChange(this.state);
      cb();
    });
  };

  render() {
    return this.props.children({
      state: this.state,
      setState: this.internalSetState
    });
  }
}

export default State;
