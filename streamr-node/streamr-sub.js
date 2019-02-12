const StreamrClient = require('streamr-client')

module.exports = function (RED) {
    const webSocketDataApiUrl = 'wss://www.streamr.com/api/v1/ws'
    const httpsDataApiUrl = 'https://www.streamr.com/api/v1'
    function StreamrClientNode(config) {
        RED.nodes.createNode(this, config)
        this.status({
            fill: 'red', shape: 'ring', text: 'disconnected'
        })
        const node = this
        const { apiKey } = this.credentials
        const { streamId } = this.credentials

        if (apiKey && streamId) {
            const client = new StreamrClient({
                apiKey: this.credentials.apiKey,
                url: webSocketDataApiUrl,
                restUrl: httpsDataApiUrl
            })

            const sub = client.subscribe({
                stream: this.credentials.streamId
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

            this.on('close', () => {
                client.disconnect()
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
