import Vue from 'vue'
import template from './template.html!text'

let scope = {};

(function (scope) {
    scope.format = function() {
        let message = arguments[0]
        let args = Array.prototype.slice.call(arguments, 1);
        return message.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] !== undefined
                ? args[number]
                : match
                ;
        });
    };
})(scope);

(function (scope) {
    'use strict';

    let InvalidPropertyPathException;
    let OutOfBoundsException;
    let PropertyPath;

    /**
     * @constructor
     */
    InvalidPropertyPathException = function InvalidPropertyPathException() {
    };
    InvalidPropertyPathException.prototype = Error.prototype;

    /**
     * @constructor
     */
    OutOfBoundsException = function OutOfBoundsException() {
    };
    InvalidPropertyPathException.prototype = Error.prototype;

    /**
     * Constructs a property path from a string.
     *
     * @param {PropertyPath|string} propertyPath The property path as string or instance
     *
     * @throws UnexpectedTypeException      If the given path is not a string
     * @throws InvalidPropertyPathException If the syntax of the property path is not valid
     *
     * @constructor
     *
     * @class PropertyPath
     */
    PropertyPath = function PropertyPath(propertyPath) {
        let pattern, remaining, position, matches, element, pos, singular;

        if (!(this instanceof PropertyPath)) {
            return new PropertyPath(propertyPath);
        }

        /**
         * Character used for separating between plural and singular of an element.
         *
         * @type {string}
         * @const
         */
        this.SINGULAR_SEPARATOR = '|';

        /**
         * The elements of the property path.
         *
         * @type {Array}
         */
        this._elements = [];

        /**
         * The singular forms of the elements in the property path.
         *
         * @type {Array}
         */
        this._singulars = [];

        /**
         * The number of elements in the property path.
         *
         * @type {number}
         */
        this._len = 0;

        /**
         * Contains a Boolean for each property in $elements denoting whether this
         * element is an index. It is a property otherwise.
         *
         * @type {Array}
         */
        this._isIndex = [];

        /**
         * String representation of the path.
         *
         * @type {string}
         */
        this._pathAsString = '';

        if (propertyPath instanceof PropertyPath) {
            this._elements     = propertyPath.getElements();
            this._singulars    = propertyPath.getSingulars();
            this._len          = propertyPath.getLength();
            this._isIndex      = propertyPath.isIndex();
            this._pathAsString = propertyPath.pathAsString();

            return;
        }

        this._pathAsString = propertyPath;
        pattern            = /^(([^\.\[]+)|\[([^\]]+)\])(.*)/gmi;
        remaining          = propertyPath;
        position           = 0;
        pos                = false;
        singular           = null;

        while ((matches = pattern.exec(remaining))) {
            if (typeof matches[2] !== 'undefined') {
                element = matches[2];
                this._isIndex.push(false);
            } else {
                element = matches[3];
                this._isIndex.push(true);
            }

            pos      = false;
            singular = null;

            if (false !== pos) {
                singular = element.substr(pos + 1);
                element  = element.substr(0, pos);
            }

            this._elements.push(element);
            this._singulars.push(singular);

            position += String(matches[1]).length;
            remaining = matches[4];
            pattern   = /^(\.([^\.|\[]+)|\[([^\]]+)\])(.*)/gmi;
        }

        if ('' !== remaining) {
            throw new InvalidPropertyPathException(scope.format(
                'Could not parse property path "%s". Unexpected token "%s" at position %d',
                propertyPath,
                remaining[0],
                position
            ));
        }

        this._len = this._elements.length;

        return this;
    };

    /**
     * Returns the string representation of the property path.
     *
     * @return {string} The path as string
     */
    PropertyPath.prototype.toString = function toString() {
        return this._pathAsString;
    };

    /**
     * Returns the length of the property path, i.e. the number of elements.
     *
     * @return {Number} The path length
     */
    PropertyPath.prototype.getLength = function getLength() {
        return this._len;
    };

    /**
     * Returns the parent property path.
     *
     * The parent property path is the one that contains the same items as
     * this one except for the last one.
     *
     * If this property path only contains one item, null is returned.
     *
     * @return {PropertyPath|null} The parent path or null
     */
    PropertyPath.prototype.getParent = function getParent() {
        let parent;

        if (this._len <= 1) {
            return null;
        }

        /** @type {PropertyPath} */
        parent = op.clone(this);
        --parent._len;
        parent._pathAsString = parent._pathAsString.substr(0, Math.max(parent._pathAsString.indexOf('.'), parent._pathAsString.indexOf('[')));
        parent._elements.pop();
        parent._singulars.pop();
        parent._isIndex.pop();

        return parent;
    };

    /**
     * Returns the elements of the property path as array.
     *
     * @return {Array} An array of property/index names
     */
    PropertyPath.prototype.getElements = function getElements() {
        return this._elements;
    };

    /**
     * Returns the element at the given index in the property path.
     *
     * @param {Number} index The index key
     *
     * @return {String} A property or index name
     *
     * @throws OutOfBoundsException If the offset is invalid
     */
    PropertyPath.prototype.getElement = function getElement(index) {
        if (typeof this._elements[index] === 'undefined') {
            throw new OutOfBoundsException(scope.format('The index %s is not within the property path', index));
        }

        return this._elements[index];
    };

    /**
     * Returns whether the element at the given index is a property.
     *
     * @param {Number} index The index in the property path
     *
     * @return {bool} Whether the element at this index is a property
     *
     * @throws OutOfBoundsException If the offset is invalid
     */
    PropertyPath.prototype.isProperty = function isProperty(index) {
        if (typeof this._isIndex[index] === 'undefined') {
            throw new OutOfBoundsException(scope.format('The index %s is not within the property path', index));
        }

        return !this._isIndex[index];
    };

    /**
     * Returns whether the element at the given index is an array index.
     *
     * @param {Number} index The index in the property path
     *
     * @return {bool} Whether the element at this index is an array index
     *
     * @throws OutOfBoundsException If the offset is invalid
     */
    PropertyPath.prototype.isIndex = function isIndex(index) {
        if (typeof this._isIndex[index] === 'undefined') {
            throw new OutOfBoundsException(scope.format('The index %s is not within the property path', index));
        }

        return this._isIndex[index];
    };

    scope.PropertyPath = PropertyPath;
})(scope);

