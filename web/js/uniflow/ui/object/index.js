import Vue from 'vue'
import template from './template.html!text'

class PropertyPath {
    constructor(propertyPath) {
        this.elements     = []
        this.length       = 0;
        this.isIndex      = []
        this.pathAsString = ''

        if (propertyPath instanceof PropertyPath) {
            this.elements     = propertyPath.elements.slice()
            this.length       = propertyPath.length;
            this.isIndex      = propertyPath.isIndex
            this.pathAsString = propertyPath.pathAsString

            return
        }

        if (typeof propertyPath !== 'string') {
            throw new Error('The property path constructor needs a string or an instance of PropertyPath')
        }

        if ('' === propertyPath) {
            throw new Error('The property path should not be empty.')
        }

        this.pathAsString = propertyPath;
        let position      = 0;
        let remaining     = propertyPath;

        // first element is evaluated differently - no leading dot for properties
        let pattern = new RegExp(/^(([^\.\[]+)|\[([^\]]+)\])(.*)/);

        let matches = remaining.match(pattern)
        while (matches) {
            let element;
            if (undefined !== matches[2]) {
                element = matches[2];
                this.isIndex.push(false);
            } else {
                element = matches[3];
                this.isIndex.push(true);
            }

            this.elements.push(element);

            position += matches[1].length;
            remaining = matches[4];
            pattern   = new RegExp(/^(\.([^\.|\[]+)|\[([^\]]+)\])(.*)/);
            matches   = remaining.match(pattern)
        }

        if ('' !== remaining) {
            throw new InvalidPropertyPathException(sprintf(
                'Could not parse property path "%s". Unexpected token "%s" at position %d',
                propertyPath,
                remaining[0],
                position
            ));
        }

        this.length = this.elements.length;
    }
}

class PropertyAccessor {
    constructor() {
        this.VALUE                         = 0;
        this.REF                           = 1;
        this.IS_REF_CHAINED                = 2;
        this.ACCESS_HAS_PROPERTY           = 0;
        this.ACCESS_TYPE                   = 1;
        this.ACCESS_NAME                   = 2;
        this.ACCESS_REF                    = 3;
        this.ACCESS_ADDER                  = 4;
        this.ACCESS_REMOVER                = 5;
        this.ACCESS_TYPE_METHOD            = 0;
        this.ACCESS_TYPE_PROPERTY          = 1;
        this.ACCESS_TYPE_MAGIC             = 2;
        this.ACCESS_TYPE_ADDER_AND_REMOVER = 3;
        this.ACCESS_TYPE_NOT_FOUND         = 4;

        this.magicCall            = false;
        this.ignoreInvalidIndices = true;
        this.readPropertyCache    = [];
    }

    setValue(objectOrArray, propertyPath, value) {
        if (!propertyPath instanceof PropertyPath) {
            propertyPath = new PropertyPath(propertyPath);
        }

        let zval         = {}
        zval[this.VALUE] = objectOrArray;
        zval[this.REF]   = objectOrArray;

        /*propertyValues = this->readPropertiesUntil(zval, propertyPath, propertyPath->getLength() - 1);
        overwrite = true;

        try {
            if (PHP_VERSION_ID < 70000 && false === this.previousErrorHandler) {
                this.previousErrorHandler = set_error_handler(this.errorHandler);
            }

            for (i = count(propertyValues) - 1; 0 <= i; --i) {
                zval = propertyValues[i];
                unset(propertyValues[i]);

                // You only need set value for current element if:
                // 1. it's the parent of the last index element
                // OR
                // 2. its child is not passed by reference
                //
                // This may avoid uncessary value setting process for array elements.
                // For example:
                // '[a][b][c]': 'old-value'
                // If you want to change its value to 'new-value',
                // you only need set value for '[a][b][c]' and it's safe to ignore '[a][b]' and '[a]'
                //
                if (overwrite) {
                    property = propertyPath->getElement(i);

                    if (propertyPath->isIndex(i)) {
                        if (overwrite = !isset(zval[this.REF])) {
                            ref = &zval[this.REF];
                            ref = zval[this.VALUE];
                        }
                        this->writeIndex(zval, property, value);
                        if (overwrite) {
                            zval[this.VALUE] = zval[this.REF];
                        }
                    } else {
                        this->writeProperty(zval, property, value);
                    }

                    // if current element is an object
                    // OR
                    // if current element's reference chain is not broken - current element
                    // as well as all its ancients in the property path are all passed by reference,
                    // then there is no need to continue the value setting process
                    if (is_object(zval[this.VALUE]) || isset(zval[this.IS_REF_CHAINED])) {
                        break;
                    }
                }

                value = zval[this.VALUE];
            }
        } catch (\TypeError e) {
            this.throwInvalidArgumentException(e->getMessage(), e->getTrace(), 0);
        } finally {
            if (PHP_VERSION_ID < 70000 && false !== this.previousErrorHandler) {
                restore_error_handler();
                this.previousErrorHandler = false;
            }
        }*/
    }
}

export default Vue.extend({
    props: ['bus'],
    template: template,
    data() {
        return {
            variable: null,
            keyvaluelist: []
        }
    },
    created: function () {
        let a = new PropertyPath('ae.toto.zzz[0][element].aa')
        console.log(a)

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
        },
        keyvaluelist: {
            handler: function () {
                this.onUpdate();
            },
            deep: true
        }
    },
    methods: {
        transform: function () {
            return this.keyvaluelist.reduce(function (object, item) {
                if (item.key) {
                    let value = item.value
                    if (Number.isInteger(value)) {
                        value = Number.parseInt(value)
                    }

                    object[item.key] = value
                }
                return object
            }, {})
        },
        reverseTransform: function (object) {
            this.keyvaluelist.splice
                .apply(this.keyvaluelist, [
                    0, this.keyvaluelist.length
                ].concat(Object.entries(object).reduce(function (list, item) {
                    list.push({key: item[0], value: item[1]})
                    return list
                }, [])))
        },
        serialise: function () {
            let object = this.transform()
            return [this.variable, object];
        },
        deserialise: function (data) {
            let object;
            [this.variable, object] = data ? data : [null, {}];
            this.reverseTransform(object)
        },
        onUpdate: function () {
            this.$emit('update', this.serialise());
        },
        onDelete: function () {
            this.$emit('pop');
        },
        onUpdateItem: function () {
            this.onUpdate();
        },
        onRemoveItem: function (index) {
            this.keyvaluelist.splice(index, 1);

            this.onUpdate();
        },
        onAddItem: function () {
            this.keyvaluelist.push({key: '', value: ''});

            this.onUpdate();
        },
        onCompile: function (interpreter, scope) {

        },
        onExecute: function (runner) {
            if (this.variable) {
                if (runner.hasValue(this.variable)) {
                    let object = runner.getValue(this.variable);
                    this.reverseTransform(object);
                } else {
                    let object = this.transform();
                    runner.setValue(this.variable, object);
                }
            }
        }
    }
});