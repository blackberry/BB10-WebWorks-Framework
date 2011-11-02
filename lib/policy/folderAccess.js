/*
 * Copyright 2010-2011 Research In Motion Limited.
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

var util = require("../utils"); 

// Removes the start and end slashes from the path
function trimSurroundingSlashes(path) {
    // Trim starting slash
    if (util.startsWith(path, "/")) {
        path = path.substr(1);
    }

    // Trim ending slash
    if (util.endsWith(path, "/")) {
        path = path.substr(0, path.length - 1);
    }
}

// Determines the depth of the given path
// Folder path must not include the scheme or the host
function determineDepth(folderPath) {
    var depthCount = 0;
    
    // Replace all backslashes with forward slash
    folderPath = folderPath.replace("\\", "/");
    
    // Special case: "/" is the given path
    if (folderPath === "/") {
        return 0;
    }

    folderPath = trimSurroundingSlashes(folderPath);

    // Count slashes remaining
    while (folderPath.indexOf("/") !== -1) {
        depthCount = depthCount + 1;

        // Add 1 to skip the slash
        folderPath = folderPath.substring(folderPath.indexOf("/") + 1);
    }

    // Add one more for the remaining folder
    depthCount += 1;

    return depthCount;
}

// Parse a folder path up to the desired depth
function getPath(folderPath, desiredDepth) {   
    var depthCount = 0, builtPath = "";

    // Special case: Desired depth is 0
    if (desiredDepth === 0) {
        return "/";
    }

    // Replace all backslashes with forward slash
    folderPath = folderPath.replace("\\", "/");       

    folderPath = trimSurroundingSlashes(folderPath);

    // Count slashes remaining
    while (depthCount < desiredDepth) {
        depthCount += 1;
        
        // Add 1 to skip the slash
        builtPath += "/" + folderPath.substring(0, folderPath.indexOf('/'));
        folderPath = folderPath.substring(folderPath.indexOf('/') + 1);
    }

    return builtPath;
}

function WidgetWebFolderAccess() {
    this._pathCollection = {};
    this._maxPathLength = 0;
}

// Adds WidgetElement to the structure by using the folder path as a key
// Folder path must not include the scheme or the host
WidgetWebFolderAccess.prototype.addWidgetAccess = function (folderPath, accessElement) {
    if (folderPath === "") {
        folderPath = "/";
    }

    // Trim surrounding slashes for consistency
    // The root "/" is a special case that does not need this trimming
    if (folderPath !== "/") {
        folderPath = "/" + trimSurroundingSlashes(folderPath);        
    }

    this._pathCollection[folderPath] = accessElement;

    // Determine the depth of the path
    this._maxPathLength = Math.max(this._maxPathLength, determineDepth(folderPath));    
};

// Retrieves the access element assigned to the folder path, if it exists
// Folder path must not include the scheme or the host
WidgetWebFolderAccess.prototype.fetchWidgetAccess = function (folderPath) {
    return this._pathCollection[folderPath];
};

// Retrieves the access element assigned to the folder path, if it exists
// Folder path must not include the scheme or the host
WidgetWebFolderAccess.prototype.getWidgetAccess = function (folderPath) {   
    var depth = determineDepth(folderPath);
    return this.getWidgetAccessRecursively(folderPath, depth);
};

WidgetWebFolderAccess.prototype.getWidgetAccessRecursively = function (folderPath, pathLength) {
    // Check folder path if an entry exists for the full path
    if (this._pathCollection.hasOwnProperty(folderPath)) {
        return this.fetchWidgetAccess(folderPath);
    } else if (folderPath === "") {
        return null;
    } else {
        // Truncate the end portion of the path and try again
        var newPathLength, newPath;

        newPathLength = Math.min(this._maxPathLength, pathLength - 1);
        newPath = getPath(folderPath, newPathLength);

        return this.getWidgetAccessRecursively(newPath, newPathLength);
    }
};

exports.WidgetWebFolderAccess = WidgetWebFolderAccess;
