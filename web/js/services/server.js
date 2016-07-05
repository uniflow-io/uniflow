define([], function() {
    class Server {
        getUrl() {
            return '/app_dev.php';
        }
    }

    return new Server();
});