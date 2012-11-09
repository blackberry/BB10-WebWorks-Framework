/*
 *  Copyright 2012 Research In Motion Limited.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var Whitelist = require('./policy/whitelist').Whitelist,
    config = require('./config'),
    utils = require('./utils'),
    ACCEPT_RESPONSE = {setAction: "ACCEPT"},
    DENY_RESPONSE = {setAction: "DENY"},
    SUBSTITUTE_RESPONSE = {setAction: "SUBSTITUTE"},
    LOCAL_URI = "local://",
    FILE_URI = "file://",
    originAccessList,
    _webview;

function _formMessage(url, origin, sid, body) {
    var tokens = url.split(utils.getURIPrefix())[1].split("/"),
        //Handle the case where the method is multi-level
        finalToken = (tokens[3] && tokens.length > 4) ? tokens.slice(3).join('/') : tokens[3];

    return {
        request : {
            params : {
                service : tokens[0],
                action : tokens[1],
                ext : tokens[2],
                method : (finalToken && finalToken.indexOf("?") >= 0) ? finalToken.split("?")[0] : finalToken,
                args : (finalToken && finalToken.indexOf("?") >= 0) ? finalToken.split("?")[1] : null
            },
            body : body,
            origin : origin
        },
        response : {
            send : function (code, data) {
                var responseText;
                if (typeof(data) === 'string') {
                    responseText = data;
                } else {
                    responseText =  JSON.stringify(data);
                }

                _webview.notifyOpen(sid, code, "OK");
                _webview.notifyHeaderReceived(sid, "Access-Control-Allow-Origin", "*");
                _webview.notifyHeaderReceived(sid, "Access-Control-Allow-Headers", "Content-Type");
                _webview.notifyDataReceived(sid, responseText, responseText.length);
                _webview.notifyDone(sid);
            }
        }
    };
}

function addOriginAccess(origin, destination, allowSubdomains) {
    if (!originAccessList.hasOwnProperty(origin)) {
        originAccessList[origin] = [];
    }

    if (originAccessList[origin].indexOf(destination) === -1) {
        originAccessList[origin].push(destination);
        _webview.addOriginAccessWhitelistEntry(origin, destination, allowSubdomains);
    }
}

function networkResourceRequestedHandler(value) {
    var obj = JSON.parse(value),
        response,
        url = obj.url,
        body = obj.body,
        whitelist = new Whitelist(),
        server,
        message,
        sid = obj.streamId,
        origin = obj.referrer,
        hasAccess = whitelist.isAccessAllowed(url);

    //If the URL starts with the prefix then its a request from an API
    //In this case we will hijack and give our own response
    //Otherwise follow whitelisting rules
    if (url.match("^" + utils.getURIPrefix())) {
        server = require("./server");
        message = _formMessage(url, origin, sid, body);
        response = SUBSTITUTE_RESPONSE;
        server.handle(message.request, message.response);
    } else {
        //Whitelisting will not prevent navigation, ONLY we will
        if (hasAccess) {
            response = ACCEPT_RESPONSE;
            //HACK TO COVER DIFFERENCES BETWEEN WEBKIT AND WEBWORKS
            addOriginAccess(obj.securityOrigin, url, false);

        } else {
            response = DENY_RESPONSE;
            url = utils.parseUri(url);
            _webview.executeJavaScript("alert('Access to \"" + url.source + "\" not allowed')");
        }
    }

    if (response) {
        return JSON.stringify(response);
    }
}

function enableWhitelisting() {
    var accessElements = config.accessList;

    accessElements.forEach(function (element) {
        var uri = element.uri,
            parsedURI;

        //Local case
        if (uri === 'WIDGET_LOCAL' && element.features && element.features.length) {
            //Add access from local for APIs
            addOriginAccess(LOCAL_URI, utils.getURIPrefix(), true);

            //Always allow file access from local and let the OS deal with permissions
            addOriginAccess(LOCAL_URI, FILE_URI, true);
            addOriginAccess(FILE_URI, LOCAL_URI, true);
        } else {
            parsedURI = utils.parseUri(uri);
            //TODO: Find a way to have access URIs with file:// to be given universal access
            if (!utils.isFileURI(parsedURI)) {
                //TODO: Find a way for all domains to access the element
                //Dirty Hack - Allow access to local and file

                addOriginAccess(uri, LOCAL_URI, element.allowSubDomain);
                addOriginAccess(LOCAL_URI, uri, element.allowSubDomain);
                addOriginAccess(uri, FILE_URI, element.allowSubDomain);
                addOriginAccess(FILE_URI, uri, element.allowSubDomain);

                if (element.features && element.features.length) {
                    addOriginAccess(uri, utils.getURIPrefix(), true);
                }
            }
        }
    });
}

module.exports = {
    //Uses the webplatform webview object for several functions
    init: function (webview) {
        _webview = webview;
        originAccessList = {};
        enableWhitelisting();
        return {
            networkResourceRequestedHandler: networkResourceRequestedHandler
        };
    }
};
