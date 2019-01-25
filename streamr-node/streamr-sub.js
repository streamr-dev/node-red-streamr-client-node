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
        const { apikey } = this.credentials
        const { streamid } = this.credentials

        if (apikey && streamid) {
            const client = new StreamrClient({
                apiKey: this.credentials.apikey,
                url: webSocketDataApiUrl,
                restUrl: httpsDataApiUrl
            })

            const sub = client.subscribe({
                stream: this.credentials.streamid
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
            apikey: {
                type: 'text', required: true
            },
            streamid: {
                type: 'text', required: true
            }
        }
    })
}
