const setBusEvents = (busEvents, self) => {
  self.busEvents = busEvents;
};

const componentDidMount = (self) => {
  if (self.busEvents) {
    const { bus } = self.props;
    Object.keys(self.busEvents).forEach((key) => {
      bus.on(key, self.busEvents[key]);
    });
  }
};

const componentWillUnmount = (self) => {
  if (self.busEvents) {
    const { bus } = self.props;
    Object.keys(self.busEvents).forEach((key) => {
      bus.off(key, self.busEvents[key]);
    });
  }
};

const componentDidUpdate = (prevProps, self) => {
  if (self.busEvents && self.props.bus !== prevProps.bus) {
    Object.keys(self.busEvents).forEach((key) => {
      prevProps.bus.off(key, self.busEvents[key]);
      self.props.bus.on(key, self.busEvents[key]);
    });
  }
};

const onExecuteHelper = (onExecute, self) => {
  return async (runner) => {
    let returnValue = undefined;
    await new Promise((resolve) => {
      self.setState({ isRunning: true }, resolve);
    });
    returnValue = await onExecute(runner);
    await new Promise((resolve) => {
      setTimeout(resolve, 500);
    });
    await new Promise((resolve) => {
      self.setState({ isRunning: false }, resolve);
    });
    return returnValue;
  };
};

const onUpdate = (self) => {
  return () => {
    self.props.onUpdate(self.serialize());
  };
};

const onDelete = (self) => {
  return (event) => {
    event.preventDefault();

    self.props.onPop();
  };
};

export {
  setBusEvents,
  componentDidMount,
  componentWillUnmount,
  componentDidUpdate,
  onExecuteHelper,
  onUpdate,
  onDelete,
};
