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

#ifndef PUSH_NDK_H_
#define PUSH_NDK_H_

#include <bb/communications/push/PushErrno.hpp>
#include <bb/communications/push/PushService.hpp>
#include <bb/communications/push/PushPayload.hpp>

#include <pthread.h>
#include <string>
#include "../common/plugin.h"

#define INVALID_PPS_FILE_DESCRIPTOR     -1

class Push;

namespace webworks {

enum PipeFileDescriptor {
       PIPE_READ_FD = 0,
       PIPE_WRITE_FD,
       PIPE_FD_SIZE
};

typedef bb::communications::push::PushListener PushListener;
typedef bb::communications::push::PushService PushService;
typedef bb::communications::push::PushStatus PushStatus;
typedef bb::communications::push::PushPayload PushPayload;

class PushNDK: public PushListener {
public:
    explicit PushNDK(Push *parent);
    virtual ~PushNDK();

    void StartService(const std::string& invokeTargetId, const std::string& appId, const std::string& ppgUrl);
    void CreateChannel();
    void DestroyChannel();
    std::string ExtractPushPayload(const std::string& invokeData);
    void RegisterToLaunch();
    void UnregisterFromLaunch();
    void Acknowledge(const std::string& payloadId, bool shouldAccept);

    static void* MonitorMessagesStartThread(void* parent);
    void MonitorMessages();

// Interfaces defined in PushListener
    virtual void onCreateSessionComplete(const PushStatus& status);
    virtual void onCreateChannelComplete(const PushStatus& status, const std::string& token);
    virtual void onDestroyChannelComplete(const PushStatus& status);
    virtual void onRegisterToLaunchComplete(const PushStatus& status);
    virtual void onUnregisterFromLaunchComplete(const PushStatus& status);
    virtual void onSimChange();

private:
    void stopService();
    int startMonitorThread();
    std::string decodeBase64(const std::string& encodedString);

private:
    Push *m_parent;
    std::string m_invokeTargetId;
    std::string m_appId;
    std::string m_ppgUrl;
    PushService* m_pPushService;
    int m_fileDescriptor;                       // Push service file descriptor
    pthread_t m_monitorThread;
    int m_pipeFileDescriptors[PIPE_FD_SIZE];    // pipe to write dummy data to wake up select
    bool m_shutdownThread;
};

} // namespace webworks

#endif /* PUSH_NDK_H_ */
