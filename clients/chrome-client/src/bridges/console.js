export default (background) => {
    return {
        log: (obj) => {
            return background.evaluateInBackground('async function() { return (await browser.tabs.query({ active: true })).map(tab => tab.id) }', [])
                .then((tabIds) => {
                    return background.evaluateInContent(tabIds[0], 'function(value) { console.log(value) }', [obj]);
                })
        }
    }
}
