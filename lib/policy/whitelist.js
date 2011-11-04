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
var _accessList,
    _hasGlobalAccess,
    _authorityCollection,
    _localAccess,
    _self;

/**
 * Clear all states
 * (Not needed for production since the whitelist will only be initialized once. This
 * is added to allow unit tests to reuse the same whitelist instance over and over again.)
 */
function reset() {
    _accessList = undefined;
    _hasGlobalAccess = undefined;
    _authorityCollection = undefined;
    _localAccess = undefined;
}

/**
 * Determine if a given access is the local access which has the special uri
 * @param access
 * @return true if it is the local access
 */
function isLocalAccess(access) {
    if (access) {
        return access.uri === "WIDGET_LOCAL";
    }

    return false;
}

/**
 * Initialize authority collection which stores WebFolderAccess objects indexed by partial URIs
 * (up to authority)
 */
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
                        folderAccess = new WebFolderAccess();
                    }

                    // Add folder path access to the authority item
                    folderAccess.addAccess(currentURI.path, access);
                    _authorityCollection[currentURI.scheme + "://" + currentURI.authority] = folderAccess;
                }
            }
        }
    }
}

/**
 * Process the given scheme and authority and returns an authority which exists in the authority collection
 * @param scheme Scheme of the request url
 * @param authority Authority of the request url
 * @return authority which exists in the authority collection
 */
function authorityCheck(scheme, authority) {
    var firstPass = true;

    while (!_authorityCollection.hasOwnProperty(scheme + "://" + authority)) { 
        // If the authority is empty string, then no access element exists for that subdomain
        // Also, if the auth becomes a top level domain and is not found, then stop as well
        // First pass will allow computer names to be used 
        if (authority === "" || ((authority.indexOf(".") === -1) && !firstPass)) {
            return "";
        }

        authority = authority.substring(authority.indexOf(".") + 1);

        // Set the flag
        if (firstPass) {
            firstPass = false;      
        }
    }

    return authority;
}

/**
 * Check if a given URI matches a given access object. A comparison will be done on ALL parts of the uri.
 * @param access
 * @param requestURI
 * @return true if match
 */
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

    refURI.path = refURI.path + refURI.query;
    requestURI.path = requestURI.path + requestURI.query;
    
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
    
    if (!allowSub && refURI.authority.toLowerCase() !== requestURI.authority.toLowerCase()) {
        return false;
    }

    // 3. Compare host - if subdomain is true, check for subdomain or match
    if (allowSub && !util.endsWith(requestURI.authority.toLowerCase(), "." + refURI.authority.toLowerCase()) &&
        requestURI.authority.toLowerCase() !== refURI.authority.toLowerCase()) {
        return false;
    }
    
    // 4. Compare port
    if (refURI.port !== requestURI.port) {
        return false;
    }

    // 5.  Compare path+query
    if (!util.startsWith(requestURI.path, refURI.path)) {
        return false;
    }

    return true;
}

/**
 * Go through WebFolderAccess(es) from the authority collection to find the matching
 * access object
 * @param url
 * @return the matching access object or null
 */
function getFromFolderAccess(folderAccess, requestURI) {
    var fetchedAccess = null,
        scheme = requestURI.scheme,
        authority = requestURI.authority,
        path = requestURI.path,
        query = requestURI.query;

    if (path === "") {
        fetchedAccess = folderAccess.getAccess("/");
    } else {
        fetchedAccess = folderAccess.getAccess(path + query);
    }

    // Make sure we've got the right one
    while (!fetchedAccess || !isMatch(fetchedAccess, requestURI)) {
        // There was an auth url that matched, but didnt match the folder structure
        // Try the next level up
        authority = authority.substring(authority.indexOf(".") + 1);

        // Check for an authority string that has an existing key
        authority = authorityCheck(scheme, authority);
        if (authority === "") {
            return null;
        }

        // Retrieve access set for the specified authority
        folderAccess = _authorityCollection[scheme + "://" + authority];

        // Special case: no access element was found for a file protocol request.
        // This is added since file protocol was allowed through the above check
        if (scheme === "file" && !folderAccess) {
            return null;
        }

        fetchedAccess = folderAccess.getAccess(path + query);
    }

    return fetchedAccess;
}

/**
 * Get the matching access object given a request URI
 * @param url
 * @return the matching access object or null
 */
function getAccessByUrl(url) {
    var requestURI = util.parseUri(url),
        authority = requestURI.authority,
        scheme = requestURI.scheme,
        folderAccess,
	fetchedAccess;
    
    if (util.isAbsoluteURI(requestURI)) {
        // Initialize authority collection if it does not yet exist
        initializeAuthCollection(_accessList);

        // Start with the full authority path and check if an access exists for that path
        // If it does not exist, remove the first section of the authority path and try again            

        // Check for an authority string that has an existing key
        // Special case: Allow file, and local protocol to proceed without an authority            
        authority = authorityCheck(scheme, authority);
        if (authority === "" && !(scheme === "file" || scheme === "local")) {
            return null;
        }
        
        // Retrieve access set for the specified authority
        folderAccess = _authorityCollection[scheme + "://" + authority];

        // Special case: no access was found for a file protocol request
        // This is added since file protocol was allowed through the above check
        if (scheme === "file" && !folderAccess) {
            return null;
        }

        // If no access element is found with local URI, use local access for this request
        if (scheme === "local" && !folderAccess) {
            return _localAccess;
        }

        fetchedAccess = getFromFolderAccess(folderAccess, requestURI);
	
        if (fetchedAccess) {
            return fetchedAccess;
        } else if (isMatch(_localAccess, requestURI)) {
            // If we cannot find a more specific access for this local URI, use local access
            return _localAccess;
        }
    }

    return null;
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
        return !!access;
    }
};

module.exports = _self;
