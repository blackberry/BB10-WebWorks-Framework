/*
 * Copyright (C) 2012 Research In Motion Limited. All rights reserved.
 */

#include "PPSNotifier.h"

#include <sstream>

#include <fcntl.h>

#include "PPSInterface.h"
#include "../utils/Logger.h"

namespace jpps {

PPSNotifier::PPSNotifier()
: m_notifyObjPath("")
, m_notifyObjFd(-1)
, m_notifyGroupId("")
, m_thread()
{

}

PPSNotifier::~PPSNotifier()
{
	// Stop the thread
	m_thread.stop();

	// Close the .notify file
	if (m_notifyObjFd >= 0) {
		::close(m_notifyObjFd);
	}
}

void PPSNotifier::startNotifyLoop()
{
	m_thread.start(_notifyLoop, this, "plugin_jPPS_PPSNotifier(" + m_notifyObjPath + "/.notify)");
}


void* PPSNotifier::_notifyLoop(void* pArg)
{
	// Something is messed up
	if (pArg == NULL)
		return NULL;

	PPSNotifier* pNotifier = static_cast<PPSNotifier*> (pArg);

	// pArg is supposed to be a PPSNotifier object...
	if (pNotifier == NULL)
		return NULL;

	pNotifier->notifyLoop();

	return NULL;
}

void PPSNotifier::notifyLoop()
{
	// Buffer for read() operation
	char szData[256];
	int dataLen;

	// This is a blocking read call: this will wait in this loop forever
	while ((dataLen = ::read(m_notifyObjFd, szData, sizeof(szData)-1)) > 0) {

                szData[dataLen] = '\0';
		std::string data(szData);

		if ((unsigned int)dataLen > sizeof(szData)-1) {

			std::ostringstream ostream;
			ostream << "PPSNotifier::notifyLoop() - Notify read overflow " << dataLen << ".";
			Logger logger;
			logger.slog(Logger::error, ostream.str());
		}

		std::size_t nPos = data.find('\n');

		// While we find linefeeds
		while(nPos != std::string::npos) {

			// Read the first char
			PPSInterface::NotifyType event = data[0] == '-' ? PPSInterface::PPS_CLOSE : PPSInterface::PPS_READ;
			std::size_t nAddrPos = data.find(':');

			if (nAddrPos != std::string::npos) {

				std::string sAddress = data.substr(nAddrPos+1);
				std::size_t nAddrEnd = sAddress.find('\n');

				if (nAddrEnd != std::string::npos) {

					sAddress = sAddress.substr(0, nAddrEnd);

					unsigned int interfaceId = 0;

					std::stringstream ss;
					ss << sAddress;
					ss >> interfaceId;

					PPSInterface* const pPPS = PPSInterface::getPPSInterface(interfaceId);

					if (pPPS) {
						pPPS->onNotify(event);
					}
				}
			}

			// Don't go off the end of the string
			if (++nPos < data.length()) {

				// Remove the stuff up to the first '\n' and look for the next '\n'
				data = data.substr(nPos);
				nPos = data.find('\n');
			}
			else {

				nPos = std::string::npos;
			}
		}
	}
}

} /* namespace jpps */
