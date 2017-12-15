class ServerService {
    getBaseUrl() {
        let env = window.location.href.match(/app_dev\.php/) ? 'dev' : 'prod';

        if(env == 'dev') {
            return '/app_dev.php';
        }

        return '';
    }
}

export default new ServerService();