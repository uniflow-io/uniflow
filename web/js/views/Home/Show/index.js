import React, { Component } from 'react'
import moment from 'moment'
import { Ace, TagIt } from 'uniflow/components/index'
import Search from './Search/index'
import components from 'uniflow/uniflow/components';

class UiComponent extends Component {
    components = Object.assign({}, components, {
        'search': Search
    })

    render() {
        const TagName = this.components[this.props.tag || 'foo'];
        return <TagName />
    }
}

export default class Show extends Component {
    state = {
        stack: [],
        history: {
            id: 1,
            title: 'sample',
            tags: ['deed'],
            description: 'description',
            updated: moment()
        },
        fetchedId: null,
        runIndex: null,
    }

    run = (event, index) => {
        event.preventDefault()
    }

    onUpdateTitle = (event) => {
        this.setState({history: {...this.state.history, ...{title: event.target.value}}})
        this.onUpdate();
    }

    onUpdateTags = (tags) => {
        this.setState({history: {...this.state.history, ...{tags: tags}}})
        this.onUpdate();
    }

    onUpdateDescription = (description) => {
        this.setState({history: {...this.state.history, ...{description: description}}})
        this.onUpdate();
    }

    onUpdate = () => {

    }

    onDuplicate = (event) => {
        event.preventDefault()
    }

    onDelete = (event) => {
        event.preventDefault()
    }

    render() {
        const history = (() => {
            return this.state.history;
        })()

        const stack = (() => {
            return this.state.stack;
        })()

        const uiStack = (() => {
            let uiStack = [{
                component: 'search',
                index: 0
            }];

            for(let i = 0; i < stack.length; i ++) {
                let item = stack[i];

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
                            <a className="btn btn-box-tool" onClick={this.onDuplicate}><i className="fa fa-clone" /></a>
                            <a className="btn btn-box-tool" onClick={this.onDelete}><i className="fa fa-times" /></a>
                        </div>
                    </div>
                    <div className="box-body">
                        <form className="form-horizontal">

                            <div className="form-group">
                                <label htmlFor="info_title_{{ _uid }}" className="col-sm-2 control-label">Title</label>

                                <div className="col-sm-10">
                                    <input type="text" className="form-control" id="info_title_{{ _uid }}" value={history.title} onChange={this.onUpdateTitle} placeholder="Title" />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="info_tags_{{ _uid }}" className="col-sm-2 control-label">Tags</label>

                                <div className="col-sm-10">
                                    <TagIt type="text" className="form-control" id="info_tags_{{ _uid }}" value={history.tags} onChange={this.onUpdateTags} options={tagsOptions} placeholder="Tags" />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="info_description_{{ _uid }}" className="col-sm-2 control-label">Description</label>

                                <div className="col-sm-10">
                                    <Ace className="form-control" id="info_description_{{ _uid }}" value={history.description} onChange={this.onUpdateDescription} placeholder="Text" height="200" />
                                </div>
                            </div>

                        </form>
                    </div>
                </div>

                <ul className="timeline">
                    <li className="time-label">
                      <span className="bg-green">
                        <a className="btn btn-success pull-right" onClick={this.run}><i className="fa fa-fw fa-play" /> Play</a>
                      </span>
                    </li>
                    {uiStack.map((item, i) => (
                    <li key={i}>
                        {item.component !== 'search' && (
                            <i className="fa fa-play bg-blue" onClick={this.run(item.index)} />
                        )}

                        <div className={"timeline-item" + (item.active ? ' bg-green' : '') + (item.component !== 'search' ? ' component' : '')}>
                            <div className="timeline-body">
                                <UiComponent tag={item.component} />
                                {/*<div :is="item.component" :bus="item.bus"
                                     @push="onPushFlow(arguments[0], item.index)"
                                     @pop="onPopFlow(item.index)"
                                     @update="onUpdateFlow(arguments[0], item.index)"
                                />*/}
                            </div>
                        </div>
                    </li>
                    ))}
                </ul>
            </div>
        )
    }
}
    