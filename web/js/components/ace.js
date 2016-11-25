import Vue from 'vue'
import $ from 'jquery'
import ace from 'ace'

Vue.component('ace', {
    props: ['value', 'width', 'height', 'mode'],
    template: '<div :style="{height: height ? height + \'px\' : \'100%\',width: width ? width + \'px\' : \'100%\'}" ><div />',
    mounted: function () {
        this.silence = false;

        ace.config.set('basePath', '/js/libs/ace');
        this.editor = ace.edit(this.$el);
        this.editor.$blockScrolling = Infinity;
        this.editor.on('change', () => {
            if(this.silence) return;

            this.$emit('input', this.editor.getValue())
        });

        let session = this.editor.getSession();
        session.setUseSoftTabs(true);
        session.setTabSize(2);

        if(this.mode) {
            session.setMode('ace/mode/' + this.mode);
        }
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
