/*
* Copyright 2011-2012 Research In Motion Limited.
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

var webviews = {},
    pendingViewportChanges = 0,
    self;

var viewportChanged = function (webviewId) {
    var app = window.qnx.webplatform.getApplication();
    
    //After decrementing, if there are no more pending viewport changes, remove
    //the listener and call notifyRotateComplete
    if (--pendingViewportChanges === 0) {
        app.removeEventListener('application.propertyViewportEvent', viewportChanged);
        app.notifyRotateComplete();
    }
};

var onRotate = function (width, height, angle) {
    var app = window.qnx.webplatform.getApplication();
    pendingViewportChanges = 0;

    app.addEventListener('application.propertyViewportEvent', viewportChanged);
    
    //Set orientation for application
    app.setWindowOrientation(angle);
    
    //Set orientation and geometry for each webview
    Object.keys(webviews).forEach(function (webviewId) {
        webviewId = window.parseInt(webviewId, 10);
        
        webviews[webviewId].setApplicationOrientation(angle);
        webviews[webviewId].setGeometry(0, 0, width, height);
        
        pendingViewportChanges++;
    });
};

var onRotateDone = function () {
    // Notify all webviews that rotation has completed
    Object.keys(webviews).forEach(function (webviewId) {
        webviews[webviewId].notifyApplicationOrientationDone();
    });
};

self = {

    addWebview: function (webview) {
        webviews[webview.id()] = webview;
    },
    
    removeWebview: function (webview) {
        delete webviews[webview.id()];
    }
};

window.qnx.webplatform.getApplication().addEventListener('application.rotate', onRotate);
window.qnx.webplatform.getApplication().addEventListener('application.rotateDone', onRotateDone);

module.exports = self;
