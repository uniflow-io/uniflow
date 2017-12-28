import React, {Component} from 'react'
import Interpreter from 'acorn-interpreter'
import {transform} from 'babel'
import _ from 'lodash'
import axios from 'axios'
import {Ace, TagIt} from 'uniflow/components/index'
import {Bus, History} from 'uniflow/models/index'
import Search from './Search/index'
import components from 'uniflow/uniflow/components';
import {
    getCurrentHistory,
    commitUpdateHistory,
    createHistory,
    updateHistory,
    deleteHistory,
    setHistoryData,
    setCurrentHistory
} from 'uniflow/reducers/history/actions'
import {connect} from 'react-redux'

class UiComponent extends Component {
    components = Object.assign({}, components, {
        'search': Search
    })

    render() {
        const {tag, bus, onPush, onPop, onUpdate} = this.props
        const TagName                             = this.components[tag];

        return <TagName bus={bus}
                        onPush={onPush}
                        onPop={onPop}
                        onUpdate={onUpdate}/>
    }
}

class Show extends Component {
    state = {
        fetchedId: null,
        runIndex: null,
    }

    componentDidMount() {
        this.onFetchFlowData()
    }

    run = (event, index) => {
        event.preventDefault()

        let indexes = [];
        if (index === undefined) {
            for (let i = 0; i < this.state.stack.length; i++) {
                indexes.push(i);
            }
        } else {
            indexes.push(index);
        }

        //get polyfill
        /*if(cachedPolyfillJS) return cachedPolyfillJS;

         return axios.get('/js/libs/babel-polyfill.min.js')
         .then(function(response) {
         cachedPolyfillJS = response.data;

         return cachedPolyfillJS;
         })*/

        let interpreter = new Interpreter('', (interpreter, scope) => {
            let initConsole = function () {
                let consoleObj = interpreter.createObject(interpreter.OBJECT);
                interpreter.setProperty(scope, 'console', consoleObj);

                let wrapper = function (value) {
                    let nativeObj = interpreter.pseudoToNative(value);
                    return interpreter.createPrimitive(console.log(nativeObj));
                };
                interpreter.setProperty(consoleObj, 'log', interpreter.createNativeFunction(wrapper));
            };
            initConsole.call(interpreter);

            indexes.reduce((stack, index) => {
                stack[index].bus.emit('compile', interpreter, scope);

                return stack
            }, this.state.stack);
        });

        let runner = {
            hasValue: function (variable) {
                let scope   = interpreter.getScope();
                let nameStr = variable.toString();
                while (scope) {
                    if (nameStr in scope.properties) {
                        return true;
                    }
                    scope = scope.parentScope;
                }

                return false;
            },
            getValue: function (variable) {
                return interpreter.pseudoToNative(interpreter.getValueFromScope(variable));
            },
            setValue: function (variable, value) {
                return interpreter.setValueToScope(variable, interpreter.nativeToPseudo(value));
            },
            eval: function (code) {
                if (code === undefined) return;

                /*let babelCode = transform(code, {
                    presets: [
                        'es2015',
                        'es2015-loose',
                        'es2016',
                        'es2017',
                        'latest',
                        'react',
                        'stage-0',
                        'stage-1',
                        'stage-2',
                        'stage-3'
                    ],
                    filename: 'repl',
                    babelrc: false,
                });

                interpreter.appendCode(babelCode.code);*/

                interpreter.appendCode(code);

                return interpreter.run();
            }
        };

        return indexes.reduce((promise, index) => {
            return promise
                .then(() => {
                    return new Promise((resolve) => {
                        this.setState({runIndex: index}, resolve);
                    });
                }).then(() => {
                    return this.state.stack[index].bus.emit('execute', runner);
                }).then(() => {
                    return new Promise((resolve) => {
                        this.setState({runIndex: null}, resolve);
                    });
                });
        }, Promise.resolve());
    }

    setFlow = (stack) => {
        this.setState({stack: stack}, () => {
            for (let i = 0; i < stack.length; i++) {
                let item = stack[i];
                item.bus.emit('reset', item.data);
            }
        })
    }

    onPushFlow = (component, index) => {
        this.state.stack.splice(index, 0, {
            component: component,
            bus: new Bus()
        })
        this.setState({stack: this.state.stack})

        this.setFlow(this.state.stack);
        this.onUpdateFlowData()
    }

    onPopFlow = (index) => {
        this.state.stack.splice(index, 1)
        this.setState({stack: this.state.stack})

        this.setFlow(this.state.stack);
        this.onUpdateFlowData()
    }

    onUpdateFlow = (data, index) => {
        this.state.stack[index].data = data;
        this.setState({stack: this.state.stack})

        this.onUpdateFlowData()
    }

