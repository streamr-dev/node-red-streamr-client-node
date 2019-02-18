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
This library includes config node, publish and subscribe nodes. To be able to utilize these nodes you need to create a streamr account, a stream and acquire an API key. Instructions to create these can be found from [Streamr blog](https://medium.com/streamrblog/how-to-connect-data-to-streamr-in-5-minutes-1-of-3-9363afd254e6).

# Changelog
### v0.0.1
* Initial release
* Publish and subscribe nodes added
* Config node added
