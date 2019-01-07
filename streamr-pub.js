module.exports = function(RED) {

    const webSocketDataApiUrl = 'wss://www.streamr.com/api/v1/ws'
    const httpsDataApiUrl = 'https://www.streamr.com/api/v1'
    const StreamrClient = require('streamr-client')
    function StreamrClientNode(config) {
        RED.nodes.createNode(this,config);
        this.status({fill:"red",shape:"ring",text:"disconnected"});
        var node = this;
        var apikey = this.credentials.apikey;
        var streamname = this.credentials.stream;
        console.log(this.credentials)

        node.on('input', function(msg) {
            if (apikey && streamname && msg) {
                console.log('apikey & stream name given')
                const client = new StreamrClient({
                    apiKey: this.credentials.apikey,
                    url: webSocketDataApiUrl,
                    restUrl: httpsDataApiUrl
                });

                client.getOrCreateStream({
                    name: streamname,
                }).then((stream) => {
                    stream.produce(msg.payload)
                    .catch((err) => {
                        console.log('error', err)
                    })
                });

                client.on('connected', () => {
                    console.log('Yeah, we are connected now!');
                    this.status({fill:"green",shape:"dot",text:"connected"});
                });

                client.on('error', () => {
                    this.status({fill:"red",shape:"ring",text:"disconnected"});
                    console.log('Client error!');
                });

                client.on('disconnected', () => {
                    console.log('Client disconnected');
                    this.status({fill:"red",shape:"ring",text:"disconnected"});
                });

                this.on('close', function() {
                    client.disconnect();
                    this.status({fill:"red",shape:"ring",text:"disconnected"});
                });

            }
         });

    }
    RED.nodes.registerType("streamr-pub",StreamrClientNode, {
        credentials: {
            apikey: {type: "text", required:true},
            stream: {type: "text", required:true}
        }
    });
}
