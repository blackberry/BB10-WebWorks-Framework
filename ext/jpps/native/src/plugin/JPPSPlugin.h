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

#ifndef JPPSPLUGIN_H_
#define JPPSPLUGIN_H_

#include "../common/plugin.h"
#include "PPSInterfaceGlue.h"

namespace jpps {

/**
 * JPPSPlugin is a JNext extension which provides PPS support to JavaScript.
 * This class is merely a wrapper for PPSInterfaceGlue, providing the necessary
 * JNext interface and performing string-parameter encoding and decoding.
 *
 * The intention is that this class will be replaced with a different plug-in framework.
 */
class JPPSPlugin : public JSExt {

public:

	// Constants

	/** The only class supported by this plugin. */
	static const char* CLASS_NAME;

	// List of object methods supported by this extension

	/** Open a PPS object/directory. */
	static const std::string METHOD_OPEN;
	/** Close a PPS object/directory. */
	static const std::string METHOD_CLOSE;
	/** Write a PPS object. */
	static const std::string METHOD_WRITE;
	/** Read a PPS object. */
	static const std::string METHOD_READ;
	/** Adjust output verbosity. */
	static const std::string METHOD_SET_VERBOSE;

	/**
	 * Constructor.
	 */
	JPPSPlugin(const std::string& jnextObjectId);

	/**
	 * Destructor.
	 */
	virtual ~JPPSPlugin();

	// Inherited from JSExt
	virtual std::string InvokeMethod(const std::string& strCommand);
	virtual inline bool CanDelete(void) { return true; }

	/**
	 *  Static callback method, changes pArg back into a JPPSPlugin and invokes
	 *  the non-static version of onEvent().
	 */
	static void onEvent(void* pArg, const std::string& sEvent);

private:

	// Disable the default constructor
	JPPSPlugin();

	/**
	 * The non-static version of onEvent. Handler for the PPSInterfaceGlue class' events.
	 */
	void onEvent(const std::string& sEvent) const;

	/**
	 * Open a PPS object.
	 */
	std::string open(std::stringstream& args);

	/**
	 * Close the PPS object.
	 */
	std::string close();

	/**
	 * Write data to the PPS object.
	 */
	std::string write(std::stringstream& args);

	/**
	 * Read the cached PPS data from the last read.
	 */
	std::string read() const;

	/**
	 * Set the verbosity level for logging to slog.
	 */
	std::string setVerbose(std::stringstream& args);

	/** A unique JNext id for this object */
	std::string m_jnextObjId;

	/** The PPS object. */
	PPSInterfaceGlue m_ppsInterface;
};

} /* namespace jpps */
#endif /* JPPSPLUGIN_H_ */
