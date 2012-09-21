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

var LIB_FOLDER = "./../../../lib/",
    _overlayWebView = require(LIB_FOLDER + 'overlayWebView'),
    _webview = require(LIB_FOLDER + 'webview'),
    _utils = require(LIB_FOLDER + 'utils'),
    _config = require(LIB_FOLDER + 'config.js'),
    _event = require(LIB_FOLDER + 'event'),
    _dialog = require(LIB_FOLDER + 'ui/dialog/index.js'),
    _menuItems,
    _currentContext,
    _invocation = window.qnx.webplatform.getApplication().invocation,
    _application = window.qnx.webplatform.getApplication(),
    _handlers = {},
    _customHandlers = {},
    _invocationResults,
    menuActions;


function setCurrentContext(context) {
    _currentContext = context;
}

// Default context menu response handler
function handleContextMenuResponse(args) {
    var menuAction = args[0];
    _webview.handleContextMenuResponse(menuAction);
}

function loadClientURL(args) {
    var url = args[0];
    _webview.setURL(url);
}

function downloadURL(args) {
    var url = args[0];
    _webview.downloadURL(url);
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

function showInvocationList(title, request, results) {
    var listArgs;

    if (_currentContext.title) {
        request.metadata = JSON.stringify({title: _currentContext.title});
    }

    listArgs = JSON.stringify([{request: request, results: results}, title]);
    _overlayWebView.executeJavascript("require('invocationlist').show(" + listArgs + ")");
}

function generateInvocationList(request, errorMessage) {
    _invocation.queryTargets(request, function (error, results) {
        if (error || results.length === 0) {
            // TODO: Port Toaster code over
            //require('plugins/toaster/index').createBasicToast(require('iris/i18n').translate('No
            console.log(errorMessage);
        } else {
            showInvocationList(request, results);
        }
    });
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
    var targets = _invocationResults[0].targets,
        request = {
            action: 'bb.action.SHARE',
            type: 'text/plain',
            target_type_mask: _application.invocation.TARGET_TYPE_MASK_APPLICATION | _application.invocation.TARGET_TYPE_MASK_CARD |
                _application.invocation.TARGET_TYPE_MASK_SERVICE,
            data: _currentContext.url
        },
        invokeRequest;

    if (targets.length === 1) {
        invokeRequest = {
            target : targets[0].key,
            action : request.action,
            type: request.type,
            uri : request.uri,
            data : window.btoa(request.data)
        };

        _invocation.invoke(invokeRequest, function (error, response) {
            if (error) {
                console.log(error);
            }
        });
    } else {
        showInvocationList('Share Link', request, _invocationResults);
    }
}

function saveImage() {

    // Ensure we have a proper context of the image to save
    if (!_currentContext || !_currentContext.isImage || !_currentContext.src) {
        return;
    }

    // Check that the proper access permissions have been enabled
    if (!_config.permissions || _config.permissions.indexOf("access_shared") === -1) {
        _dialog.show({ dialogType : "JavaScriptAlert", message : "Access shared permissions are not enabled"});
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

function customItemHandler(actionId) {
    _event.trigger('contextmenu.executeMenuAction', actionId);
}

function addCustomItem(actionId) {
    if (_customHandlers[actionId]) {
        return false;
    } else {
        _customHandlers[actionId] = customItemHandler.bind(this, actionId);
        return true;
    }
}

function removeCustomItem(actionId) {
    if (_customHandlers[actionId]) {
        delete _customHandlers[actionId];
    }
}

function clearCustomHandlers() {
    _customHandlers = {};
}

function runHandler(actionId) {
    if (_customHandlers[actionId]) {
        _customHandlers[actionId](actionId);
    } else if (_handlers[actionId]) {
        _handlers[actionId](actionId);
    }
}

_handlers = {
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
    'InspectElement' : responseHandler
};

menuActions = {
    handlers: _handlers,
    runHandler: runHandler,
    clearCustomHandlers: clearCustomHandlers,
    setCurrentContext: setCurrentContext,
    addCustomItem: addCustomItem,
    removeCustomItem: removeCustomItem
};

menuActions.__defineSetter__('invocationResults', function (val) {
    _invocationResults = val; 
});

module.exports = menuActions;
