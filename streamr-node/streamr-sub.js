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

        if (client instanceof StreamrClient && streamId) {
            const sub = client.subscribe({
                stream: streamId
            },
            (message, metadata) => {
                const msg = {}
                msg.payload = message
                this.send(msg)
            })

            sub.on('subscribed', () => {
                this.status({
                    fill: 'green', shape: 'dot', text: 'connected'
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

            sub.on('error', () => {
                this.status({
                    fill: 'red', shape: 'ring', text: 'Sub error!'
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
    }
    RED.nodes.registerType('streamr-sub', StreamrClientNode, {
        credentials: {
            apiKey: {
                type: 'text', required: true
            },
            streamId: {
                type: 'text', required: true
            }
        }
    })
}
