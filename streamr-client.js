module.exports = function(RED) {

    const webSocketDataApiUrl = 'wss://www.streamr.com/api/v1/ws'
    const httpsDataApiUrl = 'https://www.streamr.com/api/v1'
    const StreamrClient = require('streamr-client')

    //todo add node closing
    //todo add pub node

    function StreamrClientNode(config) {
        RED.nodes.createNode(this,config);
        this.status({fill:"red",shape:"ring",text:"disconnected"});
        var node = this;
        var apikey = this.credentials.apikey;
        var streamid = this.credentials.streamid;

        if (apikey && streamid) {
            const client = new StreamrClient({
                apiKey: this.credentials.apikey,
                url: webSocketDataApiUrl,
                restUrl: httpsDataApiUrl
            });

            const sub = client.subscribe({
                    stream: this.credentials.streamid
                },
                (message, metadata) => {
                // This is the message handler which gets called for every incoming message in the Stream.
                // Do something with the message here!
                var msg = {};
                msg.payload = message;
                this.send(msg);
            });

            sub.on('subscribed', () => {
                console.log('Subscribed!');
                this.status({fill:"green",shape:"dot",text:"connected"});
            });

            client.on('connected', () => {
                console.log('Yeah, we are connected now!');
                //this.status({fill:"green",shape:"dot",text:"connected"});
            });

            client.on('error', () => {
                this.status({fill:"red",shape:"ring",text:"disconnected"});
                console.log('Client error!');
            });

            sub.on('error', () => {
                console.log('Sub error!');
                this.status({fill:"red",shape:"ring",text:"disconnected"});
            });

            client.on('disconnected', () => {
                console.log('Client disconnected');
                this.status({fill:"red",shape:"ring",text:"disconnected"});
            });

            this.on('close', function() {
                client.disconnect();
            });

        }

    }
    RED.nodes.registerType("streamr-client",StreamrClientNode, {
        credentials: {
            apikey: {type: "text", required:true},
            streamid: {type: "text", required:true}
        }
    });
}
