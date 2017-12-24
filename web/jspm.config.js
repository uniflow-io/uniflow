SystemJS.config({
    paths: {
        "npm:": "jspm_packages/npm/",
        "github:": "jspm_packages/github/",
        "uniflow/": "js/"
    },
    browserConfig: {
        "baseURL": "/"
    },
    devConfig: {
        "map": {
            "plugin-babel": "npm:systemjs-plugin-babel@0.0.25",
            "babel-plugin-transform-react-jsx": "npm:babel-plugin-transform-react-jsx@6.24.1",
            "core-js": "npm:core-js@2.5.3",
            "babel-preset-flow": "npm:babel-preset-flow@6.23.0"
        },
        "packages": {
            "npm:babel-plugin-transform-react-jsx@6.24.1": {
                "map": {
                    "babel-helper-builder-react-jsx": "npm:babel-helper-builder-react-jsx@6.26.0",
                    "babel-plugin-syntax-jsx": "npm:babel-plugin-syntax-jsx@6.18.0",
                    "babel-runtime": "npm:babel-runtime@6.26.0"
                }
            },
            "npm:babel-helper-builder-react-jsx@6.26.0": {
                "map": {
                    "babel-runtime": "npm:babel-runtime@6.26.0",
                    "esutils": "npm:esutils@2.0.2",
                    "babel-types": "npm:babel-types@6.26.0"
                }
            },
            "npm:babel-runtime@6.26.0": {
                "map": {
                    "core-js": "npm:core-js@2.5.3",
                    "regenerator-runtime": "npm:regenerator-runtime@0.11.1"
                }
            },
            "npm:babel-types@6.26.0": {
                "map": {
                    "babel-runtime": "npm:babel-runtime@6.26.0",
                    "esutils": "npm:esutils@2.0.2",
                    "to-fast-properties": "npm:to-fast-properties@1.0.3",
                    "lodash": "npm:lodash@4.17.4"
                }
            },
            "npm:babel-preset-flow@6.23.0": {
                "map": {
                    "babel-plugin-transform-flow-strip-types": "npm:babel-plugin-transform-flow-strip-types@6.22.0"
                }
            },
            "npm:babel-plugin-transform-flow-strip-types@6.22.0": {
                "map": {
                    "babel-runtime": "npm:babel-runtime@6.26.0",
                    "babel-plugin-syntax-flow": "npm:babel-plugin-syntax-flow@6.18.0"
                }
            }
        }
    },
    transpiler: "plugin-babel",
    packages: {
        "uniflow": {
            "main": "index.js",
            "format": "esm",
            "meta": {
                "*.js": {
                    "babelOptions": {
                        "presets": [
                            "babel-preset-flow"
                        ],
                        "plugins": [
                            "babel-plugin-transform-react-jsx"
                        ]
                    }
                }
            }
        }
    }
});

