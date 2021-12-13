const StreamrClient = require('streamr-client')
const { Wallet } = require('ethers')
const { webSocketDataApiUrl, httpsDataApiUrl } = require('./constants')

module.exports = function (RED) {
    function StreamrConfigNode(n) {
        RED.nodes.createNode(this, n)

        this.privateKey = n.privateKey || Wallet.createRandom().privateKey
        this.streamId = n.streamId
        this.client = new StreamrClient({
            auth: {
                privateKey: this.privateKey
            }
        })
    }
    RED.nodes.registerType('streamr-config', StreamrConfigNode)
}
