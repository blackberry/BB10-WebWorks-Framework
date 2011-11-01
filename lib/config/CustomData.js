var ConfigConstants = require("./ConfigConstants.js"),
   TransitionConstants = require("./TransitionConstants.js"),
   _self;

_self = {
   "name": "File Transfer",
   "customHeaders": {
      "RIM-Widget": "rim/widget"
   },
   "onFirstLaunch": false,
   "author": "Me",
   "content": "index.html",
   "copyright": "",
   "version": "1.0.0",
   "foregroundSource": "index.html",
   "widgetExtensions": [],
   "onRemotePageLoad": false,
   "description": "",
   "authorEmail": "",
   "configXML": "config.xml",
   "onLocalPageLoad": false,
   "hasMultiAccess": true,
   "accessList": [{
      "allowSubDomain": true,
      "features": [{
         "version": "1.0.0.0",
         "required": true,
         "id": "blackberry.app"
      }, {
         "version": "1.0.0.0",
         "required": true,
         "id": "blackberry.system"
      }, {
         "version": "1.0.0",
         "required": true,
         "id": "blackberry.ui.dialog"
      }, {
         "version": "1.0.0",
         "required": true,
         "id": "blackberry.invoke"
      }, {
         "version": "1.0.0",
         "required": true,
         "id": "blackberry.utils"
      }, {
         "version": "1.0.0.0",
         "required": true,
         "id": "blackberry.system.event"
      }, {
         "version": "1.0.0.0",
         "required": true,
         "id": "blackberry.app.event"
      }, {
         "version": "1.0.0.0",
         "required": true,
         "id": "blackberry.io.file"
      }, {
         "version": "1.0.0.0",
         "required": true,
         "id": "blackberry.io.dir"
      }, {
         "version": "1.0.0.0",
         "required": true,
         "id": "blackberry.media.microphone"
      }, {
         "version": "1.0.0.0",
         "required": true,
         "id": "webworks.io.filetransfer"
      }],
      "authorURL": ""
   };

module.exports = _self;