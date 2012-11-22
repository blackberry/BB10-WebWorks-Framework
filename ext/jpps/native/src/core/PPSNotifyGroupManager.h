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

#ifndef PPSNOTIFYGROUPMANAGER_H_
#define PPSNOTIFYGROUPMANAGER_H_

#include <map>
#include <string>
#include <pthread.h>

namespace jpps {

// Forward declaration
class PPSNotifier;


/**
 * The PPSNotifyGroupManager is used to manage a global pool of .notify objects. PPS has a mechanism
 * where every folder can contain a special PPS object ".notify". Opening the .notify object will return
 * a group id on the first read of the .notify object. The group id is used to open the real PPS object
 * for which we desire to receive notifications. Once this is done, the .notify object is the one that will
 * receive change notifications for the real PPS object. In this model, the real PPS object DOES NOT
 * open in blocking read or ionotify/select mode. The .notify object is the one responsible for blocking
 * on read and tracking data publishing.
 *
 * This object is a global singleton - any access to it needs to be wrapped in a mutex to prevent
 * concurrency problems. Two functions mutex_lock() and mutex_unlock() are provided for this purpose.
 */
class PPSNotifyGroupManager
{
public:

	/**
	 * Destructor.
	 */
	virtual ~PPSNotifyGroupManager();

	/**
	 * Get the one and only instance of the PPSNotifier.Always wrap calls to getInstance() in a call to
	 * PPSNotifyGroupManager::mutexLock()/mutexUnlock().
	 */
	static PPSNotifyGroupManager& getInstance();

	/**
	 * Use this function to get the notify group id of the "closest" .notify object in the /pps hierarchy
	 * that contains path.
	 *
	 * The function will go backwards through the directories in path looking for a .notify object. It will return
	 * the group id of the first .notify object it finds on this path. It is the responsibility of the caller
	 * to have the PPS object in path join the notify group by opening the object with the "notify=groupId:val"
	 * option set.
	 *
	 * PPSNotifyGroupManager maintains a pool of opened .notify objects. It is possible for a single .notify object
	 * to have a very disparate (and numerous) set of PPS objects that it monitors. In order to tweak performance
	 * it is advisable that .notify object be created in strategic directories in the /pps directory hierarchy, in
	 * order to spread the load of notification monitoring. Each .notify object opened will spawn a thread that blocks
	 * on reading from the .notify object. Having several .notify objects means having several threads that read
	 * notifications.
	 *
	 * Note that joinNotifyGroup() will NOT create any .notify PPS objects. The /pps/.notify object always exists,
	 * and if the /pps directory hierarchy contains no other .notify objects, /pps/.notify will end up being the
	 * notification group that all objects join.
	 *
	 * Always wrap calls to joinNotifyGroup() in a call to PPSNotifyGroupManager::mutexLock()/mutexUnlock().
	 *
	 * @param The PPS object that wants to join the notify group.
	 * @param groupId The id of the notify group joined. This is an output parameter.
	 * @return True if a notify group was successfully joined, false otherwise. If true, then the groupId
	 * variable will be set.
	 */
	bool joinNotifyGroup(const std::string& path, std::string& groupId);

	/**
	 * Returns how many notification groups the manager is managing.
	 *
	 * @return The number of notification groups (i.e. open .notify objects) in use.
	 */
	inline std::size_t getNumGroups() const { return m_notifyGroups.size(); }

	/**
	 * Should be used to wrap all calls to PPSNotifyGroupManager APIs. Because this is a singleton global
	 * object, multiple threads may try to access this object at one time. It is therefore important to
	 * mutex lock all access to this object.
	 */
	static inline void mutexLock() { pthread_mutex_lock(&sm_mutex); }

	/**
	 * Should be used to wrap all calls to PPSNotifyGroupManager APIs. Because this is a singleton global
	 * object, multiple threads may try to access this object at one time. It is therefore important to
	 * mutex lock all access to this object.
	 */
	static inline void mutexUnlock() { pthread_mutex_unlock(&sm_mutex); }

private:

	/**
	 * Constructor. Private as part of the singleton pattern of this object.
	 */
	PPSNotifyGroupManager();

	// Disable the copy constructor.
	PPSNotifyGroupManager(const PPSNotifyGroupManager& manager);

	// Disable the assignment operator.
	PPSNotifyGroupManager& operator=(const PPSNotifyGroupManager& rhs);

	/** This is a cache of all the .notify objects. */
	std::map<std::string, PPSNotifier*> m_notifyGroups;

	/** Mutex used to prevent threads from clobbering each other. */
	static pthread_mutex_t sm_mutex;
};

} /* namespace jpps */
#endif /* PPSNOTIFYGROUPMANAGER_H_ */
