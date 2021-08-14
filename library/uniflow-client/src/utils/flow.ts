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
  return (runner) => {
    let returnValue = undefined;
    return Promise.resolve()
      .then(() => {
        return new Promise((resolve) => {
          self.setState({ isRunning: true }, resolve);
        });
      })
      .then(() => {
        returnValue = onExecute(runner);
        return returnValue;
      })
      .then(() => {
        return new Promise((resolve) => {
          setTimeout(resolve, 500);
        });
      })
      .then(() => {
        return new Promise((resolve) => {
          self.setState({ isRunning: false }, resolve);
        });
      })
      .then(() => {
        return returnValue;
      });
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
