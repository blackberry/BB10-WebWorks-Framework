/*
 * Copyright (C) 2012 Research In Motion Limited. All rights reserved.
 */

/*
 * $QNXLicenseC:
 * Copyright 2009, QNX Software Systems. All Rights Reserved.
 *
 * You must obtain a written license from and pay applicable license fees to QNX
 * Software Systems before you may reproduce, modify or distribute this software,
 * or any work that includes all or part of this software.   Free development
 * licenses are available for evaluation and non-commercial purposes.  For more
 * information visit http://licensing.qnx.com or email licensing@qnx.com.
 *
 * This file may contain contributions from others.  Please review this entire
 * file for other proprietary rights or license notices, as well as the QNX
 * Development Suite License Guide at http://licensing.qnx.com/license-guide/
 * for other information.
 * $
 */

#include "JPPSPlugin.h"
#include "JPPSServerPlugin.h"

#include <string>

/**
 * This callback must be implemented by all JSExt objects. It is invoked from
 * plugin.cpp.
 *
 * @return A comma separated list of classes supported by this JNEXT extension
 */
char* onGetObjList(void)
{
	static char* ppsclasses = NULL;

	if (ppsclasses == NULL) {

		// Get the length of all the strings, +1 for the ',' +1 for the \0
		int size = std::strlen(jpps::JPPSPlugin::CLASS_NAME) + std::strlen(jpps::JPPSServerPlugin::CLASS_NAME) + 1 + 1;
		ppsclasses = new char[size];
		std::strcpy(ppsclasses, jpps::JPPSPlugin::CLASS_NAME);
		std::strcat(ppsclasses, ",");
		std::strcat(ppsclasses, jpps::JPPSServerPlugin::CLASS_NAME);
		ppsclasses[size] = '\0';
	}
    // Return a comma separated list of classes known to this plugin
    return ppsclasses;
}

/**
 * This callback must be implemented by all JSExt objects. It is invoked from
 * plugin.cpp.
 *
 * @param strClassName Name of the class requested to be created Valid named are those
 * that are returned in onGetObjList
 *
 * @param strObjId The unique object id for the class
 *
 * @return A pointer to the created extension object
 */
JSExt* onCreateObject(const std::string& strClassName, const std::string& strObjId)
{
    // Given a class name and identifier, create the relevant object.
    if (strClassName == jpps::JPPSPlugin::CLASS_NAME) {
        return new jpps::JPPSPlugin(strObjId);;
    }
    else if (strClassName == jpps::JPPSServerPlugin::CLASS_NAME) {
    	return new jpps::JPPSServerPlugin(strObjId);
    }

    // Any other name is invalid
    return NULL;
}


