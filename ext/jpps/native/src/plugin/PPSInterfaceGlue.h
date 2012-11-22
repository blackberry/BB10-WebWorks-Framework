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

#ifndef PPSINTERFACEGLUE_H_
#define PPSINTERFACEGLUE_H_

#include "../core/PPSInterface.h"
#include "PluginTypes.h"

#include <json/value.h>

#include <string>

namespace jpps {
class PPSEvent;
struct ppsObject;
}

namespace jpps {

/**
 * This class bridges JavaScript and the native PPSInterface code.
 */
class PPSInterfaceGlue {

public:

	/**
	 * Constructor.
	 */
	PPSInterfaceGlue();

	/**
	 * Destructor.
	 */
	virtual ~PPSInterfaceGlue();

	/**
	 * The browser plugin should set these handlers.
	 *
	 * @param pArg pArg will be passed back to each callback function when it is called.
	 */
	void callbackInit(void* pArg,
					  callback* handleOpen,
					  callback* handleFirstRead,
					  callback* handleNewData,
					  callback* handleClose,
					  callback* handleOpenFailed,
					  callback* handleWriteFailed,
					  callback* handleReadFailed);

	/**
	 * Set the verbosity of logging to the slog.
	 */
	void setVerbose(unsigned short v);

	/**
	 * Open a PPS object.
	 */
	bool open(const std::string& path, int oflags);

	/**
	 * Write to a PPS object.
	 */
	void write(const std::string& data);

	/**
	 * Read from the PPS object. This actually returns the cached value of the last
	 * onNewData event from PPSInteraface, then encodes it as JSON.
	 */
	std::string read() const;

	/**
	 * Close this PPS object.
	 */
	void close();

	/**
	 * Forces all queued I/O operations for this object to finish, synchronizing the file's state.
	 * The function blocks until this is finished.
	 */
	void sync();

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
	 * Handle a new data event.
	 */
	std::string handleNewData(const ppsObject& newData);

	/**
	 * Take a ppsObject and turn it into a JSON string to send back to the JavaScript
	 * with a new data event. This structures the JSON with changed properties and the
	 * data that has changed.
	 */
	Json::Value JSONEncodeNewData(const ppsObject& ppsObj) const;

	/**
	 * Take a ppsObject and turn it into a JSON string to send back to the JavaScript
	 * when a call to read() is made.
	 */
	Json::Value JSONEncodeRead(const ppsObject& ppsObj) const;

	// String names for the various events
	static const std::string EVENT_OPEN;
	static const std::string EVENT_OPEN_FAILED;
	static const std::string EVENT_FIRST_READ;
	static const std::string EVENT_NEW_DATA;
	static const std::string EVENT_CLOSE;
	static const std::string EVENT_READ_FAILED;
	static const std::string EVENT_WRITE_FAILED;

	/** Custom PPS encoding value: an "n" means a real number. */
	static const std::string ENCODING_N;
	/** Custom PPS encoding value: a "b" means a boolean value. */
	static const std::string ENCODING_B;
	/** Custom PPS encoding value: the data is encoded using JSON. */
	static const std::string ENCODING_JSON;

	// JSON constants
	static const Json::StaticString JSON_REMOVE;
	static const Json::StaticString JSON_CHANGED;
	static const Json::StaticString JSON_DATA;
	static const Json::StaticString JSON_OBJNAME;
	static const Json::StaticString JSON_CHANGE_DATA;
	static const Json::StaticString JSON_ALL_DATA;

	/** The interface this object wraps. */
	PPSInterface m_interface;

	// Handlers for various events
	void* m_pArg;
	callback* m_handleOpen;
	callback* m_handleFirstRead;
	callback* m_handleNewData;
	callback* m_handleClose;
	callback* m_handleOpenFailed;
	callback* m_handleWriteFailed;
	callback* m_handleReadFailed;
};

} /* namespace jpps */
#endif /* PPSINTERFACEGLUE_H_ */
