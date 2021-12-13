const StreamrClient = require('streamr-client')

module.exports = function (RED) {
    function StreamrClientNode(config) {
        RED.nodes.createNode(this, config)
        this.status({
            fill: 'red', shape: 'ring', text: 'disconnected'
        })
        this.configNode = RED.nodes.getNode(config.stream)
        const node = this

        if (this.configNode) {
            const fn = async () => {
                try {
                    const { client, streamId } = this.configNode
                    const stream = await client.getOrCreateStream({
                        id: streamId
                    })

                    console.log('client connected')

                    this.status({
                        fill: 'green', shape: 'dot', text: 'connected'
                    })

                    node.on('input', async (msg) => {
                        if (client instanceof StreamrClient && msg) {
                            stream.publish(msg)
                            this.log(`published streamr message: ${JSON.stringify(msg)}`)
                        } else {
                            this.status({
                                fill: 'red', shape: 'ring', text: 'disconnected'
                            })
                        }
                    })
                } catch (e) {
                    this.error(e)
                    this.status({
                        fill: 'red', shape: 'ring', text: 'disconnected'
                    })
                }
            }

            fn()
        }
    }
    RED.nodes.registerType('streamr-pub', StreamrClientNode)
}
