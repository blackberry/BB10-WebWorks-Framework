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

#ifndef THREAD_H_
#define THREAD_H_

#include <sys/types.h>
#include <string>

namespace jpps {

/**
 * Simple wrapper to simplify thread management.
 */
class Thread {

public:

	/**
	 * Constructor.
	 */
	Thread();

	/**
	 * Destructor.
	 */
	virtual ~Thread();

	/**
	 * Start a thread with the given function. If the thread is already running and has not
	 * been stopped, this does nothing.
	 */
	void start(void* (*start_routine)(void*), void* arg, const std::string& thread_name = "");

	/**
	 * Stop the thread. If the thread isn't running, this does nothing.
	 */
	void stop();

	/**
	 * Is the thread running?
	 */
	inline bool isRunning() const { return (m_threadID >= 0); }

private:

	/** The id of this thread. */
	pthread_t m_threadID;

	/** The attributes of this thread. */
	pthread_attr_t m_attrib;
};

} /* namespace jpps */
#endif /* THREAD_H_ */
