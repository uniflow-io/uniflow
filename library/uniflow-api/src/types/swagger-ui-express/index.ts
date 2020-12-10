declare const swagger_ui_express: {
    setup: any
    serve: any
};

declare module 'swagger-ui-express' {
    export = swagger_ui_express;
}