    onFetchFlowData = () => {

    }

    onUpdateFlowData = () => {

    }

    onUpdateTitle = (event) => {
        this.props.dispatch(commitUpdateHistory({...this.props.history, ...{title: event.target.value}}))
            .then(() => {
                this.onUpdate()
            })
    }

    onUpdateTags = (tags) => {
        this.props.dispatch(commitUpdateHistory({...this.props.history, ...{tags: tags}}))
            .then(() => {
                this.onUpdate()
            })
    }

    onUpdateDescription = (description) => {
        this.props.dispatch(commitUpdateHistory({...this.props.history, ...{description: description}}))
            .then(() => {
                this.onUpdate()
            })
    }

    onUpdate = _.debounce(() => {
        this.props.dispatch(updateHistory(this.props.history))
    }, 500)

    onDuplicate = (event) => {
        event.preventDefault()

        let history = new History(this.props.history);
        history.title += ' Copy';

        this.props.dispatch(createHistory(history))
            .then((item) => {
                history.id = item.id;
                return this.props.dispatch(setHistoryData(history));
            })
            .then(() => {
                return this.props.dispatch(setCurrentHistory(history.id));
            });
    }

    onDelete = (event) => {
        event.preventDefault()

        return this.props.dispatch(deleteHistory(this.props.history));
    }

    render() {
        const {history} = this.props;

        const uiStack = (() => {
            let uiStack = [{
                component: 'search',
                index: 0
            }];

            for (let i = 0; i < this.props.stack.length; i++) {
                let item = this.props.stack[i];

                uiStack.push({
                    component: item.component,
                    bus: item.bus,
                    active: this.state.runIndex === i,
                    index: i
                });

                uiStack.push({
                    component: 'search',
                    index: i + 1
                });
            }

            return uiStack;
        })()

        const tagsOptions = (() => {
            return {
                availableTags: ['coucou', 'dodo']
            }
        })()

        return (
            <div>
                <div className="box box-primary">
                    <div className="box-header with-border">
                        <h3 className="box-title">Infos</h3>
                        <div className="box-tools pull-right">
                            <a className="btn btn-box-tool" onClick={this.onDuplicate}><i className="fa fa-clone"/></a>
                            <a className="btn btn-box-tool" onClick={this.onDelete}><i className="fa fa-times"/></a>
                        </div>
                    </div>
                    <div className="box-body">
                        <form className="form-horizontal">

                            <div className="form-group">
                                <label htmlFor="info_title_{{ _uid }}" className="col-sm-2 control-label">Title</label>

                                <div className="col-sm-10">
                                    <input type="text" className="form-control" id="info_title_{{ _uid }}"
                                           value={history.title} onChange={this.onUpdateTitle} placeholder="Title"/>
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="info_tags_{{ _uid }}" className="col-sm-2 control-label">Tags</label>

                                <div className="col-sm-10">
                                    <TagIt type="text" className="form-control" id="info_tags_{{ _uid }}"
                                           value={history.tags} onChange={this.onUpdateTags} options={tagsOptions}
                                           placeholder="Tags"/>
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="info_description_{{ _uid }}"
                                       className="col-sm-2 control-label">Description</label>

                                <div className="col-sm-10">
                                    <Ace className="form-control" id="info_description_{{ _uid }}"
                                         value={history.description} onChange={this.onUpdateDescription}
                                         placeholder="Text" height="200"/>
                                </div>
                            </div>

                        </form>
                    </div>
                </div>

                <ul className="timeline">
                    <li className="time-label">
                      <span className="bg-green">
                        <a className="btn btn-success pull-right" onClick={this.run}><i className="fa fa-fw fa-play"/> Play</a>
                      </span>
                    </li>
                    {uiStack.map((item, i) => (
                        <li key={i}>
                            {item.component !== 'search' && (
                                <i className="fa fa-play bg-blue" onClick={(event) => {
                                    this.run(event, item.index)
                                }}/>
                            )}

                            <div
                                className={"timeline-item" + (item.active ? ' bg-green' : '') + (item.component !== 'search' ? ' component' : '')}>
                                <div className="timeline-body">
                                    <UiComponent tag={item.component} bus={item.bus}
                                                 onPush={(component) => {
                                                     this.onPushFlow(component, item.index)
                                                 }}
                                                 onPop={() => {
                                                     this.onPopFlow(item.index)
                                                 }}
                                                 onUpdate={(data) => {
                                                     this.onUpdateFlow(data, item.index)
                                                 }}/>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        )
    }
}

export default connect(state => {
    return {
        history: getCurrentHistory(state.history),
        stack: state.flow
    }
})(Show)