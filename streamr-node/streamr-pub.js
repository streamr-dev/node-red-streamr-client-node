const StreamrClient = require('streamr-client')

module.exports = function (RED) {
    function StreamrClientNode(config) {
        RED.nodes.createNode(this, config)
        this.configNode = RED.nodes.getNode(config.stream)
        let client
        let streamId
        if (this.configNode) {
            client = this.configNode.client
            streamId = this.configNode.streamId
        }

        this.status({
            fill: 'red', shape: 'ring', text: 'disconnected'
        })
        const node = this

        node.on('input', function (msg) {
            if (client instanceof StreamrClient && msg) {
                client.getOrCreateStream({
                    id: streamId,
                }).then((stream) => {
                    stream.produce(msg.payload)
                        .catch((err) => {
                            console.log('Streamr node error:', err)
                        })
                })

                client.on('connected', () => {
                    this.status({
                        fill: 'green', shape: 'dot', text: 'connected'
                    })
                })

                client.on('error', () => {
                    this.status({
                        fill: 'red', shape: 'ring', text: 'Client error!'
                    })
                })

                client.on('disconnected', () => {
                    this.status({
                        fill: 'red', shape: 'ring', text: 'disconnected'
                    })
                })
            } else {
                this.status({
                    fill: 'red', shape: 'ring', text: 'disconnected'
                })
            }
        })
    }
    RED.nodes.registerType('streamr-pub', StreamrClientNode)
}
