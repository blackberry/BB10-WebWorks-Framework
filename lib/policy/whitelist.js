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
var WebFolderAccess = require("./folderAccess").WebFolderAccess,
    util = require("../utils");

function isLocalAccess(access) {
    return access && access.uri === "WIDGET_LOCAL";
}

function isMatch(access, requestURI) {
    // Look for local first
    if (isLocalAccess(access)) {
        // Local access always allowed
        return (util.isLocalURI(requestURI) || util.isFileURI(requestURI));
    } else if (util.isDataURI(requestURI)) {
        // Check for data url
        // data urls are allowed
        return true;
    }

    // Based on widgets 1.0 (access control)
    // http://www.w3.org/TR/2009/WD-widgets-access-20090618/#rfc3987        
    var refURI = util.parseUri(access.uri),
        allowSub = access.allowSubDomain;

    if (requestURI.path === "") {
        requestURI.path = "/";
    }
    
    // Start comparison based on widget spec.
    // 1. Compare scheme
    if (refURI.scheme.toLowerCase() !== requestURI.scheme.toLowerCase()) {
        return false;
    }
    
    // 2. Compare host - if subdoman is false, host must match exactly
    // (referenceURI MUST HAVE host specified - not null.)
    if (!requestURI.authority) {
        return false;
    }
    
    if (!allowSub && refURI.host.toLowerCase() !== requestURI.host.toLowerCase()) {
        return false;
    }

    // 3. Compare host - if subdomain is true, check for subdomain or match
    if (allowSub && !util.endsWith(requestURI.host.toLowerCase(), "." + refURI.host.toLowerCase()) &&
        requestURI.host.toLowerCase() !== refURI.host.toLowerCase()) {
        return false;
    }

    // 4. Compare port
    if (refURI.port && refURI.port !== requestURI.port) {
        return false;
    }

    // 5.  Compare path+query
    if (!util.startsWith(requestURI.path, refURI.path) && refURI.getQuery() !== "*") {
        return false;
    }

    return true;
}

function getAccessForPathAndQuery(folderAccess, path, query) {
    if (!query) {
        return folderAccess.getAccess(path);
    } else {
        return folderAccess.getAccess(path + "?" + query);
    }
}

function AccessManager(config) {
    config = config || require("../config");

    this._accessList = config.accessList;
    this._hasGlobalAccess = config.hasMultiAccess;
    this._authorityCollection = null;
    this._localAccess = null;
}

AccessManager.prototype.initializeAuthCollection = function () {
    var access, folderAccess, currentURI, i;
    
    if (!this._authorityCollection) {
        this._authorityCollection = {};

        if (this._accessList) {
            for (i = 0; i < this._accessList.length; i++) {
                access = this._accessList[i];

                if (isLocalAccess(access)) {
                    this._localAccess = access;
                } else {
                    currentURI = util.parseUri(access.uri);

                    // Check the authority collection to see if the authority item
                    // we want already exists
                    if (this._authorityCollection.hasOwnProperty(currentURI.scheme + "://" + currentURI.authority)) {
                        folderAccess = this._authorityCollection[currentURI.scheme + "://" + currentURI.authority];
                    } else {
                        folderAccess = new WebFolderAccess();
                    }

                    // Add folder path access to the authority item
                    if (!currentURI.query) {
                        folderAccess.addAccess(currentURI.path, access);
                    } else {
                        folderAccess.addAccess(currentURI.path + "?" + currentURI.query, access);
                    }

                    this._authorityCollection[currentURI.scheme + "://" + currentURI.authority] = folderAccess;
                }
            }
        }
    }
};

