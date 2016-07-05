define([], function() {
    class TextMessage {
        constructor() {
            this.text = null;
        }

        getText() {
            return this.text;
        }

        setText(text) {
            this.text = text;
        }
    }

    return TextMessage;
});