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
var WidgetWebFolderAccess = require("./folderAccess").WidgetWebFolderAccess,
    util = require("../utils"); 
var _accessList,
    _hasGlobalAccess,
    _authorityCollection,
    _localAccess,
    _self;

function reset() {
    _accessList = undefined;
    _hasGlobalAccess = undefined;
    _authorityCollection = undefined;
    _localAccess = undefined;
}

function isLocalAccess(access) {
    if (access) {
        return access.uri === "WIDGET_LOCAL";
    }

    return false;
}

function initializeAuthCollection() {
    var access, folderAccess, currentURI, i;

    if (!_authorityCollection) {
        _authorityCollection = {};

        if (_accessList) {
            for (i = 0; i < _accessList.length; i++) {
                access = _accessList[i];

                if (isLocalAccess(access)) {
                    _localAccess = access;
                } else {
                    currentURI = util.parseUri(access.uri);

                    // Check the authority collection to see if the authority item
                    // we want already exists
                    if (_authorityCollection.hasOwnProperty(currentURI.scheme + "://" + currentURI.authority)) {
                        folderAccess = _authorityCollection[currentURI.scheme + "://" + currentURI.authority];
                    } else {
                        // Create web folder access
                        folderAccess = new WidgetWebFolderAccess();
                    }

                    // Add folder path access to the authority item
                    folderAccess.addWidgetAccess(currentURI.path, access);
                    _authorityCollection[currentURI.scheme + "://" + currentURI.authority] = folderAccess;
                }
            }
        }
    }
}

/**
 * Process the given scheme and authority and returns an authority which exists in the authority collection
 * @param scheme Scheme of the request url
 * @param authString Authority of the request url
 * @return Authority which exists in the authority collection
 */
function authorityCheck(scheme, authString) {
    var firstPass = true;

    while (!_authorityCollection.hasOwnProperty(scheme + "://" + authString)) { 
        // If the authority is empty string, then no access element exists for that subdomain
        // Also, if the auth becomes a top level domain and is not found, then stop as well
        // First pass will allow computer names to be used 
        if (authString === "" || ((authString.indexOf(".") === -1) && !firstPass)) {
            return "";
        }

        authString = authString.substring(authString.indexOf(".") + 1);

        // Set the flag
        if (firstPass) {
            firstPass = false;      
        }
    }

    return authString;
}

function isMatch(access, toMatchURI) {
    // Look for local first
    if (isLocalAccess(access)) {
        if (util.isLocalURI(toMatchURI) || util.isFileURI(toMatchURI)) {
            //local access always allowed
            return true;
        } else {
            return false;
        }
    } else if (util.isDataURI(toMatchURI)) {
        // Check for data url
        // data urls are allowed
        return true;
    }

    // Based on widgets 1.0 (access control)
    // http://www.w3.org/TR/2009/WD-widgets-access-20090618/#rfc3987        
    var referenceURI = util.parseUri(access.uri),
        allowSub = access.allowSubDomain,
        refHost = referenceURI.authority,
        matchHost = toMatchURI.authority,
        refPort = referenceURI.port,
        toMatchPort = toMatchURI.port,
        refPath = referenceURI.path + referenceURI.query,
        toMatchPath = toMatchURI.path + toMatchURI.query;
    
    // Start comparison based on widget spec.
    // 1. Compare scheme
    if (referenceURI.scheme.toLowerCase() !== toMatchURI.scheme.toLowerCase()) {
        return false;
    }
    
    // 2. Compare host - if subdoman is false, host must match exactly
    // (referenceURI MUST HAVE host specified - not null.)
    if (matchHost === null || matchHost === "") {
        return false;
    }
    
    if (!allowSub && refHost.toLowerCase() !== matchHost.toLowerCase()) {
        return false;
    }

    // 3. Compare host - if subdomain is true, check for subdomain or match
    if (allowSub && !util.endsWith(matchHost.toLowerCase(), "." + refHost.toLowerCase()) &&
        matchHost.toLowerCase() !== refHost.toLowerCase()) {
        return false;
    }
    
    // 4. Compare port
    if (refPort !== toMatchPort) {
        return false;
    }

    // 5.  Compare path+query
    if (!util.startsWith(toMatchPath, refPath)) {
        return false;
    }

    return true;
}

function getAccessByUrl(url) {
    var fetchedAccess,
        requestURI = util.parseUri(url),
        authority,
        scheme,
        folderAccess,
        failedToFindAccess = false;
    
    if (util.isAbsoluteUri(requestURI)) {
        // Initialize authority collection if it does not yet exist
        initializeAuthCollection(_accessList);

        // Start with the full authority path and check if a WidgetAccess set exists for that path
        // If it does not exist, remove the first section of the authority path and try again            
        authority = requestURI.authority;
        scheme = requestURI.scheme;

        // Check for an authority string that has an existing key
        // Special case: Allow file, and local  protocol to proceed without an authority            
        authority = authorityCheck(scheme, authority);
        if (authority === "" && !(scheme === "file" || scheme === "local")) {
            return null;
        }
        
        // Retrieve WidgetAccess set for the specified authority
        folderAccess = _authorityCollection[scheme + "://" + authority];

        // Special case: no access element was found for a file protocol request.  
        // This is added since file protocol was allowed through the above check
        if (scheme === "file" && !folderAccess) {
            return null;
        }

        // If no access element is found with local URI, use local access for this request
        if (scheme === "local" && !folderAccess) {
            return _localAccess;
        }

        if (requestURI.path === "") {
            fetchedAccess = folderAccess.getWidgetAccess("/");
        } else {
            fetchedAccess = folderAccess.getWidgetAccess(requestURI.path + requestURI.query);
        }            

        // Make sure we've got the right one
        while (!fetchedAccess || !isMatch(fetchedAccess, requestURI)) {
            // There was an auth url that matched, but didnt match the folder structure
            // Try the next level up
            authority = authority.substring(authority.indexOf(".") + 1);

            // Check for an authority string that has an existing key
            authority = authorityCheck(scheme, authority);
            if (authority === "") {
                failedToFindAccess = true;
                break;
            }

            // Retrieve WidgetAccess set for the specified authority                        
            folderAccess = _authorityCollection[scheme + "://" + authority];   

            // Special case: no access element was found for a file protocol request.  
            // This is added since file protocol was allowed through the above check
            if (scheme === "file" && folderAccess === null) {
                return null;
            }

            fetchedAccess = folderAccess.getWidgetAccess(requestURI.path + requestURI.query);
        }

        if (!failedToFindAccess) {
            return fetchedAccess;   
        } else if (isMatch(_localAccess, requestURI)) {
            //if we cannot find a more specific access for this local URI, use local access
            return _localAccess;
        }            
    }

    return fetchedAccess;
}

_self = {
    initialize : function (accessList, hasGlobalAccess) {
        reset();

        _accessList = accessList;
        _hasGlobalAccess = hasGlobalAccess;
    },
    
    isFeatureAllowed : function (url, feature) {
        var access = getAccessByUrl(url), features, i;
        
        if (access) {
            features = access.features;

            if (features) {
                for (i = 0; i < features.length; i++) {
                    if (features[i].id === feature) {
                        return true;
                    }
                }
            }
        }
        
        return false;
    },
    
    isAccessAllowed : function (url) {
        if (_hasGlobalAccess) {
            return true;
        }

        var access = getAccessByUrl(url);
        return (access !== null && access !== undefined);
    }
};

module.exports = _self;
