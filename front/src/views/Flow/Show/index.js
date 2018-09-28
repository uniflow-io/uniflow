import React, {Component} from 'react'
import _ from 'lodash'
import {Ace, ListComponent, TagIt, ICheckBox} from '../../../components/index'
import {History, Runner} from '../../../models/index'
import {
    commitPushFlow,
    commitPopFlow,
    commitUpdateFlow,
    commitSetFlow
} from '../../../reducers/flow/actions'
import {
    getCurrentHistory,
    getTags,
    commitUpdateHistory,
    createHistory,
    updateHistory,
    deleteHistory,
    getHistoryData,
    setHistoryData,
    setCurrentHistory
} from '../../../reducers/history/actions'
import {commitAddLog} from '../../../reducers/log/actions'
import {connect} from 'react-redux'
import Select2 from "../../../components/Select2";

class Show extends Component {
    state = {
        fetchedSlug: null,
        fetchedUsername: null,
        runIndex: null,
    }

    componentDidMount() {
        this._isMounted = true

        this.onFetchFlowData()
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    componentWillReceiveProps(nextProps) {
        const oldProps = this.props;

        if (nextProps.history.id !== oldProps.history.id) {
            this.onFetchFlowData();
        }
    }

    isMounted() {
        return this._isMounted;
    }

    run = (event, index) => {
        event.preventDefault()

        let stack = index === undefined ? this.props.stack : this.props.stack.slice(0, index + 1),
            runner = new Runner()

        runner.run(stack, (index) => {
            return new Promise((resolve) => {
                this.setState({runIndex: index}, resolve);
            });
        })
    }

    setFlow = (stack) => {
        return this.props
            .dispatch(commitSetFlow(stack))
            .then(() => {
                return Promise.all(stack.map((item) => {
                    return item.bus.emit('reset', item.data)
                }))
            })
    }

    onPushFlow = (index, component) => {
        this.props
            .dispatch(commitPushFlow(index, component))
            .then(() => {
                return this.setFlow(this.props.stack);
            }).then(() => {
            this.onUpdateFlowData()
        })
    }

    onPopFlow = (index) => {
        this.props
            .dispatch(commitPopFlow(index))
            .then(() => {
                return this.setFlow(this.props.stack);
            }).then(() => {
            this.onUpdateFlowData()
        })
    }

    onUpdateFlow = (index, data) => {
        this.props
            .dispatch(commitUpdateFlow(index, data))
            .then(() => {
                this.onUpdateFlowData()
            })
    }

    onFetchFlowData = _.debounce(() => {
        let {history} = this.props;

        Promise.resolve()
            .then(() => {
                return this.props.dispatch(commitSetFlow([]));
            })
            .then(() => {
                if (history.data) {
                    return history.data;
                }

                return this.props.dispatch(getHistoryData(history, this.props.auth.token));
            })
            .then((data) => {
                if (!data) return;

                history.data = data;

                if (history.slug !== this.props.history.slug) return;

                return this.setFlow(history.deserialiseFlowData());
            })
            .then(() => {
                if (this.isMounted()) {
                    this.setState({fetchedSlug: history.slug})
                }
            })
    }, 500)

    onUpdateFlowData = _.debounce(() => {
        let {history, stack} = this.props
        if (history.slug !== this.state.fetchedSlug) return;

        let data = history.data;
        history.serialiseFlowData(stack);
        if (history.data !== data) {
            this.props
                .dispatch(setHistoryData(history, this.props.auth.token))
                .catch((log) => {
                    return this.props.dispatch(commitAddLog(log.message))
                })
        }
    }, 500)

    onChangeTitle = (event) => {
        this.props
            .dispatch(commitUpdateHistory({...this.props.history, ...{title: event.target.value}}))
            .then(() => {
                this.onUpdate()
            })
    }

    onChangeSlug = (event) => {
        this.props
            .dispatch(commitUpdateHistory({...this.props.history, ...{slug: event.target.value}}))
            .then(() => {
                this.onUpdate()
            })
    }

    onChangePlatform = (selected) => {
        this.props
            .dispatch(commitUpdateHistory({...this.props.history, ...{platform: selected}}))
            .then(() => {
                this.onUpdate()
            })
    }

    onChangeTags = (tags) => {
        this.props
            .dispatch(commitUpdateHistory({...this.props.history, ...{tags: tags}}))
            .then(() => {
                this.onUpdate()
            })
    }

    onChangeDescription = (description) => {
        this.props
            .dispatch(commitUpdateHistory({...this.props.history, ...{description: description}}))
            .then(() => {
                this.onUpdate()
            })
    }

    onChangePrivate = (value) => {
        this.props
            .dispatch(commitUpdateHistory({...this.props.history, ...{private: value}}))
            .then(() => {
                this.onUpdate()
            })
    }

    onUpdate = _.debounce(() => {
        this.props.dispatch(updateHistory(this.props.history, this.props.auth.token))
    }, 500)

    onDuplicate = (event) => {
        event.preventDefault()

        let history = new History(this.props.history);
        history.title += ' Copy';

        this.props.dispatch(createHistory(history, this.props.auth.token))
            .then((item) => {
                Object.assign(history, item)
                return this.props.dispatch(setHistoryData(history, this.props.auth.token));
            })
            .then(() => {
                return this.props.dispatch(setCurrentHistory(history.id));
            })
            .catch((log) => {
                return this.props.dispatch(commitAddLog(log.message))
            })
        ;
    }

    onDelete = (event) => {
        event.preventDefault()

        return this.props.dispatch(deleteHistory(this.props.history, this.props.auth.token));
    }

    render() {
        const {history, tags, stack, platform} = this.props;
        const tagsOptions     = {
            availableTags: tags
        }
        const platforms = {
            'uniflow': 'Uniflow',
            'bash': 'Bash',
            'phpstorm': 'PhpStorm',
            'chrome': 'Chrome'
        }

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
                                           value={history.title} onChange={this.onChangeTitle} placeholder="Title"/>
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="info_slug_{{ _uid }}" className="col-sm-2 control-label">Slug</label>

                                <div className="col-sm-10">
                                    <input type="text" className="form-control" id="info_slug_{{ _uid }}"
                                           value={history.slug} onChange={this.onChangeSlug} placeholder="Slug"/>
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="info_platform_{{ _uid }}" className="col-sm-2 control-label">Platform</label>

                                <div className="col-sm-10">
                                    <Select2 value={history.platform} onChange={this.onChangePlatform} className="form-control" id="info_platform_{{ _uid }}" style={{width: '100%'}}>
                                        {Object.keys(platforms).map((value) => (
                                            <option key={value} value={value}>{ platforms[value] }</option>
                                        ))}
                                    </Select2>
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="info_tags_{{ _uid }}" className="col-sm-2 control-label">Tags</label>

                                <div className="col-sm-10">
                                    <TagIt type="text" className="form-control" id="info_tags_{{ _uid }}"
                                           value={history.tags} onChange={this.onChangeTags} options={tagsOptions}
                                           placeholder="Tags"/>
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="private{{ _uid }}" className="col-sm-2 control-label">Private</label>

                                <div className="col-sm-10">
                                    <ICheckBox value={history.private} onChange={this.onChangePrivate} />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="info_description_{{ _uid }}"
                                       className="col-sm-2 control-label">Description</label>

                                <div className="col-sm-10">
                                    <Ace className="form-control" id="info_description_{{ _uid }}"
                                         value={history.description} onChange={this.onChangeDescription}
                                         placeholder="Text" height="200"/>
                                </div>
                            </div>

                        </form>
                    </div>
                    <div className="box-footer">
                        {history.platform === 'uniflow' && (
                        <a className="btn btn-success" onClick={this.run}><i className="fa fa-fw fa-play"/> Play</a>
                        )}
                    </div>
                </div>

                <ListComponent stack={stack} runIndex={this.state.runIndex}
                               onPush={this.onPushFlow}
                               onPop={this.onPopFlow}
                               onUpdate={this.onUpdateFlow}
                               onRun={this.run}
                />
            </div>
        )
    }
}

export default connect(state => {
    return {
        auth: state.auth,
        history: getCurrentHistory(state.history),
        tags: getTags(state.history),
        stack: state.flow
    }
})(Show)
