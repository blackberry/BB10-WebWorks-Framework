/*
 * Copyright (C) 2012 Research In Motion Limited. All rights reserved.
 */

#include "PPSInterface.h"

#include <sstream>

#include <errno.h>
#include <fcntl.h>
#include <ppsparse.h>
#include <string.h>

#include "PPSNotifyGroupManager.h"
#include "PPSEvent.h"

namespace jpps {

// Const statics
const char* PPSInterface::PPS_ROOT = "/pps/";
const int PPSInterface::MaxPPSReadSize = (32 * 1024);

// Static data members
pthread_mutex_t PPSInterface::sm_mutex = PTHREAD_MUTEX_INITIALIZER;
pthread_mutex_t PPSInterface::sm_cond;
volatile bool PPSInterface::sm_firstInitDone = false;
std::map<unsigned int, PPSInterface*> PPSInterface::sm_interfaceLookupTable;

PPSInterface::PPSInterface()
: m_pEventFunc(NULL)
, m_pEventArg(NULL)
, m_interfaceId(0)
, m_fd(-1)
, m_oflags(0)
, m_firstRead(true)
, m_cachedRead()
, m_logger()
{
	// This is used to assign a unique ID to each PPSInterface object
	static unsigned int interfaceIDs = 0;

	::pthread_mutex_lock(&sm_mutex);

	m_interfaceId = interfaceIDs;
	interfaceIDs++; // Increment this so that the next object has a unique id.

	// Add myself to the lookup table
	sm_interfaceLookupTable.insert(std::pair<unsigned int, PPSInterface*>(m_interfaceId, this));

	if (!sm_firstInitDone) {

		// Initialize the condvar
		pthread_condattr_t condAttr;
		::pthread_condattr_init(&condAttr);
		::pthread_condattr_setclock(&condAttr, CLOCK_MONOTONIC);
		::pthread_cond_init(&sm_cond, &condAttr);
		::pthread_condattr_destroy(&condAttr);

		sm_firstInitDone = true;
	}

	::pthread_mutex_unlock(&sm_mutex);
}

PPSInterface::~PPSInterface()
{
	std::ostringstream ostream;
	ostream << "PPSInterface::~PPSInterface() - Destruct fd:" << m_fd << ".";
	m_logger.slog(Logger::debug, ostream.str());

	// Close my open PPS object, if I have one
	close();

	// Remove myself from the lookup table
	sm_interfaceLookupTable.erase(m_interfaceId);
}

void PPSInterface::setVerbose(unsigned short v)
{
	m_logger.setVerbosity(v);
}

void PPSInterface::setEventFunc(const PPSEventFunc* pEventFunc, void* pArg)
{
	m_pEventFunc = pEventFunc;
	m_pEventArg = pArg;
}

bool PPSInterface::open(const std::string& path, int oflag, int mode, bool server)
{
	// If we've already got an open file, fail
	if (m_fd != -1) {

		m_logger.slog(Logger::warning, "PPSInterface::open() Failed - Attempted to open an object that is already open.");
		sendEvent(PPSEvent(PPSEvent::PPS_EVENT_OPEN_FAILED, "Attempted to open an object that is already open."));
		return false;
	}

	std::string errorMsg;
	bool ok = false;

	// Prepend PPS_ROOT to the path if it doesn't start with a '/'
	std::string fullpath = (path[0] != '/' ? PPSInterface::PPS_ROOT : "") + path;

	// This flag is used to prevent the notify thread from performing reads while the
	// open() function is running and doing its first read.
	::pthread_mutex_lock(&sm_mutex);
	m_firstRead = true;
	::pthread_mutex_unlock(&sm_mutex);

	// Remove any options from the path otherwise lstat will fail
	std::string pathNoOptions(fullpath);
	std::size_t nPosOpts = fullpath.rfind('?');

	if (nPosOpts != std::string::npos)
		pathNoOptions = fullpath.substr(0, nPosOpts);

	// There are a few complexities associated with symbolic links.  If
	// the last component of the path is a symlink we have to resolve it
	// since we won't be able to resolve the name when the options are
	// added.  Also we need to get the path relative to the pps filesystem
	// so we can locate the .notify file.  So, if the object already
	// exists, resolve the path.  If it doesn't and O_CREAT is specified
	// resolve the directory it's in, otherwise it's a failure.
	std::string resolvedName;
	char szResolvedName[PATH_MAX+128]; // buffer for use with the C functions

	if (::realpath(pathNoOptions.c_str(), szResolvedName) != NULL) {

		resolvedName = szResolvedName;
		ok = true;
	}
	else if (oflag & O_CREAT) {

		// Chop off the file name, so we can try to resolve the directory
		size_t nPos = pathNoOptions.rfind('/');

		// We found a '/'
		if (nPos != std::string::npos) {

			// Get the directory path
			std::string dirPath = pathNoOptions.substr(0, nPos); // Don't include the '/'

			if (::realpath(dirPath.c_str(), szResolvedName) != NULL) {

				// Concatenate the file name to the resolved directory path
				resolvedName = szResolvedName + pathNoOptions.substr(nPos); // include the '/' at the start
				ok = true;
			}
		}
	}

	if (ok) {

		struct stat info;
		int result = ::lstat(resolvedName.c_str(), &info);

		if (result != 0) {

			// If we failed and we're not creating a non-existent file, it's an error.
			if ((errno != ENOENT) && !(oflag & O_CREAT))
				ok = false;
		}
		else if (S_ISDIR(info.st_mode))
			ok = false;
	}

	if (ok) {

		std::string options;

		// Now lets work with the options to ensure we have a complete version
		std::string pathOptions;
		
		// Get just the stuff after '?'
		size_t nPos = fullpath.rfind('?');

		if (nPos != std::string::npos) {
			pathOptions = fullpath.substr(nPos);
		}

		if ((oflag & O_ACCMODE) != O_WRONLY) {

			// This is used as the return object for the joinNotifyGroup() call
			// It's only valid if joinNotifyGroup() returned true
			std::string groupId;

			PPSNotifyGroupManager::mutexLock();
			PPSNotifyGroupManager& notifyManager = PPSNotifyGroupManager::getInstance();
			bool groupJoined = notifyManager.joinNotifyGroup(resolvedName, groupId);
			PPSNotifyGroupManager::mutexUnlock();

			if (groupJoined) {

				// If we're acting as a server, we use server as an option
				// otherwise we have to specify delta mode.  PPS has a fit
				// if we specify both delta and deltadir so check for this.
				std::string modeExtra;

				// Add in the options we need.  If both server and delta are specified, use only
				// server (it kind of implies delta and at one point pps would not like both being
				// present)
				if (server) {
					modeExtra = ",server";
				}
				// If we have no options or there's no 'deltadir' specified, use delta mode
				else if (pathOptions.empty() || pathOptions.find("deltadir") == std::string::npos) {
					modeExtra = ",delta";
				}

				// We embed the m_interfaceID as a unique identifier that will be passed on to the
				// PPSNotifier. PPSNotifier will use this id in conjunction with getPPSInterface()
				// in order to send this object notifications that content is ready for reading later.
				std::ostringstream ostream;
				ostream << "?" << (pathOptions.empty() ? "" : pathOptions.substr(1) + ",") << "notify="
						<< groupId << ":" << m_interfaceId << modeExtra;
				options = ostream.str();
			}
		}

		if (!options.empty()) {

			resolvedName += options;
		}

		// The big moment... Let's try to actually open the PPS object...
		if (ok) {
			m_fd = ::open(resolvedName.c_str(), oflag, mode);
		}

		// Error opening the PPS object
		if (m_fd < 0) {

			std::ostringstream ostream;
			ostream << "PPSInterface::open() Failed - ::open("
					<< (((oflag & O_ACCMODE) == O_WRONLY) ? "write" :
					   ((oflag & O_ACCMODE) == O_RDONLY) ? "read" :
					   ((oflag & O_ACCMODE) == O_RDWR) ? "r/w" : "???")
					<< ((oflag & O_CREAT) ? ":create" : "")
					<< ") " << resolvedName << " (" << errno << ": " << strerror(errno) << ")";
			m_logger.slog(Logger::warning, ostream.str());
			errorMsg = ostream.str();
		}
		else {
			// Depending on our umask, the permissions might not have
			// been as specified. So if O_CREAT was specified, re-set the
			// permissions.  The object might already exist, but perhaps
			// that's OK too.
			if (oflag & O_CREAT) {
				::fchmod(m_fd, mode);
			}

			m_oflags = oflag;

			std::ostringstream ostream;
			ostream << "PPSInterface::open() - ::open("
					<< (((oflag & O_ACCMODE) == O_WRONLY) ? "write" :
					   ((oflag & O_ACCMODE) == O_RDONLY) ? "read" :
					   ((oflag & O_ACCMODE) == O_RDWR) ? "r/w" : "???")
					<< ((oflag & O_CREAT) ? ":create" : "")
					<< ") " << resolvedName;
			m_logger.slog(Logger::debug, ostream.str());
		}
	}
	// For whatever reason, the path to the PPS object was not valid
	else {
		std::ostringstream ostream;
		ostream << "PPSInterface::open() Failed - ::open("
				<< (((oflag & O_ACCMODE) == O_WRONLY) ? "write" :
				   ((oflag & O_ACCMODE) == O_RDONLY) ? "read" :
				   ((oflag & O_ACCMODE) == O_RDWR) ? "r/w" : "???")
				<< ((oflag & O_CREAT) ? ":create" : "")
				<< ") " << path << " The PPS object could not be resolved properly.";
		m_logger.slog(Logger::warning, ostream.str());
		errorMsg = ostream.str();
	}

	sendEvent(PPSEvent(m_fd >= 0 ? PPSEvent::PPS_EVENT_OPENED : PPSEvent::PPS_EVENT_OPEN_FAILED, errorMsg));

	if (m_fd >= 0 && (oflag & O_ACCMODE) != O_WRONLY) {

		// Perform the initial read
		readFromObject();
	}

	// Tell the other thread we are done with the first read
	::pthread_mutex_lock(&sm_mutex);
	m_firstRead = false;
	::pthread_cond_broadcast(&sm_cond);
	::pthread_mutex_unlock(&sm_mutex);

	return m_fd >= 0;
}

void PPSInterface::write(const std::string& data)
{
	// We're trying to write to an unopened PPS object
	if (m_fd == -1) {

		std::string msg("PPSInterface::write() Failed - Attempting to write to a file that isn't open.");
		m_logger.slog(Logger::warning, msg);
		sendEvent(PPSEvent(PPSEvent::PPS_EVENT_WRITE_FAILED, msg));
	}

	ssize_t ret = ::write(m_fd, data.c_str(), data.length());

	// Debug slog the write call if it was successful
	if (ret >= 0) {

		std::ostringstream ostream;
		ostream << "PPSInterface::write() - fd:" << m_fd << " : \n" << data;
		m_logger.slog(Logger::debug, ostream.str());
	}

	// There was an error writing
	if (ret == -1) {

		std::ostringstream ostream;
		ostream << "PPSInterface::write() Failed - Error writing to fd:" << m_fd << " (" << errno << ": " << strerror(errno) << ")";
		m_logger.slog(Logger::warning, ostream.str());
		sendEvent(PPSEvent(PPSEvent::PPS_EVENT_WRITE_FAILED, ostream.str()));
	}

	// If we wrote successfully and the file is open in read/write mode, then we need to manually update the
	// read cache. When in O_RDWR mode, we do NOT receive notifications of our own write() operations.
	// This means that the cache of read data becomes stale - it is missing the data that we have written
	// to the object ourselves. In this case, we will manually update the cache.
	// NOTE: this seems fraught with peril, but unfortunately there don't seem to be any good solutions to
	// fixing the problem of read/write mode and read() integrity.
	if (ret >= 0 && (m_oflags & O_RDWR)) {

		// We're going to try to fool the ppsparse() method into parsing the data we write.
		char* pWriteData = new char[data.length() + 1];

		// The later call to ppsparse() moves the pWriteData pointer forward, and we need the original pointer
		// in order to properly delete the object later, so let's cache it here
		char* pWriteDataCopy = pWriteData;

		std::strcpy(pWriteData, data.c_str()); // strcpy null terminates for us

		// Parse the write buffer - this should give us a ppsObject with only attributes
		ppsObject parsedData = parsePPSData(pWriteData);

		// The data being written does not include the object name other object properties (duh)
		// So parsedData contains only attribute info. We want to preserve the object name
		// and properties, so lets just copy the ones in the cache into our parsedData struct
		// so that the call to updateCachedReadData() will preserve them (i.e. copy them back)
		parsedData.name = m_cachedRead.name;
		parsedData.flags = m_cachedRead.flags;
		parsedData.options = m_cachedRead.options;
		parsedData.optionMask = m_cachedRead.optionMask;

		// Update the cache
		updateCachedReadData(parsedData);

		// Cleanup our allocated memory
		if (pWriteDataCopy) {

			delete[] pWriteDataCopy;
		}
	}
}

void PPSInterface::sync()
{
	if (m_fd >= 0)
		::fsync(m_fd);
}

void PPSInterface::close()
{
	if (m_fd >= 0) {

		::close(m_fd);
		m_fd = -1;
		m_cachedRead = ppsObject();
		m_oflags = 0;

		sendEvent(PPSEvent(PPSEvent::PPS_EVENT_CLOSED));
	}
}

void PPSInterface::onNotify(NotifyType event)
{
	// We only handle read notifications
	if (event != PPS_READ) {
		return;
	}

	if (m_firstRead) {
		::pthread_mutex_lock(&sm_mutex);
		while (m_firstRead) {
			::pthread_cond_wait(&sm_cond, &sm_mutex);
		}
		::pthread_mutex_unlock(&sm_mutex);
	}

	readFromObject();
}

void PPSInterface::readFromObject()
{
	bool sendFirstReadEvent = m_firstRead;

	// This was a uint8_t - was there a reason?
	char szBuffer[MaxPPSReadSize + 1];
	int bufferLen;

	// Read from the actual PPS file - this call is not blocking
	while ((bufferLen = ::read(m_fd, szBuffer, MaxPPSReadSize)) > 0) {

		if (bufferLen <= MaxPPSReadSize) {

			// Make sure the buffer is null terminated.
			szBuffer[bufferLen] = '\0';

			std::string buf(szBuffer, bufferLen);
			std::ostringstream ostream;
			ostream << "PPSInterface::readFromObject() - fd:" << m_fd << " len:" << bufferLen << "\n" << buf;
			m_logger.slog(Logger::debug, ostream.str());

			// Parse the PPS data
			ppsObject parsedPPS = parsePPSData(szBuffer);

			// Update the cache with the data we just read
			updateCachedReadData(parsedPPS);

			// If this is the first read, then send the first read event.
			if (sendFirstReadEvent) {

				sendEvent(PPSEvent(PPSEvent::PPS_EVENT_FIRST_READ_COMPLETE, "", parsedPPS));
				sendFirstReadEvent = false;
			}
			else {

				sendEvent(PPSEvent(PPSEvent::PPS_EVENT_NEW_DATA, "", parsedPPS));
			}
		}
		else {

			std::ostringstream ostream;
			ostream << "PPSInterface::readFromObject() Failed - fd:" << m_fd << " oversized message len:" << bufferLen << ".";
			m_logger.slog(Logger::warning, ostream.str());
		}
	}

	if (bufferLen == -1) {

		std::ostringstream ostream;
		ostream << "PPSInterface::readFromObject() Failed - Error reading from fd:" << m_fd << " (" << errno << ": " << strerror(errno) << ")";
		m_logger.slog(Logger::warning, ostream.str());
		sendEvent(PPSEvent(PPSEvent::PPS_EVENT_READ_FAILED, ostream.str()));
	}

	// It's possible that we won't go into the while() loop above (sometimes the first read is legitimately empty)
	// in which case, we still need to send a first read complete event
	if (sendFirstReadEvent) {

		// Send an empty first read object
		sendEvent(PPSEvent(PPSEvent::PPS_EVENT_FIRST_READ_COMPLETE, "", ppsObject()));
		sendFirstReadEvent = false;
	}
}

void PPSInterface::sendEvent(const PPSEvent& event) const
{
	if (m_pEventFunc) {
		m_pEventFunc(m_pEventArg, event);
	}
}

PPSInterface* const PPSInterface::getPPSInterface(const unsigned int id)
{
	::pthread_mutex_lock(&sm_mutex);

	std::map<unsigned int, PPSInterface*>::iterator it = sm_interfaceLookupTable.find(id);

	if (it != sm_interfaceLookupTable.end()) {

		::pthread_mutex_unlock(&sm_mutex);
		return (*it).second;
	}

	::pthread_mutex_unlock(&sm_mutex);
	return NULL;
}

ppsObject PPSInterface::parsePPSData(char* data) const
{
	// This is the structure that will contain parsed data for each line of the PPS object
	// It needs to be initialized to NULL
	pps_attrib_t info;
	std::memset(&info, 0, sizeof(info));

	// The return code for each PPS line that gets parsed
	pps_status_t rc;
	ppsObject ppsObj;

	while ((rc = ::ppsparse(&data, NULL, NULL, &info, 0)) != PPS_END) {

		if (rc == -1) {

			std::ostringstream ostream;
			ostream << "PPSInterface::parsePPSData() Failed - Error calling ppsparse() fd:" << m_fd << " (" << errno << ": " << strerror(errno) << ")";
			m_logger.slog(Logger::warning, ostream.str());
			sendEvent(PPSEvent(PPSEvent::PPS_EVENT_READ_FAILED, ostream.str()));
		}

		if (info.flags & PPS_INCOMPLETE) {
			m_logger.slog(Logger::debug, "PPSInterface::parsePPSData - PPS data incomplete.");
		}

		switch (rc) {

			// When the object has been modified, update the object settings
			case PPS_OBJECT:
			case PPS_OBJECT_CREATED:
			case PPS_OBJECT_DELETED:
			case PPS_OBJECT_TRUNCATED:
			{
				ppsObj.name = info.obj_name;
				ppsObj.flags = info.flags;
				ppsObj.options = info.options;
				ppsObj.optionMask = info.option_mask;
				break;
			}

			// An attribute has been updated
			case PPS_ATTRIBUTE:
			case PPS_ATTRIBUTE_DELETED:
			{
				ppsAttribute ppsAttrib;
				ppsAttrib.name = info.attr_name;

				// Value and encoding aren't valid if rc == PPS_ATTRIBUTE_DELETED
				if (rc == PPS_ATTRIBUTE) {

					ppsAttrib.value = info.value;
					ppsAttrib.encoding = info.encoding;
				}

				ppsAttrib.flags = info.flags;
				ppsAttrib.options = info.options;
				ppsAttrib.optionMask = info.option_mask;

				ppsObj.attributes.insert(ppsAttrPair(ppsAttrib.name, ppsAttrib));
				break;
			}

			case PPS_ERROR:
			{
				std::string msg("PPSInterface::parsePPSData() Failed - Error parsing PPS data.");
				m_logger.slog(Logger::warning, msg);
				sendEvent(PPSEvent(PPSEvent::PPS_EVENT_READ_FAILED, msg));
				break;
			}

			case PPS_END:
			default:
				break;
		}

	}

	return ppsObj;
}

void PPSInterface::updateCachedReadData(const ppsObject& newData)
{
	::pthread_mutex_lock(&sm_mutex);

	// Update the object
	m_cachedRead.name = newData.name;
	m_cachedRead.flags = newData.flags;
	m_cachedRead.options = newData.options;
	m_cachedRead.optionMask = newData.optionMask;

	::pthread_mutex_unlock(&sm_mutex);

	// Update the attributes
	for (const_ppsAttrIter it = newData.attributes.begin(); it != newData.attributes.end(); it++) {

		ppsAttribute attr = (*it).second;

		// An attribute is being deleted
		if (attr.flags & PPS_DELETED) {

			::pthread_mutex_lock(&sm_mutex);

			// Look for this attribute in the cache and remove it
			ppsAttrIter findIt = m_cachedRead.attributes.find(attr.name);

			if (findIt != m_cachedRead.attributes.end()) {
				m_cachedRead.attributes.erase(findIt);
			}

			::pthread_mutex_unlock(&sm_mutex);
		}
		// We're adding a new attribute - don't search for it
		else if (attr.flags & PPS_CREATED){

			::pthread_mutex_lock(&sm_mutex);
			m_cachedRead.attributes.insert(ppsAttrPair(attr.name, attr));
			::pthread_mutex_unlock(&sm_mutex);
		}
		else {

			::pthread_mutex_lock(&sm_mutex);

			// Look for this attribute in the cache
			ppsAttrIter findIt = m_cachedRead.attributes.find(attr.name);

			// If we find it, update the attribute values
			if (findIt != m_cachedRead.attributes.end()) {

				(*findIt).second.name = attr.name;
				(*findIt).second.encoding = attr.encoding;
				(*findIt).second.value = attr.value;
				(*findIt).second.flags = attr.flags;
				(*findIt).second.options = attr.options;
				(*findIt).second.optionMask = attr.optionMask;
			}
			// If we don't find it, insert it
			else {
				m_cachedRead.attributes.insert(ppsAttrPair(attr.name, attr));
			}
			::pthread_mutex_unlock(&sm_mutex);
		}
	}
}

} /* namespace jpps */
