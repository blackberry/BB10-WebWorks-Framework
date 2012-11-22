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

#ifndef PPS_H_
#define PPS_H_

#include <string>
#include <map>

#include <sys/types.h>

#include "PPSTypes.h"
#include "PPSEvent.h"
#include "../utils/Logger.h"

namespace jpps {

/**
 * This class augments standard PPS functionality by providing events for when PPS objects are opened,
 * closed, have new data, etc.
 *
 * When a PPS object is opened using PPSInterface::open(), the object is opened as part of a notification group
 * managed by PPSNotifyGroupManager. The notification group monitors the PPS object and notifies PPSInterface
 * whenever there is new data available in the PPS object.
 *
 * PPSInterface should be used in order to simplify PPS object monitoring (i.e. watching for new data in a PPS
 * object.) PPSInterface takes over management of watching for new data and uses a notification callback mechanism
 * with a defined set of possible events to inform the client of changes to the PPS object.
 */
class PPSInterface {

public:

	/**
	 * Used with onNotify to allow the PPSNotifier to tell us what type of notification
	 * message it is sending.
	 */
	enum NotifyType {
		/** The .notify object received a notification that data is ready to be read. */
		PPS_READ = 0,
		/** The .notify object received a notification that a file being watched is closing. */
		PPS_CLOSE = 1 };

	/**
	 * Constructor.
	 */
	PPSInterface();

	/**
	 * Destructor.
	 */
	~PPSInterface();

	/**
	 * Set up a function to call to be notified about PPS events.
	 *
	 * @param pEventFunc The function to call whenever an event happens in PPSInterface.
	 * @param pArg An optional parameter that will be passed back to pEventFunc every time it
	 * is called. PPSInterface will not modify pArg.
	 */
	void setEventFunc(const PPSEventFunc* pEventFunc, void* pArg = NULL);

	/**
	 * Enable verbose mode. Increase the number of ÒvÓs to increase verbosity.
	 *
	 * @param v The level of verbosity. A value of 0 is off, 1 shows info messages, 2 shows
	 * debug messages.
	 */
	void setVerbose(unsigned short v);

	/**
	 * Open a PPS object. If the open() call is successful, a PPS_EVENT_OPENED event will be sent.
	 * The PPS object will be read as part of the open operation and the PPS_EVENT_FIRST_READ_COMPLETE
	 * will be sent when the first read is complete. Note that there may be a PPS_EVENT_NEW_DATA
	 * event *before* the PPS_EVENT_FIRST_READ_COMPLETE event, or there may not be.
	 * PPS_EVENT_FIRST_READ_COMPLETE only guarantees that at least one read has been performed, not
	 * that it will be the first read event to fire.
	 *
	 * If the open operation fails, the function returns false and a PPS_EVENT_OPEN_FAILED will be sent.
	 *
	 * @param path The PPS file/directory path.
	 * @param oflags Flags passed to ::open.
	 * @param mode Mode passed to ::open.
	 * @param serverMode If true, open the object in server mode as the server.
	 * @return True if the open was successful, false otherwise.
	 */
	bool open(const std::string& path, int oflags, int mode, bool serverMode);

	/**
	 * Check if this PPS object is open.
	 * @return True if the file is open, false otherwise.
	 */
	inline bool isOpen() const { return m_fd >= 0; }

	/**
	 * Write data to a PPS object.
	 * @param data The data to write to the PPS object.
	 */
	void write(const std::string& data);

	/**
	 * Read PPS data. Note that this reads cached data from the last read performed when a
	 * new data available notification was received.
	 *
	 * @return A structured representation of the PPS object, culled from a call to ppsparse()
	 * a function found in ppsparse.h.
	 */

	inline ppsObject read() const { return m_cachedRead; }

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
	 * Called to notify us that there is data ready to be read.
	 *
	 * @param event The type of event we're being notified about.
	 */
	void onNotify(NotifyType event);

	/**
	 * Given a unique id, return the PPSInterface* matching that id.
	 *
	 * Every PPSInterface object is assigned a unique identifier at construction. This
	 * unique identifier can be used to get a pointer to a PPSInterface at runtime.
	 *
	 * In particular, the PPSNotifier gets notifications with this number embedded in them.
	 * Using this id, the PPSNotifier can callback into the correct PPSInterface instance.
	 *
	 * @param id An id that uniquely identifies a PPSInterface object.
	 * @return a PPSInterface* or NULL if no object matches the given id.
	 */
	static PPSInterface* const getPPSInterface(const unsigned int id);

private:

	/**
	 * Read from the PPS object. Generally this function is called by onNotify() when
	 * the notifier thread is notified that there is data to be read. This function
	 * performs a read() of the PPS object that is non-blocking.
	 */
	void readFromObject();

	/**
	 * Given data from a PPS read, parse the PPS data.
	 */
	ppsObject parsePPSData(char* data) const;

	/**
	 * Given new PPS data, update the cached read value.
	 */
	void updateCachedReadData(const ppsObject& newData);

	/**
	 * Call the function set in setEventFunc() with the given event.
	 *
	 * @param event The event to send.
	 */
	void sendEvent(const PPSEvent& event) const;

	/** The default PPS location. */
	static const char* PPS_ROOT;

	/** The maximum amount of data that can be read from a PPS object. */
	static const int MaxPPSReadSize;

	/** The function to call to notify about PPS events. */
	PPSEventFunc* m_pEventFunc;

	/** An argument that goes with m_pEventFunc. PPSInterface does not modify or use
	 * this parameter - we simply send it back with every m_pEventFunc call. */
	void* m_pEventArg;

	/** An identifier that uniquely identifies this PPSInterface object. This is used to look up
	 * this object in a global table. */
	unsigned int m_interfaceId;

	/** The file descriptor of the PPS object being opened. */
	int m_fd;

	/** The open mode flags used when this object was opened. */
	int m_oflags;

	/** If true, main thread is performing initial open/read of PPS object. This is shared
	 * across threads and needs to be mutexed when accessed.*/
	volatile bool m_firstRead;

	/** The data from the last read performed. */
	ppsObject m_cachedRead;

	/** The logger used to log error messages */
	Logger m_logger;

	/** Mutex used to prevent threads from clobbering each other. */
	static pthread_mutex_t sm_mutex;

	/** Condvar used for multi-thread signaling. */
	static pthread_cond_t sm_cond;

	/** Used to ensure that initialization of statics happens only once. This is shared
	 * across threads and needs to be mutexed when accessed.*/
	static volatile bool sm_firstInitDone;

	/** The PPSNotifier needs a way to transform an id that uniquely identifies a PPSInterface object
	 * into an actual PPSInterface*. When we construct a new PPSInterface, we will assign it a unique id
	 * and we will put the id and the pointer to the object into this table. The table can then be used
	 * to lookup this object from its unique id. */
	static std::map<unsigned int, PPSInterface*> sm_interfaceLookupTable;
};

} /* namespace jpps */
#endif /* PPS_H_ */
