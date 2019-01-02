module.exports = function(RED) {
    const webSocketDataApiUrl = 'wss://www.streamr.com/api/v1/ws'
    const httpsDataApiUrl = 'https://www.streamr.com/api/v1'
    const StreamrClient = require('streamr-client')

    function LowerCaseNode(config) {

        const client = new StreamrClient({
            apiKey: 'XvXw4SgvRBOWLmXS42QNdQr3xNsEE_Qfy8JUE-lHPLWw',
            url: webSocketDataApiUrl,
            restUrl: httpsDataApiUrl
        })

        const sub = client.subscribe(
          {
              stream: '571KML5EScWYhLiNVCf66A'
          },
          (message, metadata) => {
              // This is the message handler which gets called for every incoming message in the Stream.
              // Do something with the message here!
              var msg = {}
              msg.payload = message;
              console.log(message);
              this.send(msg);

          }
      )

        console.log(client)
        RED.nodes.createNode(this,config);
        /*var node = this;
        node.on('input', function(msg) {
            msg.payload = msg.payload.toLowerCase();
            node.send(msg);
        });*/
    }
    RED.nodes.registerType("lower-case",LowerCaseNode);
}
