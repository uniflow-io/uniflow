import bashBridge from '../bridges/bash'
import consoleBridge from '../bridges/console'
//import filesystemBridge from '../bridges/filesystem'
import readlineBridge from '../bridges/readline'
import processBridge from '../bridges/process'
import fetchBridge from '../bridges/fetch'
import httpBridge from '../bridges/http'
import querystringBridge from '../bridges/querystring'
import child_processBridge from '../bridges/child_process'
import vm from 'vm'

class Runner
{
  constructor(private commandArgs: any, private api: any) {
  }

  run(flows: any[]) {
    const context = vm.createContext({
      Bash: bashBridge(this.commandArgs),
      console: consoleBridge,
      //filesystem: filesystemBridge,
      readline: readlineBridge,
      process: processBridge,
      fetch: fetchBridge,
      http: httpBridge,
      querystring: querystringBridge,
      child_process: child_processBridge,
    })
  
    return flows.reduce((promise: any, flow: any) => {
      let interpreter = null
      if(flow.flow === '@uniflow-io/uniflow-flow-object') {
        const transform = (list: any): {[key: string]: string|number} => {
          return list.reduce(function(object: any, item: any) {
            if (item.key) {
              let value: string|number = item.value
              if (typeof value === 'string' && /^[0-9]+$/.test(value)) {
                value = Number.parseInt(value)
              }
      
              object[item.key] = value
            }
            return object
          }, {}) || {}
        }
      
        const reverseTransform = (object: {[key: string]: string|number}): {key: string, value: string|number}[] => {
          let flatten = function(data: any, accessors: any[] = []) {
            return Object.entries(data).reduce(function(list: {key: string, value: string|number}[], item: any) {
              if (typeof item[1] === 'object') {
                list = list.concat(flatten(item[1], accessors.concat([item[0] as never])))
              } else {
                let key = item[0]
                for (let i = accessors.length - 1; i >= 0; i--) {
                  if (key[0] !== '[') {
                    key = '.' + key
                  }
      
                  if (/^[0-9]+$/.test(accessors[i])) {
                    key = '[' + accessors[i] + ']' + key
                  } else {
                    key = accessors[i] + key
                  }
                }
                list.push({ key: key, value: item[1] })
              }
              return list
            }, [])
          }
      
          return flatten(object)
        }
        interpreter = {
          onDeserialize: (data?: string) => {
            let [variable, object] = data ? JSON.parse(data) : [undefined, []]
            let keyValueList = reverseTransform(object)
      
            return { variable, keyValueList }
          },
          onCompile: (data: any): string => {
            if (!data || !data.variable) {
              return ''
            }
      
            let object = transform(data.keyValueList)
            return 'var ' + data.variable + ' = ' + JSON.stringify(object)
          }
        }
      } else if(flow.flow === '@uniflow-io/uniflow-flow-text') {
        interpreter = {
          onDeserialize: (data?: string) => {
            const [variable, text] = data ? JSON.parse(data) : [undefined, undefined]
            return { variable, text }
          },
          onCompile: (data: any): string => {
            if (!data || !data.variable) {
              return ''
            }
      
            let text = data.text || ''
            text = JSON.stringify(text)
      
            return 'var ' + data.variable + ' = ' + text
          }
        }
      } else if(flow.flow === '@uniflow-io/uniflow-flow-function') {
        interpreter = {
          onDeserialize: (data?: string) => {
            const code = data ? JSON.parse(data) : undefined
            return { code }
          },
          onCompile: (data: any): string => {
            return data?.code || ''
          }
        }
      }

      if(interpreter) {
        const data = interpreter.onDeserialize(flow.data)
        const code = interpreter.onCompile(data)
        return promise.then(() => {
          return vm.runInContext(code || '', context)
        })
      }

      return promise
    }, Promise.resolve())
  }
}

export default Runner
