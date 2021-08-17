import { Service } from 'typedi';

@Service()
class Flow {
  onUpdate(self) {
    return () => {
      self.props.onUpdate(self.serialize());
    };
  }
  
  onDelete(self) {
    return (event) => {
      event.preventDefault();
  
      self.props.onPop();
    };
  }
}

export default Flow;
