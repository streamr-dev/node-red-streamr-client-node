const StreamrClient = require('streamr-client')
const { webSocketDataApiUrl, httpsDataApiUrl } = require('./constants')

module.exports = function (RED) {
    function StreamrConfigNode(n) {
        RED.nodes.createNode(this, n)

        this.apiKey = n.apiKey
        this.streamId = n.streamId
        this.client = new StreamrClient({
            apiKey: this.apiKey,
            url: webSocketDataApiUrl,
            restUrl: httpsDataApiUrl
        })
    }
    RED.nodes.registerType('streamr-config', StreamrConfigNode)
}
