const StreamrClient = require('streamr-client')

module.exports = (RED) => {
    function StreamrClientNode(config) {
        RED.nodes.createNode(this, config)
        this.status({
            fill: 'red', shape: 'ring', text: 'disconnected'
        })
        this.configNode = RED.nodes.getNode(config.stream)

        if (this.configNode) {
            const fn = async () => {
                const { client, streamId } = this.configNode

                if (client instanceof StreamrClient && streamId) {
                    try {
                        await client.getOrCreateStream({
                            id: streamId
                        })

                        client.subscribe({
                            stream: streamId
                        },
                        (message) => {
                            this.log(`received streamr message: ${JSON.stringify(message)}`)
                            this.send(message)
                        })

                        this.status({
                            fill: 'green', shape: 'dot', text: 'connected'
                        })
                    } catch (e) {
                        this.error(e)
                        this.status({
                            fill: 'red', shape: 'ring', text: 'disconnected'
                        })
                    }
                } else {
                    this.status({
                        fill: 'red', shape: 'ring', text: 'disconnected'
                    })
                }
            }
            fn()
        }
    }
    RED.nodes.registerType('streamr-sub', StreamrClientNode, {
        credentials: {
            privateKey: {
                type: 'text', required: true
            },
            streamId: {
                type: 'text', required: true
            }
        }
    })
}
