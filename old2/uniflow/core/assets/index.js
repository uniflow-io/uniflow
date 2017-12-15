import Vue from 'vue'
import template from './template.html!text'
import LZString from 'lz-string'

export default Vue.extend({
    props: ['bus'],
    template: template,
    data() {
        return {
            variable: null,
            assets: []
        }
    },
    created: function () {
        this.bus.$on('reset', this.deserialise);
        this.bus.$on('compile', this.onCompile);
        this.bus.$on('execute', this.onExecute);
    },
    destroyed: function () {
        this.bus.$off('reset', this.deserialise);
        this.bus.$off('compile', this.onCompile);
        this.bus.$off('execute', this.onExecute);
    },
    watch: {
        variable: function () {
            this.onUpdate();
        }
    },
    methods: {
        onFiles: function (e) {
            let files = [];
            for (let i= 0; i < e.target.files.length; i++) {
                files.push(e.target.files[0]);
            }

            return files.reduce((promise, file) => {
                return promise.then(() => {
                    return new Promise((resolve, error) => {
                        let reader = new FileReader();
                        reader.onerror = error;
                        reader.onload = (e) => {
                            resolve(this.assets.push([file.name, e.target.result]));
                        };
                        reader.readAsText(file);
                    })
                });
            }, Promise.resolve()).then(() => {
                e.target.value = '';

                this.onUpdate();
            });
        },
        onUpdateFile: function () {
            this.onUpdate();
        },
        onDownloadFile: function (index) {
            let a = document.createElement("a"),
                blob = new Blob([this.assets[index][1]], {type: "octet/stream"}),
                url = window.URL.createObjectURL(blob);
            a.href = url;
            a.download = this.assets[index][0];
            a.style = "display: none";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        },
        onRemoveFile: function (index) {
            this.assets.splice(index, 1);

            this.onUpdate();
        },
        serialise: function () {
            return LZString.compressToEncodedURIComponent(JSON.stringify([this.variable, this.assets]));
        },
        deserialise: function (data) {
            [this.variable, this.assets] = data ? JSON.parse(LZString.decompressFromEncodedURIComponent(data)) : [null, []];
        },
        onUpdate: function () {
            this.$emit('update', this.serialise());
        },
        onDelete: function () {
            this.$emit('pop');
        },
        onCompile: function(interpreter, scope) {

        },
        onExecute: function (runner) {
            if(this.variable) {
                let assets = this.assets.reduce(function (data, asset) {
                    data.push(asset[1]);
                    return data;
                }, []);
                runner.setValue(this.variable, assets);
            }
        }
    }
});