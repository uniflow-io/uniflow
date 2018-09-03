// Saves options to chrome.storage
function save_options() {
    var apiKey = document.getElementById('apiKey').value;
    var env = document.getElementById('env').value;

    chrome.storage.sync.set({
        apiKey: apiKey,
        env: env
    }, function() {
        // Update status to let user know options were saved.
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function() {
            status.textContent = '';
        }, 750);
    });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
    // Use default value apiKey = 'red' and env = true.
    chrome.storage.sync.get({
        apiKey: '',
        env: 'prod'
    }, function(items) {
        document.getElementById('apiKey').value = items.apiKey;
        document.getElementById('env').value = items.env;
    });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);