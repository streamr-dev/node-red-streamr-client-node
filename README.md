# Streamr client node

Experimental wrapper for [Streamr node.js client](https://github.com/streamr-dev/streamr-client-javascript) for node-red. Enables subscribing and publishing to Streamr streams with your Streamr Accounts API-key and stream id.

### Installation
`npm install node-red-contrib-streamr`

or

```
git clone
npm install
```
Go to your ~/.node-red folder
```
npm install <path where you git cloned streamr client node library>
```
Start node-red.
Find streamr client node under Streamr category.

### Instructions
This library includes config node, publish and subscribe nodes. To be able to utilize these nodes you can provide an Ethereum Private Key and a Stream ID to operate with. 

By default every instance of a `streamr-pub` or `streamr-sub` elements gets a random private key assigned and is pointed to operate with the example StreamId `0x75a34e85d8aA9ff106740f60CB37fEFc2f0deAF9/node-red-example`. You can set your own values in their configuration.

# Changelog
### v0.0.1
* Initial release
* Publish and subscribe nodes added
* Config node added
### v0.0.2
* Upgraded to brubeck-era streamr-client and code
* Updated the docs

# License
This library is under Apache 2.0 license see [LICENSE.md](LICENSE.md)

# TODO
* Improve error logging
* Improve documentation