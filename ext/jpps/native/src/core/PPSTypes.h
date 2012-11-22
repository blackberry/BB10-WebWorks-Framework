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

#ifndef PPSTYPES_H_
#define PPSTYPES_H_

#include <map>

namespace jpps {

class PPSEvent;

/**
 * A struct representing an attribute of a PPS object.
 */
struct ppsAttribute {

	/** The attribute name. */
	std::string name;
	/** The attribute value. */
	std::string value;
	/** The attribute encoding. */
	std::string encoding;
	/** Flags associated to the attribute. */
	int flags;
	/** Attribute options. */
	int options;
	/** The attribute options mask. */
	int optionMask;
};

/**
 * A struct representing a PPS object.
 */
struct ppsObject {

	/** The PPS object name. */
	std::string name;
	/** The PPS object flags. */
	int flags;
	/** The PPS object options. */
	int options;
	/** The PPS object option mask. */
	int optionMask;
	/** The attributes of this PPS object. */
	std::map<std::string, ppsAttribute> attributes;
};

/**
 * Typedef for ppsAttribute iterator.
 */
typedef std::map<std::string, ppsAttribute>::iterator ppsAttrIter;

/**
 * Typedef for ppsAttribute const iterator.
 */
typedef std::map<std::string, ppsAttribute>::const_iterator const_ppsAttrIter;

/**
 * A pair used to insert attributes into the map.
 */
typedef std::pair<std::string, ppsAttribute> ppsAttrPair;

/**
 * This is the definition of the notify function clients of PPSInterface use in order
 * to be informed of events the PPSInterface generates.
 *
 * @param pArg A user defined parameter. This value can be passed in to PPSInterface::setEventFunc()
 * and will be passed back with the event handler every time it is called. PPSInterface will not
 * modify this value.
 *
 * @aparam event The PPS event being broadcast.
 */
typedef void (PPSEventFunc)(void* pArg, const PPSEvent& event);

};

#endif /* PPSTYPES_H_ */
