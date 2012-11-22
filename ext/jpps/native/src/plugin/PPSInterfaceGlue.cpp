/*
 * Copyright (C) 2012 Research In Motion Limited. All rights reserved.
 */

#include "PPSInterfaceGlue.h"

#include <json/value.h>
#include <json/writer.h>
#include <json/reader.h>

#include <vector>
#include <sstream>

#include <ppsparse.h>

#include "../core/PPSEvent.h"

namespace jpps {

const std::string PPSInterfaceGlue::EVENT_OPEN = "ppsOpened";
const std::string PPSInterfaceGlue::EVENT_OPEN_FAILED = "ppsOpenFailed";
const std::string PPSInterfaceGlue::EVENT_FIRST_READ = "ppsFirstRead";
const std::string PPSInterfaceGlue::EVENT_NEW_DATA = "OnChange";//"ppsNewData";
const std::string PPSInterfaceGlue::EVENT_CLOSE = "ppsClosed";
const std::string PPSInterfaceGlue::EVENT_WRITE_FAILED = "ppsWriteFailed";
const std::string PPSInterfaceGlue::EVENT_READ_FAILED = "ppsReadFailed";

const std::string PPSInterfaceGlue::ENCODING_N = "n";
const std::string PPSInterfaceGlue::ENCODING_B = "b";
const std::string PPSInterfaceGlue::ENCODING_JSON = "json";

const Json::StaticString PPSInterfaceGlue::JSON_REMOVE("remove");
const Json::StaticString PPSInterfaceGlue::JSON_CHANGED("changed");
const Json::StaticString PPSInterfaceGlue::JSON_DATA("data");
const Json::StaticString PPSInterfaceGlue::JSON_OBJNAME("objName");
const Json::StaticString PPSInterfaceGlue::JSON_CHANGE_DATA("changeData");
const Json::StaticString PPSInterfaceGlue::JSON_ALL_DATA("allData");


PPSInterfaceGlue::PPSInterfaceGlue()
: m_interface()
, m_pArg(NULL)
, m_handleOpen(NULL)
, m_handleFirstRead(NULL)
, m_handleNewData(NULL)
, m_handleClose(NULL)
, m_handleOpenFailed(NULL)
, m_handleWriteFailed(NULL)
, m_handleReadFailed(NULL)
{
	m_interface.setEventFunc(onEvent, this);
}

PPSInterfaceGlue::~PPSInterfaceGlue()
{
	m_interface.setEventFunc(NULL);
}

void PPSInterfaceGlue::callbackInit(void* pArg,
								    callback* handleOpen,
								    callback* handleFirstRead,
								    callback* handleNewData,
								    callback* handleClose,
								    callback* handleOpenFailed,
								    callback* handleWriteFailed,
								    callback* handleReadFailed)
{
	m_pArg = pArg;
	m_handleOpen = handleOpen;
	m_handleFirstRead = handleFirstRead;
	m_handleNewData = handleNewData;
	m_handleClose = handleClose;
	m_handleOpenFailed = handleOpenFailed;
	m_handleWriteFailed = handleWriteFailed;
	m_handleReadFailed = handleReadFailed;
}

void PPSInterfaceGlue::setVerbose(unsigned short v)
{
	m_interface.setVerbose(v);
}

bool PPSInterfaceGlue::open(const std::string& path, int oflags)
{
	// We don't expose the "mode" to the JS layer - always create in 0666 mode
	return m_interface.open(path, oflags, 0666, false);
}

void PPSInterfaceGlue::close()
{
	m_interface.close();
}

void PPSInterfaceGlue::sync()
{
	m_interface.sync();
}

void PPSInterfaceGlue::onEvent(void* pArg, const PPSEvent& event)
{
	PPSInterfaceGlue* pGlue = static_cast<PPSInterfaceGlue*>(pArg);

	if (pGlue != NULL)
		pGlue->onEvent(event);
}

void PPSInterfaceGlue::onEvent(const PPSEvent& event)
{
	callback* pFunc = NULL;
	std::string sArg;

	switch (event.getEventType()) {

	case PPSEvent::PPS_EVENT_OPENED:
		pFunc = m_handleOpen;
		sArg = EVENT_OPEN;
		break;

	case PPSEvent::PPS_EVENT_FIRST_READ_COMPLETE:
		pFunc = m_handleFirstRead;
		sArg = EVENT_FIRST_READ + " " + handleNewData(event.getNewData());
		break;

	case PPSEvent::PPS_EVENT_NEW_DATA:
		pFunc = m_handleNewData;
		sArg = EVENT_NEW_DATA + " " + handleNewData(event.getNewData());
		break;

	case PPSEvent::PPS_EVENT_CLOSED:
		pFunc = m_handleClose;
		sArg = EVENT_CLOSE;
		break;

	case PPSEvent::PPS_EVENT_OPEN_FAILED:
		pFunc = m_handleOpenFailed;
		sArg = EVENT_OPEN_FAILED + " " + event.getMessage();
		break;

	case PPSEvent::PPS_EVENT_WRITE_FAILED:
		pFunc = m_handleWriteFailed;
		sArg = EVENT_WRITE_FAILED + " " + event.getMessage();
		break;

	case PPSEvent::PPS_EVENT_READ_FAILED:
		pFunc = m_handleReadFailed;
		sArg = EVENT_READ_FAILED + " " + event.getMessage();
		break;
	}

	if (pFunc != NULL)
		pFunc(m_pArg, sArg);
}

std::string PPSInterfaceGlue::handleNewData(const ppsObject& newData)
{
	Json::Value data(Json::nullValue);
	data[JSON_CHANGE_DATA] = JSONEncodeNewData(newData);
	data[JSON_ALL_DATA] = JSONEncodeRead(m_interface.read());

	Json::FastWriter writer;
	return writer.write(data);
}

std::string PPSInterfaceGlue::read() const
{
	Json::Value data = JSONEncodeRead(m_interface.read());
	Json::FastWriter writer;
	return writer.write(data);
}

Json::Value PPSInterfaceGlue::JSONEncodeRead(const ppsObject& ppsObj) const
{
	// If the ppsObj is empty, we can't encode it
	if (ppsObj.name.empty())
		return "";

	Json::Value readData(Json::nullValue);

	for (const_ppsAttrIter it = ppsObj.attributes.begin(); it != ppsObj.attributes.end(); it++) {

		ppsAttribute ppsAttrib = (*it).second;

		// An attribute was deleted: update the JSON data structure and the event data
		if (ppsAttrib.flags & PPS_DELETED) {

			readData.removeMember(ppsAttrib.name);
		}
		else {

			// The value is a number
			if (ppsAttrib.encoding == ENCODING_N) {

				// Convert the value to floating point
				// istringstream is locale aware - we shouldn't need to perform any special
				// processing in order to properly convert the data to a floating point
				// TODO: test that the istringstream conversion works with a locale
				//       that uses alternate floating point number encoding
				std::istringstream stream(ppsAttrib.value);
				double doubleValue;

				// Try to convert the value to a floating point
				if (!(stream >> doubleValue)) {

					std::string err = EVENT_READ_FAILED + " Failed to convert the string \"" + ppsAttrib.value + "\" to a real number.";
					m_handleReadFailed(m_pArg, err);
					return "";
				}

				readData[ppsAttrib.name] = doubleValue;
			}
			// The value is a boolean
			else if (ppsAttrib.encoding == ENCODING_B) {

				readData[ppsAttrib.name] = (ppsAttrib.value == "true");
			}
			// The value is JSON data
			else if (ppsAttrib.encoding == ENCODING_JSON) {

				Json::Reader reader;
				reader.parse(ppsAttrib.value, readData[ppsAttrib.name]);
			}
			// Just pass the value through as a straight string
			else {

				readData[ppsAttrib.name] = ppsAttrib.value;
			}
		}
	}

	return readData;
}

Json::Value PPSInterfaceGlue::JSONEncodeNewData(const ppsObject& ppsObj) const
{
	// If the ppsObj is empty, we can't encode it
	if (ppsObj.name.empty())
		return "";

	Json::Value eventData(Json::nullValue);

	// Set the PPS object name
	eventData[JSON_OBJNAME] = ppsObj.name.substr(1); // PR 159829 : Remove the pre-pending '@' symbol

	for (const_ppsAttrIter it = ppsObj.attributes.begin(); it != ppsObj.attributes.end(); it++) {

		ppsAttribute ppsAttrib = (*it).second;

		// An attribute was deleted: update the JSON data structure and the event data
		if (ppsAttrib.flags & PPS_DELETED) {

			eventData[JSON_REMOVE][ppsAttrib.name] = true;
		}
		else {

			eventData[JSON_CHANGED][ppsAttrib.name] = true;

			// The value is a number
			if (ppsAttrib.encoding == ENCODING_N) {

				// Convert the value to floating point
				// istringstream is locale aware - we shouldn't need to perform any special
				// processing in order to properly convert the data to a floating point
				// TODO: test that the istringstream conversion works with a locale
				//       that uses alternate floating point number encoding
				std::istringstream stream(ppsAttrib.value);
				double doubleValue;

				// Try to convert the value to a floating point
				if (!(stream >> doubleValue)) {

					std::string err = EVENT_READ_FAILED + " Failed to convert the string \"" + ppsAttrib.value + "\" to a real number.";
					m_handleReadFailed(m_pArg, err);
					return "";
				}

				eventData[JSON_DATA][ppsAttrib.name] = doubleValue;
			}
			// The value is a boolean
			else if (ppsAttrib.encoding == ENCODING_B) {

				eventData[JSON_DATA][ppsAttrib.name] = (ppsAttrib.value == "true");
			}
			// The value is JSON data
			else if (ppsAttrib.encoding == ENCODING_JSON) {

				Json::Reader reader;
				reader.parse(ppsAttrib.value, eventData[JSON_DATA][ppsAttrib.name]);
			}
			// Just pass the value through as a straight string
			else {

				eventData[JSON_DATA][ppsAttrib.name] = ppsAttrib.value;
			}
		}
	}

	return eventData;
}

void PPSInterfaceGlue::write(const std::string& data)
{
    Json::Reader reader;
    Json::Value root;

	bool parsingSuccessful = reader.parse(data, root);

    // If parsing the JSON string fails, return a write error
    if (!parsingSuccessful) {

    	std::string err = EVENT_WRITE_FAILED + " JSON failed to parse the string (\"" + data + "\") to be written. (" + reader.getFormatedErrorMessages() + ")";
        m_handleWriteFailed(m_pArg, err);
        return;
    }

	Json::Value::Members memberNames = root.getMemberNames();

	std::ostringstream output;
	output.precision(15);

	Json::Value member;

	for (unsigned int i = 0; i < memberNames.size(); i++) {

		output << memberNames[i] << ":";
		member = root[memberNames[i]];

		if (member.isObject() || member.isArray()) {

			Json::FastWriter writer;
			output << ENCODING_JSON << ":" << writer.write(member); // write() adds an \n
		}
		else if (member.isBool()) {

			output << ENCODING_B << ":" << member.asString() << std::endl;
		}
		else if (member.isNumeric()) {

			output << ENCODING_N << ":" << member.asDouble() << std::endl;
		}
		else if (member.isString()) {

			output << ":" << member.asString() << std::endl;
		}
		else {

			std::string err = EVENT_WRITE_FAILED + " The string passed in (\"" + data + "\") contains an invalid JSON type.";
			m_handleWriteFailed(m_pArg, err);
			return;
		}
	}

	m_interface.write(output.str());
}

} /* namespace jpps */
