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

#ifndef LOGGER_H_
#define LOGGER_H_

#include <string>

#include <sys/slog.h>
#include <sys/slogcodes.h>

namespace jpps {

/**
 * The Logger class writes messages to the system log. It has a verbosity setting
 * in order to prevent cluttering the slog during normal operation.
 */
class Logger {

public:

	enum slogType {
		info = _SLOG_INFO,
		warning = _SLOG_WARNING,
		error = _SLOG_ERROR,
		critical = _SLOG_CRITICAL,
		debug = _SLOG_DEBUG1
	};

	/**
	 * Default constructor. Sets the verbosity to 0;
	 */
	Logger() : m_verbosity(0) {}

	/**
	 * Destructor.
	 */
	~Logger() {}

	/**
	 * Set the desired level of verbosity. A value of 0 means that only warning,
	 * error and critical messages will appear in the slog. A verbosity of 1 adds
	 * info messages. A verbosity of 2 adds debug messages.
	 */
	inline void setVerbosity(unsigned short value) { m_verbosity = value; }

	/**
	 * Get the current level of verbosity.
	 */
	inline unsigned short getVerbosity() const { return m_verbosity; }

	/**
	 * Used to send messages to the system log (slog).
	 *
	 * @param type The type of slog message.
	 * @param message The message to put in the slog.
	 */
	void slog(const slogType& type, const std::string& message) const {

		// Don't display info or debug when verbosity is set to 0
		if (m_verbosity == 0 && (type == info || type == debug)) return;
		// Don't display debug when verbosity is set to 1
		if (m_verbosity == 1 && type == debug) return;

		::slogf(_SLOG_SETCODE(_SLOGC_GRAPHICS, 300), type, "%s", message.c_str());
	}

private:

	/** The verbosity level.  */
	unsigned short m_verbosity;
};

}

#endif /* LOGGER_H_ */
