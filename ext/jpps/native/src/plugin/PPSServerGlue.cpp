/*
 * Copyright (C) 2012 Research In Motion Limited. All rights reserved.
 */

#include "PPSServerGlue.h"

#include <json/value.h>
#include <json/writer.h>
#include <json/reader.h>

#include <sstream>

#include <ppsparse.h>
#include <fcntl.h>

namespace jpps {

const std::string PPSServerGlue::EVENT_OPEN = "onOpen";
const std::string PPSServerGlue::EVENT_CLOSE = "onClose";
const std::string PPSServerGlue::EVENT_CLIENT_CONNECT = "onClientConnect";
const std::string PPSServerGlue::EVENT_CLIENT_DISCONNECT = "onClientDisconnect";
const std::string PPSServerGlue::EVENT_MESSAGE = "onMessage";
const std::string PPSServerGlue::EVENT_OPEN_FAILED = "onOpenFailed";
const std::string PPSServerGlue::EVENT_SEND_MESSAGE_FAILED = "onSendMessageFailed";
const std::string PPSServerGlue::EVENT_RECEIVE_MESSAGE_FAILED = "onReceiveMessageFailed";

const std::string PPSServerGlue::ENCODING_N = "n";
const std::string PPSServerGlue::ENCODING_B = "b";
const std::string PPSServerGlue::ENCODING_JSON = "json";

const Json::StaticString PPSServerGlue::JSON_DATA("data");
const Json::StaticString PPSServerGlue::JSON_CONNECTION_ID("clientId");

PPSServerGlue::PPSServerGlue()
: m_interface()
, m_pArg(NULL)
, m_handleOpen(NULL)
, m_handleClose(NULL)
, m_handleClientConnect(NULL)
, m_handleClientDisconnect(NULL)
, m_handleMessage(NULL)
, m_handleOpenFailed(NULL)
, m_handleSendMessageFailed(NULL)
, m_handleReceiveMessageFailed(NULL)
{
	m_interface.setEventFunc(onEvent, this);
}

PPSServerGlue::~PPSServerGlue()
{
	m_interface.setEventFunc(NULL);
}

void PPSServerGlue::callbackInit(void* pArg,
					  callback* handleOpen,
					  callback* handleClose,
					  callback* handleClientConnect,
					  callback* handleClientDisconnect,
					  callback* handleMessage,
					  callback* handleOpenFailed,
					  callback* handleSendMessageFailed,
					  callback* handleReceiveMessageFailed)
{
	m_pArg = pArg;
	m_handleOpen = handleOpen;
	m_handleClose = handleClose;
	m_handleClientConnect = handleClientConnect;
	m_handleClientDisconnect = handleClientDisconnect;
	m_handleMessage = handleMessage;
	m_handleOpenFailed = handleOpenFailed;
	m_handleSendMessageFailed = handleSendMessageFailed;
	m_handleReceiveMessageFailed = handleReceiveMessageFailed;
}


void PPSServerGlue::setVerbose(unsigned short v)
{
	m_interface.setVerbose(v);
}

bool PPSServerGlue::open(const std::string& path, int oflags)
{
	// Make sure we're creating the server, if it doesn't exist
	if (!(oflags & O_CREAT))
		oflags &= O_CREAT;

	// We don't expose the "mode" to the JS layer - always create in 0666 mode
	return m_interface.open(path, oflags, 0666, true);
}

void PPSServerGlue::close()
{
	m_interface.close();
}

void PPSServerGlue::sendMessage(const std::string& clientID, const std::string& msg)
{
	std::string decodedMsg = JSONDecodeData(msg);
	std::string message(clientID + "\n" + decodedMsg);
	m_interface.write(message);
}

void PPSServerGlue::broadcastMessage(const std::string& msg)
{
	m_interface.write(JSONDecodeData(msg));
}

void PPSServerGlue::onEvent(void* pArg, const PPSEvent& event)
{
	PPSServerGlue* pGlue = static_cast<PPSServerGlue*>(pArg);

	if (pGlue != NULL)
		pGlue->onEvent(event);
}

void PPSServerGlue::onEvent(const PPSEvent& event)
{
	callback* pFunc = NULL;
	std::string sArg;

	switch (event.getEventType()) {

	case PPSEvent::PPS_EVENT_OPENED:
		pFunc = m_handleOpen;
		sArg = EVENT_OPEN;
		break;

	// The server doesn't do anything with this event
	case PPSEvent::PPS_EVENT_FIRST_READ_COMPLETE:
		break;

	case PPSEvent::PPS_EVENT_NEW_DATA:
	{
		ppsObject data(event.getNewData());

		// This means a new connection
		if (data.flags & PPS_CREATED) {
			sArg = EVENT_CLIENT_CONNECT;
			pFunc = m_handleClientConnect;
		}
		// This means a connection is closed
		else if (data.flags & PPS_DELETED) {
			sArg = EVENT_CLIENT_DISCONNECT;
			pFunc = m_handleClientDisconnect;
		}
		// We're getting data from the connection
		else {
			sArg = EVENT_MESSAGE;
			pFunc = m_handleMessage;
		}

		sArg += " " + JSONEncodeData(data);

		break;
	}

	case PPSEvent::PPS_EVENT_CLOSED:
		pFunc = m_handleClose;
		sArg = EVENT_CLOSE;
		break;

	case PPSEvent::PPS_EVENT_OPEN_FAILED:
		pFunc = m_handleOpenFailed;
		sArg = EVENT_OPEN_FAILED + " " + event.getMessage();
		break;

	case PPSEvent::PPS_EVENT_WRITE_FAILED:
		pFunc = m_handleSendMessageFailed;
		sArg = EVENT_SEND_MESSAGE_FAILED + " " + event.getMessage();
		break;

	case PPSEvent::PPS_EVENT_READ_FAILED:
		pFunc = m_handleReceiveMessageFailed;
		sArg = EVENT_RECEIVE_MESSAGE_FAILED + event.getMessage();
		break;
	}

	if (pFunc != NULL)
		pFunc(m_pArg, sArg);

}

std::string PPSServerGlue::JSONEncodeData(const ppsObject& ppsObj) const
{
	// If the ppsObj is empty, we can't encode it
	if (ppsObj.name.empty())
		return "";

	Json::Value eventData(Json::nullValue);

	// Set the client id
	// Chop off the '+' or '-' if it's there
	eventData[JSON_CONNECTION_ID] = ppsObj.name;

	for (const_ppsAttrIter it = ppsObj.attributes.begin(); it != ppsObj.attributes.end(); it++) {

		ppsAttribute ppsAttrib = (*it).second;

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

				std::string err = EVENT_RECEIVE_MESSAGE_FAILED + " Failed to convert the string \"" + ppsAttrib.value + "\" to a real number.";
				m_handleReceiveMessageFailed(m_pArg, err);
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

	Json::FastWriter writer;
	return writer.write(eventData);
}

std::string PPSServerGlue::JSONDecodeData(const std::string& data) const
{
	 Json::Reader reader;
	Json::Value root;

	bool parsingSuccessful = reader.parse(data, root);

	// If parsing the JSON string fails, return a write error
	if (!parsingSuccessful) {

		std::string err = EVENT_SEND_MESSAGE_FAILED + " JSON failed to parse the string (\"" + data + "\") to be written. (" + reader.getFormatedErrorMessages() + ")";
		m_handleSendMessageFailed(m_pArg, err);
		return "";
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
			output << ENCODING_JSON << ":" << writer.write(member);
		}
		else if (member.isBool()) {

			output << ENCODING_B << ":" << member.asString();
		}
		else if (member.isNumeric()) {

			output << ENCODING_N << ":" << member.asDouble();
		}
		else if (member.isString()) {

			output << ":" << member.asString();
		}
		else {

			std::string err = EVENT_SEND_MESSAGE_FAILED + " The string passed in (\"" + data + "\") contains an invalid JSON type.";
			m_handleSendMessageFailed(m_pArg, err);
			return "";
		}

		// Make sure we terminate the line
		output << std::endl;
	}

	return output.str();
}

} /* namespace jpps */
