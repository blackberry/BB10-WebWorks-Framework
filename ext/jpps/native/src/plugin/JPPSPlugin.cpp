/*
 * Copyright (C) 2012 Research In Motion Limited. All rights reserved.
 */

#include "JPPSPlugin.h"

#include <string>
#include <sstream>

namespace jpps {

const char* JPPSPlugin::CLASS_NAME = "PPS";
const std::string JPPSPlugin::METHOD_OPEN = "Open";
const std::string JPPSPlugin::METHOD_CLOSE = "Close";
const std::string JPPSPlugin::METHOD_WRITE = "Write";
const std::string JPPSPlugin::METHOD_READ = "Read";
const std::string JPPSPlugin::METHOD_SET_VERBOSE = "SetVerbose";

JPPSPlugin::JPPSPlugin(const std::string& jnextObjectId)
: m_jnextObjId(jnextObjectId)
, m_ppsInterface()
{
	// We only have one event handler, we'll use it for all events
	m_ppsInterface.callbackInit(this,
								onEvent,
								onEvent,
								onEvent,
								onEvent,
								onEvent,
								onEvent,
								onEvent);
}

JPPSPlugin::~JPPSPlugin()
{

}

std::string JPPSPlugin::InvokeMethod(const std::string& strCommand)
{
	// Parameter sanity check
	if (strCommand == "")
		return std::string(szERROR) + " JPPSPlugin::InvokeMethod() called with no method to invoke.";

	// Tokenize the stream of input information
	std::stringstream args(strCommand);
	std::string method;
	args >> method;

	// Invoke the method requested
	if (method == JPPSPlugin::METHOD_WRITE) {
		return write(args);
	}
	else if (method == JPPSPlugin::METHOD_READ) {
		return read();
	}
	else if (method == JPPSPlugin::METHOD_OPEN) {
		return open(args);
	}
	else if (method == JPPSPlugin::METHOD_CLOSE) {
		return close();
	}
	else if (method == JPPSPlugin::METHOD_SET_VERBOSE) {
		return setVerbose(args);
	}

	return std::string(szERROR) + m_jnextObjId + " JPPSPlugin::InvokeMethod() - unknown method \"" + method + "\"";
}

std::string JPPSPlugin::open(std::stringstream& args)
{
	// We don't have enough args
	if (args.eof())
		return std::string(szERROR) + m_jnextObjId + " JPPSPlugin::open() - invalid number of arguments.";

	// Get the arguments
	// 1st arg, the path
	std::string path;
	args >> path;

	// Missing argument
	if (args.eof())
		return std::string(szERROR) + m_jnextObjId + " JPPSPlugin::open() - invalid number of arguments.";

	// 2nd arg, the open flags (i.e. O_RDONLY O_CREAT, etc.)
	int oflags = 0;
	args >> oflags;

	bool bRet = m_ppsInterface.open(path, oflags);

	return bRet ? std::string(szOK) + m_jnextObjId : std::string(szERROR) + m_jnextObjId + " JPPSPlugin::open() - failed to open \"" + path + "\".";
}

std::string JPPSPlugin::close()
{
	m_ppsInterface.close();
	return szOK + m_jnextObjId;
}

std::string JPPSPlugin::write(std::stringstream& args)
{
	// We don't have enough args
	if (args.eof())
		return std::string(szERROR) + m_jnextObjId + " JPPSPlugin::write() - invalid number of arguments.";

	// This truncates the buffer from the current position onwards (if you don't do this, you keep
	// the method name that's at the beginning of the args stream)
	args.seekg(1, std::ios_base::cur); 	// Skip the initial whitespace that was between the method name and the parameter
	std::stringstream tmp;
	tmp << args.rdbuf();

	m_ppsInterface.write(tmp.str());
	return szOK + m_jnextObjId;
}

std::string JPPSPlugin::read() const
{
	return std::string(szOK) + m_ppsInterface.read();
}

std::string JPPSPlugin::setVerbose(std::stringstream& args)
{
	unsigned short verbosity = 0;

	// If no param was passed, default to 0, else read the value
	if (!args.eof())
		args >> verbosity;

	m_ppsInterface.setVerbose(verbosity);
	return szOK;
}

void JPPSPlugin::onEvent(const std::string& sEvent) const
{
	// We have to add our object Id to the event
	std::string pluginEvent = m_jnextObjId + " " + sEvent;
	SendPluginEvent(pluginEvent.c_str(), m_pContext);
}

void JPPSPlugin::onEvent(void* pArg, const std::string& sEvent)
{
	// Cast pArg back to JPPSPlugin and invoke onEvent()
	JPPSPlugin* pPlugin = static_cast<JPPSPlugin*>(pArg);

	if (pPlugin != NULL)
		pPlugin->onEvent(sEvent);
}

} /* namespace jpps */