(function (scope) {
    'use strict';

    let InvalidArgumentException, UnexpectedTypeException, NoSuchIndexException, PropertyAccessor;

    /**
     * @constructor
     * @class InvalidArgumentException
     * @extends Error
     */
    InvalidArgumentException = function InvalidArgumentException(msg, id) {
        Error.call(msg, id);
    };
    InvalidArgumentException.prototype = Error.prototype;

    /**
     * @constructor
     * @class NoSuchIndexException
     * @extends Error
     */
    NoSuchIndexException = function NoSuchIndexException(msg, id) {
        Error.call(msg, id);
    };
    NoSuchIndexException.prototype = Error.prototype;

    /**
     * @constructor
     * @class UnexpectedTypeException
     * @extends Error
     */
    UnexpectedTypeException = function UnexpectedTypeException(value, expectedType) {
        Error.call(scope.format('Expected argument of type "%s", "%s" given', expectedType, typeof value));
    };
    UnexpectedTypeException.prototype = Error.prototype;

    /**
     * Should not be used by application code
     */
    PropertyAccessor = function PropertyAccessor(throwExceptionOnInvalidIndex) {
        if (!(this instanceof PropertyAccessor)) {
            return new PropertyAccessor(throwExceptionOnInvalidIndex);
        }

        this.ignoreInvalidIndices = !throwExceptionOnInvalidIndex;

        /** @const */
        this.VALUE = 0;
        /** @const */
        this.IS_REF = 1;

        return this;
    };

    /**
     * Returns the value at the end of the property path of the object graph.
     *
     * This method first tries to find a public getter for each property in the
     * path. The name of the getter must be the camel-cased property name
     * prefixed with "get", "is", or "has".
     *
     * If the getter does not exist, this method tries to find a public
     * property. The value of the property is then returned.
     *
     * If none of them are found, an exception is thrown.
     *
     * @param {Object|Array}        objectArray The object or array to traverse
     * @param {String|PropertyPath} propertyPath  The property path to read
     *
     * @return mixed The value at the end of the property path
     *
     * @throws InvalidArgumentException If the property path is invalid
     * @throws UnexpectedTypeException  If a value within the path is neither object nor array
     */
    PropertyAccessor.prototype.getValue = function getValue(objectArray, propertyPath) {
        let propertyValues;

        if (typeof propertyPath === 'string') {
            propertyPath = new scope.PropertyPath(propertyPath);
        } else if (!(propertyPath instanceof scope.PropertyPath)) {
            throw new InvalidArgumentException(scope.format(
                'The property path should be a string or an instance of ' +
                '"PropertyPath". ' +
                'Got: "%s"',
                typeof propertyPath
            ));
        }

        propertyValues = this.readPropertiesUntil(
            // read shouldn't not modify original objectArray
            $.extend(true, $.isPlainObject(objectArray) ? {} : [], objectArray),
            propertyPath,
            propertyPath.getLength(),
            this.ignoreInvalidIndices
        );

        return propertyValues[propertyValues.length - 1][this.VALUE];
    };

    /**
     * Sets the value at the end of the property path of the object graph.
     *
     * This method first tries to find a public setter for each property in the
     * path. The name of the setter must be the camel-cased property name
     * prefixed with "set".
     *
     * If the setter does not exist, this method tries to find a public
     * property. The value of the property is then changed.
     *
     * If neither is found, an exception is thrown.
     *
     * @param {Object|Array}        objectArray The object or array to modify
     * @param {String|PropertyPath} propertyPath  The property path to modify
     * @param {*}                   value         The value to set at the end of the property path
     *
     * @throws InvalidArgumentException If the property path is invalid
     * @throws AccessException          If a property/index does not exist or is not public
     * @throws UnexpectedTypeException  If a value within the path is neither object
     *                                            nor array
     */
    PropertyAccessor.prototype.setValue = function setValue(objectArray, propertyPath, value) {
        let i, unshift, overwrite, property, propertyValues;

        if (typeof propertyPath === 'string') {
            propertyPath = new scope.PropertyPath(propertyPath);
        } else if (!(propertyPath instanceof scope.PropertyPath)) {
            throw new InvalidArgumentException(scope.format(
                'The property path should be a string or an instance of ' +
                '"PropertyPath". ' +
                'Got: "%s"',
                typeof propertyPath
            ));
        }

        propertyValues = this.readPropertiesUntil(objectArray, propertyPath, propertyPath.getLength() - 1, this.ignoreInvalidIndices);
        overwrite      = true;

        // Add the root object to the list
        unshift              = {};
        unshift[this.VALUE]  = objectArray;
        unshift[this.IS_REF] = true;

        propertyValues.unshift(unshift);

        for (i = propertyValues.length - 1; i >= 0; --i) {
            objectArray = propertyValues[i][this.VALUE];

            if (overwrite) {
                property    = propertyPath.getElement(i);
                objectArray = this.write(objectArray, property, value);
            }

            value     = objectArray;
            overwrite = !propertyValues[i][this.IS_REF];
        }
    };

    /**
     * Reads the path from an object up to a given path index.
     *
     * @param {object|array} objectArray        The object or array to read from
     * @param {PropertyPath} propertyPath         The property path to read
     * @param {int}          lastIndex            The index up to which should be read
     * @param {bool}         ignoreInvalidIndices Whether to ignore invalid indices
     *                                                    or throw an exception
     *
     * @return array The values read in the path.
     *
     * @throws UnexpectedTypeException If a value within the path is neither object nor array.
     * @throws NoSuchIndexException    If a non-existing index is accessed
     */
    PropertyAccessor.prototype.readPropertiesUntil = function readPropertiesUntil(objectArray, propertyPath, lastIndex, ignoreInvalidIndices) {
        let i, propertyValue, propertyValues = [], property, isIndex;

        if (typeof ignoreInvalidIndices === 'undefined') {
            ignoreInvalidIndices = true;
        }

        if (!_.isObject(objectArray) && !_.isArray(objectArray)) {
            throw new UnexpectedTypeException(objectArray, 'object or array');
        }

        for (i = 0; i < lastIndex; i++) {
            property = propertyPath.getElement(i);
            isIndex  = propertyPath.isIndex(i);

            if (isIndex && (_.isObject(objectArray) && !objectArray.hasOwnProperty(property))) {
                if (!ignoreInvalidIndices) {
                    throw new NoSuchIndexException(scope.format(
                        'Cannot read property "%s". Available properties are "%s"',
                        property,
                        Object.keys(objectArray)
                    ));
                }

                objectArray[property] = (i + 1 < propertyPath.getLength() ? [] : null);
            }

            propertyValue = this.read(objectArray, property);

            objectArray = propertyValue[this.VALUE];
            propertyValues.push(propertyValue);
        }

        return propertyValues;
    };

    /**
     * Reads a key from an array-like structure.
     *
     * @param {array}      objectArray The array
     * @param {string|int} property The key to read
     *
     * @return mixed The value of the key
     *
     * @throws NoSuchIndexException
     */
    PropertyAccessor.prototype.read = function read(objectArray, property) {
        let result;

        result              = {};
        result[this.VALUE]  = null;
        result[this.IS_REF] = false;

        if (_.isObject(objectArray) && objectArray.hasOwnProperty(property)) {
            result[this.VALUE]  = objectArray[property];
            result[this.IS_REF] = !_.isArray(objectArray[property]);
        }

        return result;
    };

    /**
     * Sets the value of an index in a given array-accessible value.
     *
     * @param {Object|Array} objectArray An array
     * @param {string|int}   property The index to write at
     * @param {*}            value The value to write
     *
     * @throws NoSuchIndexException If the array does not implement \ArrayAccess or it is not an array
     */
    PropertyAccessor.prototype.write = function write(objectArray, property, value) {

        objectArray           = objectArray || {};
        objectArray[property] = value;

        return objectArray;
    };

    scope.PropertyAccessor = PropertyAccessor;
})(scope)

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
            let accessor = new scope.PropertyAccessor()
            return this.keyvaluelist.reduce(function (object, item) {
                if (item.key) {
                    let value = item.value
                    if (Number.isInteger(value)) {
                        value = Number.parseInt(value)
                    }

                    accessor.setValue(object, item.key, value)
                }
                return object
            }, {})
        },
        reverseTransform: function (object) {
            var flatten = function (data, prefix = '') {
                return Object
                    .entries(data)
                    .reduce(function (list, item) {
                        if(typeof item[1] === 'object') {
                            list = list.concat(flatten(item[1], '.'))
                        } else {
                            list.push({key: prefix + item[0], value: item[1]})
                        }
                        return list
                    }, [])
            }

            this.keyvaluelist.splice
                .apply(this.keyvaluelist, [
                    0, this.keyvaluelist.length
                ].concat(flatten(object)))
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