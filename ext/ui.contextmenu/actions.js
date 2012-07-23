/*
 * Copyright 2012 Research In Motion Limited.
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

var _overlayWebView = require('./../../lib/overlayWebView'),
    _utils = require('./../../lib/utils'),
    _config = require('./../../lib/config.js'),
    _menuItems,
    _currentContext,
    _invocation = window.qnx.webplatform.getApplication().invocation,
    _application = window.qnx.webplatform.getApplication(),
    menuActions;


function setCurrentContext(context) {
    _currentContext = context;
}

// Generate the list of menu items for invocation
function generateInvocationList(request, errorMessage) {
    _invocation.queryTargets(request, function (errorMessage, results) {
        if (results.length > 0) {
            var listArgs = JSON.stringify([results[0], request]);
            _overlayWebView.executeJavascript("window.showTargets(" + listArgs + ")");
        } else {
            console.log(errorMessage);
        }
    });
}

// Default context menu response handler
function handleContextMenuResponse(args) {
    var menuAction = args[0];
    qnx.callExtensionMethod('webview.handleContextMenuResponse', 2, menuAction);
}

function loadClientURL(args) {
    var url = args[0];
    qnx.callExtensionMethod('webview.loadURL', 2, url);
}

function downloadURL(args) {
    var url = args[0];
    qnx.callExtensionMethod('webview.downloadURL', 2, url);
}

function downloadSharedFile(args, callback) {

    var directory   = window.qnx.webplatform.getApplication().getEnv("HOME"),
        target      = directory + "/../shared/" + args[1] + "/",
        source      = args[0],
        fileName    = args[0].replace(/^.*[\\\/]/, ''),
        xhr;

    window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;

    // Check for a local file, if so, let's change it an absolute file path
    if (_utils.startsWith(source, "local:///")) {
        source = "file:/" + directory + "/../app/native/" + source.replace(/local:\/\/\//, '');
    }

    xhr = new XMLHttpRequest();
    xhr.open('GET', source, true);
    xhr.responseType = 'arraybuffer';

    function onError(error) {
        console.log(error);
    }

    xhr.onload = function (e) {
        window.requestFileSystem(window.TEMPORARY, 1024 * 1024, function (fileSystem) {
            fileSystem.root.getFile(target + fileName, {create: true}, function (fileEntry) {
                fileEntry.createWriter(function (writer) {
                    writer.onerror = function (e) {
                        console.log("Could not properly write " + fileName);
                        //pass
                    };

                    var bb = new window.WebKitBlobBuilder();
                    bb.append(xhr.response);
                    writer.write(bb.getBlob(_utils.fileNameToImageMIME(fileName)));

                    // Call the callback sending back the filepath to the image so the Viewer can be invoked
                    callback(target + fileEntry.name);
                }, onError);
            }, onError);
        }, onError);
    };

    xhr.send();
}

function saveLink() {
    if (!_currentContext || !_currentContext.url) {
        return;
    }
    var title = '';
    downloadURL([_currentContext.url, title]);
}

function openLink() {
    if (!_currentContext || !_currentContext.url) {
        return;
    }
    //Update the content web view with the new URL
    loadClientURL([_currentContext.url]);
}

function shareLink() {

    if (!_currentContext || !_currentContext.url) {
        return;
    }

    var request = {
        action: 'bb.action.SHARE',
        type : 'text/plain',
        data : _currentContext.url,
        action_type: _application.invocation.ACTION_TYPE_ALL,
        target_type: _application.invocation.TARGET_TYPE_APPLICATION
    };

    generateInvocationList(request, 'No link sharing applications installed');
}


function saveImage() {

    // Ensure we have a proper context of the image to save
    if (!_currentContext || !_currentContext.isImage || !_currentContext.src) {
        return;
    }

    // Check that the proper access permissions have been enabled
    if (!_config.permissions || _config.permissions.indexOf("access_shared") === -1) {
        alert("Access shared permissions are not enabled");
        return;
    }

    var source     = _currentContext.src,
        target     = "photos";

    function onSaved(target) {

        if (target) {
            var request = {
                action: 'bb.action.VIEW',
                type: _utils.fileNameToImageMIME(target),
                uri : "file:/" + target, //target comes back with double slash, change to triple
                action_type: _application.invocation.ACTION_TYPE_ALL,
                target_type: _application.invocation.TARGET_TYPE_ALL
            };

            generateInvocationList(request, 'No image viewing applications installed');
        }
    }

    downloadSharedFile([source, target], onSaved);
}

function responseHandler(menuAction) {
    if (!menuAction) {
        return;
    }
    handleContextMenuResponse([menuAction]);
}

menuActions = {

    'SaveLink'       : saveLink,
    'Cancel'         : responseHandler,
    'ClearField'     : responseHandler,
    'Cut'            : responseHandler,
    'Copy'           : responseHandler,
    'Paste'          : responseHandler,
    'Select'         : responseHandler,
    'CopyLink'       : responseHandler,
    'OpenLink'       : openLink,
    'SaveLinkAs'     : saveLink,
    'CopyImageLink'  : responseHandler,
    'SaveImage'      : saveImage,
    'ShareLink'      : shareLink,
    'InspectElement' : responseHandler,
    setCurrentContext: setCurrentContext,
};

module.exports = menuActions;
