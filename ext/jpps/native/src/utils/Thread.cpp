/*
 * Copyright (C) 2012 Research In Motion Limited. All rights reserved.
 */

#include "Thread.h"
#include <pthread.h>
#include "Logger.h"
#include <sstream>
#include <string.h>
#include <errno.h>

namespace jpps {

Thread::Thread()
: m_threadID(-1)
{
	// Init the thread with all defaults
	pthread_attr_init(&m_attrib);
}

Thread::~Thread()
{
	// Dispose of the thread attributes
	pthread_attr_destroy(&m_attrib);
}

void Thread::start(void* (*start_routine)(void*), void* arg, const std::string& thread_name)
{
	// If this thread is already started, you can't start a new one
	if (m_threadID != -1) {
		return;
	}

	// Create a new thread
	if (pthread_create(&m_threadID, &m_attrib, start_routine, arg) != 0) {

		std::ostringstream ostream;
		ostream << "Thread::start() Failed - Failed to create a new thread. "
				<< " (" << errno << ": " << strerror(errno) << ")";

		Logger logger;
		logger.slog(Logger::warning, ostream.str());
	}

	if (!thread_name.empty())
		pthread_setname_np(m_threadID, thread_name.c_str());
}

void Thread::stop()
{
	// If the thread wasn't running, we can't stop it
	if (m_threadID == -1) {
		return;
	}

	// Cancel the thread
	if (pthread_cancel(m_threadID) != 0) {

		std::ostringstream ostream;
		ostream << "Thread::stop() Failed - Failed to cancel thread " << m_threadID << "."
				<< " (" << errno << ": " << strerror(errno) << ")";

		Logger logger;
		logger.slog(Logger::warning, ostream.str());
	}

	// Reset the thread ID
	m_threadID = -1;
}

} /* namespace jpps */
