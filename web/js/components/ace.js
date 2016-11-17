import Vue from 'vue'
import $ from 'jquery'
import ace from 'ace'

Vue.component('ace', {
    props: ['value', 'width', 'height'],
    template: '<div :style="{height: height ? height + \'px\' : \'100%\',width: width ? width + \'px\' : \'100%\'}" ><div />',
    mounted: function () {
        this.silence = false;
        this.editor = ace.edit(this.$el);
        this.editor.$blockScrolling = Infinity;
        this.editor.on('change', () => {
            if(this.silence) return;

            this.$emit('input', this.editor.getValue())
        });

        var session = this.editor.getSession();
        //session.setMode('ace/mode/javascript');
        session.setUseSoftTabs(true);
        session.setTabSize(2);
    },
    watch: {
        value: function (value) {
            if(value !== undefined && value != this.editor.getValue()) {
                this.silence = true;
                this.editor.setValue(value, 1);
                this.silence = false;
            }
        }
    },
    destroyed: function () {
        this.editor.destroy();
    }
});
