define([], function() {
    class MessageText {
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

    return MessageText;
});