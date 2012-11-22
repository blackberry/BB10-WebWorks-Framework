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

#ifndef PPSSERVERGLUE_H_
#define PPSSERVERGLUE_H_

#include "../core/PPSInterface.h"
#include "PluginTypes.h"

// Forward declaration
namespace Json {
class StaticString;
}
namespace jpps {
class PPSEvent;
struct ppsObject;
}

namespace jpps {

/**
 * Act as glue between jpps Server class an the PPSInterface.
 * This class encapsulates a PPS object as a PPS server.
 * TODO: write a better comment
 */
class PPSServerGlue {

public:

	/**
	 * Constructor.
	 */
	PPSServerGlue();

	/**
	 * Destructor.
	 */
	virtual ~PPSServerGlue();

	/**
	 * The browser plugin should set these handlers.
	 *
	 * @param pArg pArg will be passed back to each callback function when it is called.
	 */
	void callbackInit(void* pArg,
					  callback* handleOpen,
					  callback* handleClose,
					  callback* handleClientConnect,
					  callback* handleClientDisconnect,
					  callback* handleMessage,
					  callback* handleOpenFailed,
					  callback* handleSendMessageFailed,
					  callback* handleReceiveMessageFailed);

	/**
	 * Set the verbosity of logging to the slog.
	 */
	void setVerbose(unsigned short v);

	/**
	 * Open a PPS server object.
	 */
	bool open(const std::string& path, int oflags);

	/**
	 * Close this PPS server object.
	 */
	void close();

	/**
	 * Send a message to a particular client.
	 */
	void sendMessage(const std::string& clientID, const std::string& msg);

	/**
	 * Send a message to all clients.
	 */
	void broadcastMessage(const std::string& msg);

	/**
	 * The function that the PPSInterface will call when an event happens.
	 * This is the static function that is used as a function pointer for
	 * PPSInterface::setEventFunc().
	 *
	 * @param event The event PPSInterface is sending.
	 * @param pArg A pointer to a PPSInterfaceGlue object, passed in during
	 * object construction.
	 */
	static void onEvent(void* pArg, const PPSEvent& event);

private:

	/**
	 * The static PPSInterfaceGlue::onEvent() calls this onEvent to do the actual work.
	 */
	void onEvent(const PPSEvent& event);

	/**
	 * Take a ppsObject and turn it into a JSON string to send back to the JavaScript
	 * with a onMessage event.
	 */
	std::string JSONEncodeData(const ppsObject& ppsObj) const;

	/**
	 * Take a JSON string and change it into a PPS consumable string.
	 */
	std::string JSONDecodeData(const std::string& data) const;

	// String names for the various events
	static const std::string EVENT_OPEN;
	static const std::string EVENT_CLOSE;
	static const std::string EVENT_CLIENT_CONNECT;
	static const std::string EVENT_CLIENT_DISCONNECT;
	static const std::string EVENT_MESSAGE;
	static const std::string EVENT_OPEN_FAILED;
	static const std::string EVENT_SEND_MESSAGE_FAILED;
	static const std::string EVENT_RECEIVE_MESSAGE_FAILED;

	/** Custom PPS encoding value: an "n" means a real number. */
	static const std::string ENCODING_N;
	/** Custom PPS encoding value: a "b" means a boolean value. */
	static const std::string ENCODING_B;
	/** Custom PPS encoding value: the data is encoded using JSON. */
	static const std::string ENCODING_JSON;

	// JSON constants
	static const Json::StaticString JSON_DATA;
	static const Json::StaticString JSON_CONNECTION_ID;

	/** The interface this object wraps. */
	PPSInterface m_interface;

	// Handlers for various events
	void* m_pArg;
	callback* m_handleOpen;
	callback* m_handleClose;
	callback* m_handleClientConnect;
	callback* m_handleClientDisconnect;
	callback* m_handleMessage;
	callback* m_handleOpenFailed;
	callback* m_handleSendMessageFailed;
	callback* m_handleReceiveMessageFailed;

};

} /* namespace jpps */
#endif /* PPSSERVERGLUE_H_ */
