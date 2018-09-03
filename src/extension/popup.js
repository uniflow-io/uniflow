import Api from '../models/Api'

(function () {
    const refreshButton = document.getElementById('refresh');

    refreshButton.addEventListener('click', () => {
        let api = new Api('prod', 'qNFN9tqqg0tKq7GMPQy1r3nskFMntRjc')
        api.endpoint('history')
            .then((response) => {
                console.log(response)
            })
    });
})()
