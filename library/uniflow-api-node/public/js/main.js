document.addEventListener("DOMContentLoaded", function() {
    var req = new XMLHttpRequest();
    req.overrideMimeType("application/json");
    req.onload = function() {
        var data = JSON.parse(req.responseText);
        var title = `Uniflow API ${data.version}`
        document.title = title
        document.getElementById('title').innerText = title
    };
    req.open("GET", '/api/version');
    req.send();
});
