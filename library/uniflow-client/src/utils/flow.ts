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

export { onUpdate, onDelete };
