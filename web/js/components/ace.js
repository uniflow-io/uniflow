import Vue from 'vue'
import $ from 'jquery'
import ace from 'ace'

Vue.component('ace', {
    props: ['value', 'width', 'height'],
    template: '<div :style="{height: height ? height + \'px\' : \'100%\',width: width ? width + \'px\' : \'100%\'}" ><div />',
    mounted: function () {
        var vm = this;
        $(this.$el).val(this.value);
        var editor = vm.editor = ace.edit(this.$el);
        editor.on('change', function() {
            //vm.value = editor.getValue();
            vm.$emit('input', editor.getValue())
        })

        var session = editor.getSession();
        //session.setMode('ace/mode/javascript');
        session.setUseSoftTabs(true);
        session.setTabSize(2);
    },
    watch: {
        value: function (value) {
            //this.editor.setValue(value, 1);
        }
    },
    destroyed: function () {
        this.editor.destroy();
    }
});
