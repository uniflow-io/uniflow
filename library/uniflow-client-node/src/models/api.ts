class Api {
  constructor(private env: any, private key: any) {
  }

  endpoint(endpoint: any, params:any = []) {
    let httpHost = 'https://api.uniflow.io'
    if (this.env === 'dev') {
      httpHost = 'http://127.0.0.1:8017'
    }
    const endpoints: any = {
      program: `/api/v1/uniflow/program/me/list?client=node&apiKey=${this.key}`,
      program_flows: `/api/v1/uniflow/program/{uid}/flows?apiKey=${this.key}`,
    }
    let path = Object.keys(params).reduce(function(path: any, key: any) {
      return path.replace('{' + key + '}', params[key])
    }, endpoints[endpoint])

    return fetch(httpHost + path)
  }
}

export default Api
