class Program
{
  constructor(private data) {
  }

  serializeFlowsData(data) {
    this.data = JSON.stringify(data)
  }

  deserializeFlowsData() {
    return JSON.parse(this.data)
  }
}

module.exports = Program