SystemJS.config({
    packageConfigPaths: [
        "npm:@*/*.json",
        "npm:*.json",
        "github:*/*.json"
    ],
    map: {
        "ace": "github:ajaxorg/ace-builds@1.2.9",
        "assert": "npm:jspm-nodelibs-assert@0.2.1",
        "buffer": "npm:jspm-nodelibs-buffer@0.2.3",
        "child_process": "npm:jspm-nodelibs-child_process@0.2.1",
        "constants": "npm:jspm-nodelibs-constants@0.2.1",
        "crypto": "npm:jspm-nodelibs-crypto@0.2.1",
        "domain": "npm:jspm-nodelibs-domain@0.2.1",
        "events": "github:jspm/nodelibs-events@0.2.2",
        "fs": "npm:jspm-nodelibs-fs@0.2.1",
        "history": "npm:history@4.7.2",
        "http": "npm:jspm-nodelibs-http@0.2.0",
        "https": "npm:jspm-nodelibs-https@0.2.2",
        "jquery": "npm:jquery@3.2.1",
        "jquery-ui": "npm:jquery-ui@1.12.1",
        "moment": "npm:moment@2.20.1",
        "os": "npm:jspm-nodelibs-os@0.2.2",
        "path": "npm:jspm-nodelibs-path@0.2.3",
        "path-to-regexp": "npm:path-to-regexp@2.1.0",
        "process": "npm:jspm-nodelibs-process@0.2.1",
        "react": "npm:react@16.2.0",
        "react-dom": "npm:react-dom@16.2.0",
        "react-router-dom": "npm:react-router-dom@4.2.2",
        "select2": "github:select2/select2@4.0.5",
        "stream": "npm:jspm-nodelibs-stream@0.2.1",
        "string_decoder": "npm:jspm-nodelibs-string_decoder@0.2.2",
        "tag-it": "npm:tag-it@2.0.0",
        "url": "npm:jspm-nodelibs-url@0.2.1",
        "util": "npm:jspm-nodelibs-util@0.2.2",
        "vm": "npm:jspm-nodelibs-vm@0.2.1",
        "zlib": "npm:jspm-nodelibs-zlib@0.2.3"
    },
    packages: {
        "npm:react-dom@16.2.0": {
            "map": {
                "loose-envify": "npm:loose-envify@1.3.1",
                "object-assign": "npm:object-assign@4.1.1",
                "prop-types": "npm:prop-types@15.6.0",
                "fbjs": "npm:fbjs@0.8.16"
            }
        },
        "npm:react@16.2.0": {
            "map": {
                "loose-envify": "npm:loose-envify@1.3.1",
                "object-assign": "npm:object-assign@4.1.1",
                "prop-types": "npm:prop-types@15.6.0",
                "fbjs": "npm:fbjs@0.8.16"
            }
        },
        "npm:prop-types@15.6.0": {
            "map": {
                "fbjs": "npm:fbjs@0.8.16",
                "loose-envify": "npm:loose-envify@1.3.1",
                "object-assign": "npm:object-assign@4.1.1"
            }
        },
        "npm:fbjs@0.8.16": {
            "map": {
                "loose-envify": "npm:loose-envify@1.3.1",
                "object-assign": "npm:object-assign@4.1.1",
                "isomorphic-fetch": "npm:isomorphic-fetch@2.2.1",
                "setimmediate": "npm:setimmediate@1.0.5",
                "promise": "npm:promise@7.3.1",
                "core-js": "npm:core-js@1.2.7",
                "ua-parser-js": "npm:ua-parser-js@0.7.17"
            }
        },
        "npm:loose-envify@1.3.1": {
            "map": {
                "js-tokens": "npm:js-tokens@3.0.2"
            }
        },
        "npm:isomorphic-fetch@2.2.1": {
            "map": {
                "whatwg-fetch": "npm:whatwg-fetch@2.0.3",
                "node-fetch": "npm:node-fetch@1.7.3"
            }
        },
        "npm:promise@7.3.1": {
            "map": {
                "asap": "npm:asap@2.0.6"
            }
        },
        "npm:node-fetch@1.7.3": {
            "map": {
                "is-stream": "npm:is-stream@1.1.0",
                "encoding": "npm:encoding@0.1.12"
            }
        },
        "npm:encoding@0.1.12": {
            "map": {
                "iconv-lite": "npm:iconv-lite@0.4.19"
            }
        },
        "npm:jspm-nodelibs-stream@0.2.1": {
            "map": {
                "stream-browserify": "npm:stream-browserify@2.0.1"
            }
        },
        "npm:stream-browserify@2.0.1": {
            "map": {
                "inherits": "npm:inherits@2.0.3",
                "readable-stream": "npm:readable-stream@2.3.3"
            }
        },
        "npm:readable-stream@2.3.3": {
            "map": {
                "inherits": "npm:inherits@2.0.3",
                "util-deprecate": "npm:util-deprecate@1.0.2",
                "core-util-is": "npm:core-util-is@1.0.2",
                "process-nextick-args": "npm:process-nextick-args@1.0.7",
                "isarray": "npm:isarray@1.0.0",
                "string_decoder": "npm:string_decoder@1.0.3",
                "safe-buffer": "npm:safe-buffer@5.1.1"
            }
        },
        "npm:jspm-nodelibs-domain@0.2.1": {
            "map": {
                "domain-browser": "npm:domain-browser@1.1.7"
            }
        },
        "npm:string_decoder@1.0.3": {
            "map": {
                "safe-buffer": "npm:safe-buffer@5.1.1"
            }
        },
        "npm:jspm-nodelibs-buffer@0.2.3": {
            "map": {
                "buffer": "npm:buffer@5.0.8"
            }
        },
        "npm:jspm-nodelibs-string_decoder@0.2.2": {
            "map": {
                "string_decoder": "npm:string_decoder@0.10.31"
            }
        },
        "npm:buffer@5.0.8": {
            "map": {
                "base64-js": "npm:base64-js@1.2.1",
                "ieee754": "npm:ieee754@1.1.8"
            }
        },
        "npm:jspm-nodelibs-zlib@0.2.3": {
            "map": {
                "browserify-zlib": "npm:browserify-zlib@0.1.4"
            }
        },
        "npm:jspm-nodelibs-url@0.2.1": {
            "map": {
                "url": "npm:url@0.11.0"
            }
        },
        "npm:jspm-nodelibs-http@0.2.0": {
            "map": {
                "http-browserify": "npm:stream-http@2.7.2"
            }
        },
        "npm:stream-http@2.7.2": {
            "map": {
                "inherits": "npm:inherits@2.0.3",
                "readable-stream": "npm:readable-stream@2.3.3",
                "to-arraybuffer": "npm:to-arraybuffer@1.0.1",
                "builtin-status-codes": "npm:builtin-status-codes@3.0.0",
                "xtend": "npm:xtend@4.0.1"
            }
        },
        "npm:browserify-zlib@0.1.4": {
            "map": {
                "readable-stream": "npm:readable-stream@2.3.3",
                "pako": "npm:pako@0.2.9"
            }
        },
        "npm:url@0.11.0": {
            "map": {
                "querystring": "npm:querystring@0.2.0",
                "punycode": "npm:punycode@1.3.2"
            }
        },
        "npm:jspm-nodelibs-os@0.2.2": {
            "map": {
                "os-browserify": "npm:os-browserify@0.3.0"
            }
        },
        "npm:jspm-nodelibs-crypto@0.2.1": {
            "map": {
                "crypto-browserify": "npm:crypto-browserify@3.12.0"
            }
        },
        "npm:crypto-browserify@3.12.0": {
            "map": {
                "inherits": "npm:inherits@2.0.3",
                "browserify-cipher": "npm:browserify-cipher@1.0.0",
                "browserify-sign": "npm:browserify-sign@4.0.4",
                "create-hash": "npm:create-hash@1.1.3",
                "diffie-hellman": "npm:diffie-hellman@5.0.2",
                "create-ecdh": "npm:create-ecdh@4.0.0",
                "create-hmac": "npm:create-hmac@1.1.6",
                "public-encrypt": "npm:public-encrypt@4.0.0",
                "randombytes": "npm:randombytes@2.0.5",
                "randomfill": "npm:randomfill@1.0.3",
                "pbkdf2": "npm:pbkdf2@3.0.14"
            }
        },
        "npm:browserify-sign@4.0.4": {
            "map": {
                "inherits": "npm:inherits@2.0.3",
                "create-hash": "npm:create-hash@1.1.3",
                "create-hmac": "npm:create-hmac@1.1.6",
                "parse-asn1": "npm:parse-asn1@5.1.0",
                "browserify-rsa": "npm:browserify-rsa@4.0.1",
                "elliptic": "npm:elliptic@6.4.0",
                "bn.js": "npm:bn.js@4.11.8"
            }
        },
        "npm:create-hash@1.1.3": {
            "map": {
                "inherits": "npm:inherits@2.0.3",
                "cipher-base": "npm:cipher-base@1.0.4",
                "ripemd160": "npm:ripemd160@2.0.1",
                "sha.js": "npm:sha.js@2.4.9"
            }
        },
        "npm:diffie-hellman@5.0.2": {
            "map": {
                "randombytes": "npm:randombytes@2.0.5",
                "miller-rabin": "npm:miller-rabin@4.0.1",
                "bn.js": "npm:bn.js@4.11.8"
            }
        },
        "npm:create-hmac@1.1.6": {
            "map": {
                "inherits": "npm:inherits@2.0.3",
                "safe-buffer": "npm:safe-buffer@5.1.1",
                "create-hash": "npm:create-hash@1.1.3",
                "cipher-base": "npm:cipher-base@1.0.4",
                "ripemd160": "npm:ripemd160@2.0.1",
                "sha.js": "npm:sha.js@2.4.9"
            }
        },
        "npm:public-encrypt@4.0.0": {
            "map": {
                "create-hash": "npm:create-hash@1.1.3",
                "randombytes": "npm:randombytes@2.0.5",
                "parse-asn1": "npm:parse-asn1@5.1.0",
                "browserify-rsa": "npm:browserify-rsa@4.0.1",
                "bn.js": "npm:bn.js@4.11.8"
            }
        },
        "npm:randombytes@2.0.5": {
            "map": {
                "safe-buffer": "npm:safe-buffer@5.1.1"
            }
        },
        "npm:randomfill@1.0.3": {
            "map": {
                "safe-buffer": "npm:safe-buffer@5.1.1",
                "randombytes": "npm:randombytes@2.0.5"
            }
        },
        "npm:pbkdf2@3.0.14": {
            "map": {
                "safe-buffer": "npm:safe-buffer@5.1.1",
                "create-hash": "npm:create-hash@1.1.3",
                "create-hmac": "npm:create-hmac@1.1.6",
                "ripemd160": "npm:ripemd160@2.0.1",
                "sha.js": "npm:sha.js@2.4.9"
            }
        },
        "npm:browserify-cipher@1.0.0": {
            "map": {
                "browserify-des": "npm:browserify-des@1.0.0",
                "evp_bytestokey": "npm:evp_bytestokey@1.0.3",
                "browserify-aes": "npm:browserify-aes@1.1.1"
            }
        },
        "npm:browserify-des@1.0.0": {
            "map": {
                "inherits": "npm:inherits@2.0.3",
                "cipher-base": "npm:cipher-base@1.0.4",
                "des.js": "npm:des.js@1.0.0"
            }
        },
        "npm:evp_bytestokey@1.0.3": {
            "map": {
                "safe-buffer": "npm:safe-buffer@5.1.1",
                "md5.js": "npm:md5.js@1.3.4"
            }
        },
        "npm:browserify-aes@1.1.1": {
            "map": {
                "inherits": "npm:inherits@2.0.3",
                "safe-buffer": "npm:safe-buffer@5.1.1",
                "cipher-base": "npm:cipher-base@1.0.4",
                "create-hash": "npm:create-hash@1.1.3",
                "evp_bytestokey": "npm:evp_bytestokey@1.0.3",
                "buffer-xor": "npm:buffer-xor@1.0.3"
            }
        },
        "npm:parse-asn1@5.1.0": {
            "map": {
                "browserify-aes": "npm:browserify-aes@1.1.1",
                "create-hash": "npm:create-hash@1.1.3",
                "evp_bytestokey": "npm:evp_bytestokey@1.0.3",
                "pbkdf2": "npm:pbkdf2@3.0.14",
                "asn1.js": "npm:asn1.js@4.9.2"
            }
        },
        "npm:browserify-rsa@4.0.1": {
            "map": {
                "randombytes": "npm:randombytes@2.0.5",
                "bn.js": "npm:bn.js@4.11.8"
            }
        },
        "npm:create-ecdh@4.0.0": {
            "map": {
                "elliptic": "npm:elliptic@6.4.0",
                "bn.js": "npm:bn.js@4.11.8"
            }
        },
        "npm:cipher-base@1.0.4": {
            "map": {
                "inherits": "npm:inherits@2.0.3",
                "safe-buffer": "npm:safe-buffer@5.1.1"
            }
        },
        "npm:ripemd160@2.0.1": {
            "map": {
                "inherits": "npm:inherits@2.0.3",
                "hash-base": "npm:hash-base@2.0.2"
            }
        },
        "npm:sha.js@2.4.9": {
            "map": {
                "inherits": "npm:inherits@2.0.3",
                "safe-buffer": "npm:safe-buffer@5.1.1"
            }
        },
        "npm:miller-rabin@4.0.1": {
            "map": {
                "bn.js": "npm:bn.js@4.11.8",
                "brorand": "npm:brorand@1.1.0"
            }
        },
        "npm:elliptic@6.4.0": {
            "map": {
                "inherits": "npm:inherits@2.0.3",
                "bn.js": "npm:bn.js@4.11.8",
                "brorand": "npm:brorand@1.1.0",
                "hmac-drbg": "npm:hmac-drbg@1.0.1",
                "minimalistic-assert": "npm:minimalistic-assert@1.0.0",
                "minimalistic-crypto-utils": "npm:minimalistic-crypto-utils@1.0.1",
                "hash.js": "npm:hash.js@1.1.3"
            }
        },
        "npm:des.js@1.0.0": {
            "map": {
                "inherits": "npm:inherits@2.0.3",
                "minimalistic-assert": "npm:minimalistic-assert@1.0.0"
            }
        },
        "npm:md5.js@1.3.4": {
            "map": {
                "inherits": "npm:inherits@2.0.3",
                "hash-base": "npm:hash-base@3.0.4"
            }
        },
        "npm:hash-base@2.0.2": {
            "map": {
                "inherits": "npm:inherits@2.0.3"
            }
        },
        "npm:hash-base@3.0.4": {
            "map": {
                "inherits": "npm:inherits@2.0.3",
                "safe-buffer": "npm:safe-buffer@5.1.1"
            }
        },
        "npm:asn1.js@4.9.2": {
            "map": {
                "inherits": "npm:inherits@2.0.3",
                "bn.js": "npm:bn.js@4.11.8",
                "minimalistic-assert": "npm:minimalistic-assert@1.0.0"
            }
        },
        "npm:hmac-drbg@1.0.1": {
            "map": {
                "hash.js": "npm:hash.js@1.1.3",
                "minimalistic-assert": "npm:minimalistic-assert@1.0.0",
                "minimalistic-crypto-utils": "npm:minimalistic-crypto-utils@1.0.1"
            }
        },
        "npm:hash.js@1.1.3": {
            "map": {
                "inherits": "npm:inherits@2.0.3",
                "minimalistic-assert": "npm:minimalistic-assert@1.0.0"
            }
        },
        "npm:react-router-dom@4.2.2": {
            "map": {
                "warning": "npm:warning@3.0.0",
                "loose-envify": "npm:loose-envify@1.3.1",
                "prop-types": "npm:prop-types@15.6.0",
                "invariant": "npm:invariant@2.2.2",
                "history": "npm:history@4.7.2",
                "react-router": "npm:react-router@4.2.0"
            }
        },
        "npm:warning@3.0.0": {
            "map": {
                "loose-envify": "npm:loose-envify@1.3.1"
            }
        },
        "npm:history@4.7.2": {
            "map": {
                "invariant": "npm:invariant@2.2.2",
                "warning": "npm:warning@3.0.0",
                "loose-envify": "npm:loose-envify@1.3.1",
                "value-equal": "npm:value-equal@0.4.0",
                "resolve-pathname": "npm:resolve-pathname@2.2.0"
            }
        },
        "npm:invariant@2.2.2": {
            "map": {
                "loose-envify": "npm:loose-envify@1.3.1"
            }
        },
        "npm:react-router@4.2.0": {
            "map": {
                "loose-envify": "npm:loose-envify@1.3.1",
                "prop-types": "npm:prop-types@15.6.0",
                "history": "npm:history@4.7.2",
                "invariant": "npm:invariant@2.2.2",
                "warning": "npm:warning@3.0.0",
                "hoist-non-react-statics": "npm:hoist-non-react-statics@2.3.1",
                "path-to-regexp": "npm:path-to-regexp@1.7.0"
            }
        },
        "npm:path-to-regexp@1.7.0": {
            "map": {
                "isarray": "npm:isarray@0.0.1"
            }
        },
        "github:select2/select2@4.0.5": {
            "map": {
                "jquery": "npm:jquery@3.2.1"
            }
        }
    }
});
