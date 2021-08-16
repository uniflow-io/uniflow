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
  onExecuteHelper,
  onUpdate,
  onDelete,
};
