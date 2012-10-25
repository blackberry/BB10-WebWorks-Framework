/*
 * Copyright (C) 2012 Research In Motion Limited. All rights reserved.
 */

#include "PPSNotifyGroupManager.h"

#include <fcntl.h>

#include "PPSNotifier.h"

namespace jpps {

typedef std::map<std::string, PPSNotifier*>::iterator groupIter;
typedef std::map<std::string, PPSNotifier*>::const_iterator const_groupIter;
typedef std::pair<std::string, PPSNotifier*> groupValue;

pthread_mutex_t PPSNotifyGroupManager::sm_mutex = PTHREAD_MUTEX_INITIALIZER;

PPSNotifyGroupManager::PPSNotifyGroupManager()
{

}

PPSNotifyGroupManager::~PPSNotifyGroupManager()
{
	// Delete the allocated memory for all the PPSNotifiers
	for (groupIter it = m_notifyGroups.begin(); it != m_notifyGroups.end(); it++) {

		if ((*it).second != NULL) {

			delete (*it).second;
			(*it).second = NULL;
		}
	}
}

PPSNotifyGroupManager& PPSNotifyGroupManager::getInstance()
{
	// The one and only PPSNotifyGroupManager
	static PPSNotifyGroupManager manager;
	return manager;
}

bool PPSNotifyGroupManager::joinNotifyGroup(const std::string& path, std::string& groupId)
{
	std::string notifyFile;
	std::string notifyPath(path);
	std::size_t nPos = notifyPath.rfind('/');

	// Search through the directories in the string until we find a valid .notify object
	while (nPos != std::string::npos) {

		// Chop off everything after the last '/' to get the path without the PPS object name
		notifyPath = notifyPath.substr(0, nPos);

		// Do we already have a notify group for this path?
		const_groupIter it = m_notifyGroups.find(notifyPath);

		// We found a match!
		if (it != m_notifyGroups.end() && (*it).second != NULL) {

			groupId = (*it).second->getNotifyGroupId();
			return true;
		}

		// Add ".notify?wait" to the notify path, to make it a real file
		notifyFile = notifyPath + "/.notify?wait";

		// Try to open this .notify object
		int fd = ::open(notifyFile.c_str(), O_RDONLY);

		// This is the .notify object to use
		if (fd >= 0) {

			char data[20];
			int len = ::read(fd, data, sizeof(data) - 1);
			// Terminate string to remove the newline char
			data[len > 0 ? len - 1 : 0] = '\0';

			PPSNotifier* pNotifier = new PPSNotifier();
			pNotifier->setNotifyGroupId(std::string(data));
			pNotifier->setNotifyOjbPath(notifyPath);
			pNotifier->setObjFd(::dup(fd));
                        ::close(fd);

			// Add this badboy to our cache of notify groups
			m_notifyGroups.insert(groupValue(notifyPath, pNotifier));

			// Start the notify reading thread
			pNotifier->startNotifyLoop();

			groupId = pNotifier->getNotifyGroupId();
			return true;
		}
		// Keep looking
		else {

			nPos = notifyPath.rfind('/');
		}
	}

	// We didn't find a notify group
	groupId = "";
	return false;
}

} /* namespace jpps */
