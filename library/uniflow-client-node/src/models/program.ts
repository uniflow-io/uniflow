class Program
{
  constructor(private programData: any) {
  }

  serializeFlowsData(data: any) {
    this.programData.data = JSON.stringify(data)
  }

  deserializeFlowsData() {
    return JSON.parse(this.programData.data)
  }
}

export default Program
