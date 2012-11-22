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

#ifndef PPSNOTIFIER_H_
#define PPSNOTIFIER_H_

#include <string>

#include "../utils/Thread.h"

namespace jpps {

/**
 * PPSNotifier is an encapsulation of an open PPS .notify object. PPSNotifier has a
 * blocking thread dedicated to reading from its .notify object. The thread constantly
 * waits for new notifications in the .notify object.
 *
 * The way the PPS notify mechanism works is that on the first open/read of a .notify object,
 * PPS provides a notify group id. This group id can be used when opening any PPS object to make
 * the PPS object join the notify group.
 *
 * For example, you open a .notify file and the group id returned is "2a3".
 * You subsequently open a PPS object and make it join that notify group:
 *
 * ::open("/pps/myppsobj?notify=2a3:someUniqueValueIDecide");
 *
 * Now, every time myppsobj changes, the .notify file will be updated in the following manner:
 *
 * <code>Notify 2a3:someUniqueValueIDecide</code>
 *
 * For a change to the file. And
 *
 * <code>-2a3:someUniqueValueIDecide</code>
 *
 * if myppsobj is closed.
 *
 * When PPSNotifier reads a notification, the unique value is actually a unique identifier for a
 * PPSInterface object that can be looked up in a global PPSInterface lookup table. Getting the
 * PPSInterface object designated by the unique identifier, PPSNotifier calls PPSInterface::onNotify()
 * to inform the PPSInterface object that there is new data pending or that the file has closed.
 * It is then up to the PPSInterface to decide how to proceed to get that data from myppsobj.
 */
class PPSNotifier {

public:

	/**
	 * Constructor.
	 */
	PPSNotifier();

	/**
	 * Destructor. Note that this destructor will attempt to close the .notify
	 * object's file.
	 */
	virtual ~PPSNotifier();

	/**
	 * Start the notify thread.
	 */
	void startNotifyLoop();

	/**
	 * Get the .notify object's path.
	 *
	 * @return The path to the .notify object.
	 */
	inline std::string getNotifyObjPath() const { return m_notifyObjPath; }

	/**
	 * Set the .notify object's path.
	 *
	 * @param path The path of the .notify object (note that this should not include the
	 * .notify object name).
	 */
	inline void setNotifyOjbPath(const std::string& path) { m_notifyObjPath = path; }

	/**
	 * Get the .notify object's file descriptor.
	 *
	 * @return The file descriptor for the open .notify object.
	 */
	inline int getObjFd() const { return m_notifyObjFd; }

	/**
	 * Set the .notify object's file descriptor.
	 *
	 * @param The file descriptor for the open .notify object.
	 */
	inline void setObjFd(const int fd) { m_notifyObjFd = fd; }

	/**
	 * Set this notifier's .notify group ID (assigned by PPS).
	 *
	 * @param The .notify object's group ID, which is returned by PPS on the first read
	 * of the .notify object.
	 */
	inline std::string getNotifyGroupId() const { return m_notifyGroupId; }

	/**
	 * Get this notifier's .notify group ID (assigned by PPS).
	 *
	 * @return The .notify object's group ID.
	 */
	inline void setNotifyGroupId(const std::string& id) { m_notifyGroupId = id; }

private:

	// Disable the copy constructor
	PPSNotifier(const PPSNotifier& manager);

	// Disable the assignment operator
	PPSNotifier& operator=(const PPSNotifier& rhs);

	/**
	 * Function used to start the thread. Pass this into the Thread::start() function.
	 *
	 * @param pArg A pointer to a PPSNotifier.
	 */
	static void* _notifyLoop(void* pArg);

	/**
	 * The main thread loop. Blocks on reading the .notify file.
	 */
	void notifyLoop();

	/** The path of the .notify file we're monitoring to know when to get data. */
	std::string m_notifyObjPath;

	/** The file descriptor of the .notify file we're monitoring to know when to get data. */
	int m_notifyObjFd;

	/** The .notify group ID assigned by PPS when the group was created. */
	std::string m_notifyGroupId;

	/** The thread I'm running on. */
	Thread m_thread;
};

} /* namespace jpps */
#endif /* PPSNOTIFIER_H_ */
