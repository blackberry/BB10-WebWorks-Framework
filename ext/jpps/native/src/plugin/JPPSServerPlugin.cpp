/*
 * Copyright (C) 2012 Research In Motion Limited. All rights reserved.
 */

#include "JPPSServerPlugin.h"

#include <sstream>

namespace jpps {

const char* JPPSServerPlugin::CLASS_NAME = "PPSServer";

const std::string JPPSServerPlugin::METHOD_OPEN = "Open";
const std::string JPPSServerPlugin::METHOD_CLOSE = "Close";
const std::string JPPSServerPlugin::METHOD_SET_VERBOSE = "SetVerbose";
const std::string JPPSServerPlugin::METHOD_SEND_MESSAGE = "SendMessage";
const std::string JPPSServerPlugin::METHOD_BROADCAST_MESSAGE = "BroadcastMessage";

JPPSServerPlugin::JPPSServerPlugin(const std::string& jnextObjectId)
: m_jnextObjId(jnextObjectId)
, m_ppsServer()
{
	m_ppsServer.callbackInit(this,
							 onEvent,
							 onEvent,
							 onEvent,
							 onEvent,
							 onEvent,
							 onEvent,
							 onEvent,
							 onEvent);
}

JPPSServerPlugin::~JPPSServerPlugin()
{
}

std::string JPPSServerPlugin::InvokeMethod(const std::string& strCommand)
{
	// Parameter sanity check
	if (strCommand == "")
		return std::string(szERROR) + " JPPSServerPlugin::InvokeMethod() called with no method to invoke.";

	// Tokenize the stream of input information
	std::stringstream args(strCommand);
	std::string method;
	args >> method;

	// Invoke the method requested
	if (method == JPPSServerPlugin::METHOD_OPEN) {
		return open(args);
	}
	else if (method == JPPSServerPlugin::METHOD_CLOSE) {
		return close();
	}
	else if (method == JPPSServerPlugin::METHOD_SET_VERBOSE) {
		return setVerbose(args);
	}
	else if (method == JPPSServerPlugin::METHOD_SEND_MESSAGE) {
		return sendMessage(args);
	}
	else if (method == JPPSServerPlugin::METHOD_BROADCAST_MESSAGE) {
		return broadcastMessage(args);
	}

	return std::string(szERROR) + m_jnextObjId + " JPPSServerPlugin::InvokeMethod() - unknown method \"" + method + "\"";
}

std::string JPPSServerPlugin::open(std::stringstream& args)
{
	// We don't have enough args
	if (args.eof())
		return std::string(szERROR) + m_jnextObjId + " JPPSServerPlugin::open() - invalid number of arguments.";

	// Get the arguments
	// 1st arg, the path
	std::string path;
	args >> path;

	// Missing argument
	if (args.eof())
		return std::string(szERROR) + m_jnextObjId + " JPPSServerPlugin::open() - invalid number of arguments.";

	// 2nd arg, the open flags (i.e. O_RDONLY O_CREAT, etc.)
	int oflags = 0;
	args >> oflags;

	bool bRet = m_ppsServer.open(path, oflags);

	return bRet ? std::string(szOK) + m_jnextObjId : std::string(szERROR) + m_jnextObjId + " JPPSServerPlugin::open() - failed to open \"" + path + "\".";
}

std::string JPPSServerPlugin::close()
{
	m_ppsServer.close();
	return szOK + m_jnextObjId;
}

std::string JPPSServerPlugin::setVerbose(std::stringstream& args)
{
	unsigned short verbosity = 0;

	// If no param was passed, default to 0, else read the value
	if (!args.eof())
		args >> verbosity;

	m_ppsServer.setVerbose(verbosity);
	return szOK + m_jnextObjId;
}

std::string JPPSServerPlugin::sendMessage(std::stringstream& args)
{
	// We don't have enough args
	if (args.eof())
		return std::string(szERROR) + m_jnextObjId + " JPPSServerPlugin::sendMessage() - invalid number of arguments.";

	// Get the arguments
	// 1st arg, the clientId
	std::string clientId;
	args >> clientId;

	// We don't have enough args
	if (args.eof())
		return std::string(szERROR) + m_jnextObjId + " JPPSServerPlugin::sendMessage() - invalid number of arguments.";

	// This truncates the buffer from the current position onwards (if you don't do this, you keep
	// the method name that's at the beginning of the args stream)
	args.seekg(1, std::ios_base::cur); 	// Skip the whitespace that was between the clientID and the message
	std::stringstream tmp;
	tmp << args.rdbuf();

	m_ppsServer.sendMessage(clientId, tmp.str());
	return szOK + m_jnextObjId;
}

std::string JPPSServerPlugin::broadcastMessage(std::stringstream& args)
{
	// We don't have enough args
	if (args.eof())
		return std::string(szERROR) + m_jnextObjId + " JPPSServerPlugin::broadcastMessage() - invalid number of arguments.";

	// This truncates the buffer from the current position onwards (if you don't do this, you keep
	// the method name that's at the beginning of the args stream)
	args.seekg(1, std::ios_base::cur); 	// Skip the whitespace that was between the method name and the message
	std::stringstream tmp;
	tmp << args.rdbuf();

	m_ppsServer.broadcastMessage(tmp.str());
	return szOK + m_jnextObjId;
}

void JPPSServerPlugin::onEvent(const std::string& sEvent) const
{
	// We have to add our object Id to the event
	std::string pluginEvent = m_jnextObjId + " " + sEvent;
	SendPluginEvent(pluginEvent.c_str(), m_pContext);
}

void JPPSServerPlugin::onEvent(void* pArg, const std::string& sEvent)
{
	// Cast pArg back to JPPSPlugin and invoke onEvent()
	JPPSServerPlugin* pPlugin = static_cast<JPPSServerPlugin*>(pArg);

	if (pPlugin != NULL)
		pPlugin->onEvent(sEvent);
}

} /* namespace jpps */
