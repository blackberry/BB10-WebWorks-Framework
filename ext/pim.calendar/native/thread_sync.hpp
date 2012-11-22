/*
 * Copyright 2012 Research In Motion Limited.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

#ifndef PIM_CAL_THREAD_SYNC_HPP_
#define PIM_CAL_THREAD_SYNC_HPP_

#include <pthread.h>

class ThreadSync {
public:
    ThreadSync();
    virtual ~ThreadSync() { pthread_mutex_destroy(&m_lock); }
protected:
    int mutex_lock();
    int mutex_unlock();
    pthread_mutex_t m_lock;
};

#endif // PIM_CAL_THREAD_SYNC_HPP_
