import React, { Component } from 'react'

export default class Search extends Component {
    render() {
        return (
            <div>search
            {/*<form class="form-horizontal" @submit.prevent="onSubmit">
                <div class="form-group">
                    <label for="search{{ _uid }}" class="col-sm-2 control-label">Component</label>

                    <div class="col-sm-9">
                        <select2 v-model="search" class="form-control" id="search{{ _uid }}" style="width: 100%">
                            <optgroup v-for="(options, group) in optionGroups" :label="group">
                            <option v-for="o in options" :value="o.id">{{ o.text }}</option>
                    </optgroup>
                </select2>
                </div>
                    <div class="col-sm-1">
                        <button type="submit" class="btn btn-info pull-right"></i> OK</button>
                    </div>
                </div>
            </form>*/}
            </div>
        )
    }
}
