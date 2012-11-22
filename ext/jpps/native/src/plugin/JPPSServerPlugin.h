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

#ifndef JPPSSERVERPLUGIN_H_
#define JPPSSERVERPLUGIN_H_

#include "../common/plugin.h"
#include "PPSServerGlue.h"

namespace jpps {

class JPPSServerPlugin: public JSExt {

public:

	// Constants

	/** The only class supported by this plugin. */
	static const char* CLASS_NAME;

	// List of object methods supported by this extension

	/** Open a PPS object/directory. */
	static const std::string METHOD_OPEN;
	/** Close a PPS object/directory. */
	static const std::string METHOD_CLOSE;
	/** Adjust output verbosity. */
	static const std::string METHOD_SET_VERBOSE;
	/** Send a message to a particular client. */
	static const std::string METHOD_SEND_MESSAGE;
	/** Send a message to all clients. */
	static const std::string METHOD_BROADCAST_MESSAGE;

	/**
	 * Constructor.
	 */
	JPPSServerPlugin(const std::string& jnextObjectId);

	/**
	 * Destructor.
	 */
	virtual ~JPPSServerPlugin();

	// Inherited from JSExt
	virtual std::string InvokeMethod(const std::string& strCommand);
	virtual inline bool CanDelete(void) { return true; }

	/**
	 *  Static callback method, changes pArg back into a JPPSServerPlugin and invokes
	 *  the non-static version of onEvent().
	 */
	static void onEvent(void* pArg, const std::string& sEvent);

private:

	// Disable default constructor.
	JPPSServerPlugin();

	/**
	 * The non-static version of onEvent. Handler for the PPSServerGlue class' events.
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
	 * Set the verbosity level for logging to slog.
	 */
	std::string setVerbose(std::stringstream& args);

	/**
	 * Send a message to a particular client.
	 */
	std::string sendMessage(std::stringstream& args);

	/**
	 * Send a message to all clients.
	 */
	std::string broadcastMessage(std::stringstream& args);

	/** A unique JNext id for this object */
	std::string m_jnextObjId;

	/** The PPS object. */
	PPSServerGlue m_ppsServer;
};

} /* namespace jpps */
#endif /* JPPSSERVERPLUGIN_H_ */
