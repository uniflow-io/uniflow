import Api from '../models/Api'

(function () {
    function refresh() {
        let api         = new Api('prod', 'qNFN9tqqg0tKq7GMPQy1r3nskFMntRjc')
        api.endpoint('history')
            .then((response) => {
                console.log(response)
            })
        console.log('refresh')
    }

    refresh()
})()