AccessManager.prototype.authorityCheck = function (scheme, authority) {
    var firstPass = true,
        portIndex;

    if ((portIndex = authority.indexOf(":")) > -1) {
        // If authority has a specific port, and the collection does not have an access matches
        // the exact authority, strip port from authority to see if there is a match
        if (!this._authorityCollection.hasOwnProperty(scheme + "://" + authority)) {
            authority = authority.substring(0, portIndex);
        }
    }

    while (!this._authorityCollection.hasOwnProperty(scheme + "://" + authority)) { 
        // If the authority is empty string, then no access element exists for that subdomain
        // Also, if the auth becomes a top level domain and is not found, then stop as well
        // First pass will allow computer names to be used 
        if (authority === "" || ((authority.indexOf(".") === -1) && !firstPass)) {
            return "";
        }

        authority = authority.substring(authority.indexOf(".") + 1);

        if (firstPass) {
            firstPass = false;      
        }
    }

    return authority;
};

AccessManager.prototype.getFromFolderAccess = function (folderAccess, requestURI) {
    var fetchedAccess = null,
        scheme = requestURI.scheme,
        authority = requestURI.authority,
        path = requestURI.path,
        query = requestURI.query;

    if (path === "") {
        fetchedAccess = folderAccess.getAccess("/");
    } else {
        fetchedAccess = getAccessForPathAndQuery(folderAccess, path, query);
    }

    // Make sure we've got the right one
    while (!fetchedAccess || !isMatch(fetchedAccess, requestURI)) {
        // There was an auth url that matched, but didnt match the folder structure
        // Try the next level up
        authority = authority.substring(authority.indexOf(".") + 1);

        // Check for an authority string that has an existing key
        authority = this.authorityCheck(scheme, authority);
        if (authority === "") {
            return null;
        }

        // Retrieve access set for the specified authority
        folderAccess = this._authorityCollection[scheme + "://" + authority];

        // Special case: no access element was found for a file protocol request.
        // This is added since file protocol was allowed through the above check
        if (scheme === "file" && !folderAccess) {
            return null;
        }

        fetchedAccess = getAccessForPathAndQuery(folderAccess, path, query);
    }

    return fetchedAccess;
};

AccessManager.prototype.getAccessByUrl = function (url) {
    var requestURI = util.parseUri(url),
        authority = requestURI.authority,
        scheme = requestURI.scheme,
        folderAccess,
	fetchedAccess;

    if (util.isAbsoluteURI(requestURI)) {
        // Initialize authority collection if it does not yet exist
        this.initializeAuthCollection();

        // Start with the full authority path and check if an access exists for that path
        // If it does not exist, remove the first section of the authority path and try again            

        // Check for an authority string that has an existing key
        // Special case: Allow file, and local protocol to proceed without an authority            
        authority = this.authorityCheck(scheme, authority);
        if (authority === "" && !(scheme === "file" || scheme === "local" || scheme === "data")) {
            return null;
        }
        // Retrieve access set for the specified authority
        folderAccess = this._authorityCollection[scheme + "://" + authority];

        // Special case: no access was found for a file protocol request
        // This is added since file protocol was allowed through the above check
        if (scheme === "file" && !folderAccess) {
            return null;
        }

        // If no access element is found with local URI, use local access for this request
        if (scheme === "local" && !folderAccess) {
            return this._localAccess;
        }

        fetchedAccess = this.getFromFolderAccess(folderAccess, requestURI);
	
        if (fetchedAccess) {
            return fetchedAccess;
        } else if (this._localAccess && isMatch(this._localAccess, requestURI)) {
            // If we cannot find a more specific access for this local URI, use local access
            return this._localAccess;
        }
    }

    return null;
};

AccessManager.prototype.hasGlobalAccess = function () {
    return this._hasGlobalAccess;
};

function Whitelist(config) {
    this._mgr = new AccessManager(config);
}

Whitelist.prototype.isFeatureAllowed = function (url, feature) {
    var access = this._mgr.getAccessByUrl(url), i;

    if (access) {
        if (access.features) {
            for (i = 0; i < access.features.length; i++) {
                if (access.features[i].id === feature) {
                    return true;
                }
            }
        }
    }

    return false;
};

Whitelist.prototype.isAccessAllowed = function (url) {
    if (this._mgr.hasGlobalAccess()) {
        return true;
    }

    return !!this._mgr.getAccessByUrl(url);
};

exports.Whitelist = Whitelist;
