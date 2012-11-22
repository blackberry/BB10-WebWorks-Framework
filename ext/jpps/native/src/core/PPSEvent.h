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

#ifndef PPSEVENT_H_
#define PPSEVENT_H_

#include <string>
#include "PPSTypes.h"

namespace jpps {

/**
 * A class representing a PPS event. Used to notify interested parties when something
 * happens to a PPS object.
 */
class PPSEvent {

public:

	/**
	 * The possible types of this event.
	 */
	enum PPSEventType {
		/** The PPS object's first data read is complete. */
		PPS_EVENT_FIRST_READ_COMPLETE,
		/** The PPS object has new data. */
		PPS_EVENT_NEW_DATA,
		/** The PPS object was successfully opened. */
		PPS_EVENT_OPENED,
		/** A PPS object was closed. */
		PPS_EVENT_CLOSED,
		/** An attempt to open a PPS object failed. */
		PPS_EVENT_OPEN_FAILED,
		/** An attempt to read from a PPS object failed. */
		PPS_EVENT_READ_FAILED,
		/** An attempt to write to a PPS object failed. */
		PPS_EVENT_WRITE_FAILED,
	};

	/**
	 * Constructor.
	 *
	 * @param eventType The type of event this is.
	 * @param data If eventType == PPS_EVENT_NEW_DATA, the new data.
	 */
	PPSEvent(PPSEventType eventType, const std::string& msg = "", const ppsObject& newData = ppsObject())
	: m_eventType(eventType)
	, m_message(msg)
	, m_newData(newData)
	{}

	/**
	 * Destructor.
	 */
	virtual ~PPSEvent() {}

	/**
	 * Get the event type.
	 */
	inline PPSEventType getEventType() const { return m_eventType; }

	/**
	 * Get the message associated with this event.
	 */
	inline std::string getMessage() const { return m_message; }

	/**
	 * Get the new data. This value is only populated if the eventType is PPS_EVENT_NEW_DATA. This data
	 * is what was parsed out of the PPS object.
	 */
	inline ppsObject getNewData() const { return m_newData; }

private:

	// Disable the default constructor.
	PPSEvent();

	/** The type of this event. */
	PPSEventType m_eventType;

	/** A message associated to the event. */
	std::string m_message;

	/** If m_eventType == PPS_EVENT_NEW_DATA, this contains the new data. Else m_newData is empty.
	 * This data is the data that was read from the PPS object, un-massaged. */
	ppsObject m_newData;
};

} /* namespace jpps */
#endif /* PPSEVENT_H_ */
