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

#include <json/writer.h>
#include <sys/select.h>
#include <pthread.h>
#include <stdio.h>
#include <string>
#include <sstream>
#include <map>
#include <algorithm>
#include "push_js.hpp"
#include "push_ndk.hpp"

namespace webworks {

PushNDK::PushNDK(Push *parent) : m_parent(parent)
{
    m_pPushService = NULL;
    m_fileDescriptor = INVALID_PPS_FILE_DESCRIPTOR;
    m_monitorThread = 0;
    m_shutdownThread = false;
}

PushNDK::~PushNDK()
{
    if (m_monitorThread) {
        stopService();
    }

    if (m_pPushService) {
        delete m_pPushService;
    }
}

void PushNDK::StartService(const std::string& invokeTargetId, const std::string& appId, const std::string& ppgUrl)
{
    if (m_monitorThread) {
        stopService();
    }

    if (m_pPushService) {
        delete m_pPushService;
        m_pPushService = NULL;
    }

    m_invokeTargetId = invokeTargetId;
    m_appId = appId;
    m_ppgUrl = ppgUrl;

    m_pPushService = new PushService(m_appId, m_invokeTargetId);
    m_pPushService->setListener(this);
    m_fileDescriptor = m_pPushService->getPushFd();

    bool started = false;
    m_shutdownThread = false;

    if (m_fileDescriptor == INVALID_PPS_FILE_DESCRIPTOR) {
        fprintf(stderr, "start: Invalid PPS file descriptor.\n");
    } else {
        // Create the Push PPS file descriptor monitor thread
        if (startMonitorThread() == 0) {
            started = true;
        }
    }

    if (started) {
        m_pPushService->createSession();
    } else {
        fprintf(stderr, "StartSession: Failed to create monitor thread.\n");
        onCreateSessionComplete(PushStatus(bb::communications::push::PUSH_ERR_INTERNAL_ERROR));
    }
}

void PushNDK::CreateChannel()
{
    if (m_pPushService) {
        m_pPushService->createChannel(m_ppgUrl);
    } else {
        fprintf(stderr, "CreateChannel: Cannot find PushService object\n");
        onCreateChannelComplete(PushStatus(bb::communications::push::PUSH_ERR_INTERNAL_ERROR), "");
    }
}

void PushNDK::DestroyChannel()
{
    if (m_pPushService) {
        m_pPushService->destroyChannel();
    } else {
        fprintf(stderr, "DestroyChannel: Cannot find PushService object\n");
        onDestroyChannelComplete(PushStatus(bb::communications::push::PUSH_ERR_INTERNAL_ERROR));
    }
}

std::string PushNDK::ExtractPushPayload(const std::string& invokeData)
{
    std::string decoded_data = decodeBase64(invokeData);
    PushPayload pushPayload(reinterpret_cast<const unsigned char *>(decoded_data.c_str()), decoded_data.length());

    Json::Value payload_obj;

    if (pushPayload.isValid()) {
        payload_obj["valid"] = Json::Value(true);

        // Retrieve the push information
        payload_obj["id"] = Json::Value(pushPayload.getId());
        payload_obj["isAcknowledgeRequired"] = Json::Value(pushPayload.isAckRequired());

        // Retrieve the headers
        Json::Value headers;
        std::map<std::string, std::string> headers_map = pushPayload.getHeaders();
        std::map<std::string, std::string>::const_iterator headers_iter;

        for (headers_iter = headers_map.begin(); headers_iter != headers_map.end(); headers_iter++) {
            headers[headers_iter->first] = Json::Value(headers_iter->second);
        }

        payload_obj["headers"] = headers;

        // Retrieve the data (return as byte array)
        const unsigned char *data = pushPayload.getData();
        Json::UInt current;

        for (int i = 0; i < pushPayload.getDataLength(); i++) {
            current = data[i];
            payload_obj["data"].append(Json::Value(current));
        }
    } else {
        payload_obj["valid"] = Json::Value(false);
    }

    // Write the final JSON object
    Json::FastWriter writer;
    return writer.write(payload_obj);
}

void PushNDK::RegisterToLaunch()
{
    if (m_pPushService) {
        m_pPushService->registerToLaunch();
    } else {
        fprintf(stderr, "RegisterToLaunch: Cannot find PushService object\n");
        onRegisterToLaunchComplete(PushStatus(bb::communications::push::PUSH_ERR_INTERNAL_ERROR));
    }
}

void PushNDK::UnregisterFromLaunch()
{
    if (m_pPushService) {
        m_pPushService->unregisterFromLaunch();
    } else {
        fprintf(stderr, "UnregisterFromLaunch: Cannot find PushService object\n");
        onUnregisterFromLaunchComplete(PushStatus(bb::communications::push::PUSH_ERR_INTERNAL_ERROR));
    }
}

void PushNDK::Acknowledge(const std::string& payloadId, bool shouldAccept)
{
    if (m_pPushService) {
        if (shouldAccept) {
            m_pPushService->acceptPush(payloadId);
        } else {
            m_pPushService->rejectPush(payloadId);
        }
    }
}

void PushNDK::onCreateSessionComplete(const PushStatus& status)
{
    std::stringstream ss;
    ss << status.getCode();

    m_parent->NotifyEvent("push.create.callback", ss.str());
}

void PushNDK::onCreateChannelComplete(const PushStatus& status, const std::string& token)
{
    std::stringstream ss;
    ss << status.getCode();
    ss << " ";

    if (status.getCode() == bb::communications::push::PUSH_NO_ERR) {
        ss << token;
        m_parent->NotifyEvent("push.createChannel.callback", ss.str());
    } else {
        m_parent->NotifyEvent("push.createChannel.callback", ss.str());
    }
}

void PushNDK::onDestroyChannelComplete(const PushStatus& status)
{
    std::stringstream ss;
    ss << status.getCode();
    m_parent->NotifyEvent("push.destroyChannel.callback", ss.str());
}

void PushNDK::onRegisterToLaunchComplete(const PushStatus& status)
{
    std::stringstream ss;
    ss << status.getCode();
    m_parent->NotifyEvent("push.launchApplicationOnPush.callback", ss.str());
}

void PushNDK::onUnregisterFromLaunchComplete(const PushStatus& status)
{
    std::stringstream ss;
    ss << status.getCode();
    m_parent->NotifyEvent("push.launchApplicationOnPush.callback", ss.str());
}

void PushNDK::onSimChange()
{
    m_parent->NotifyEvent("push.create.simChangeCallback", "{}");
}

void PushNDK::onPushTransportReady(PushCommand command)
{
    std::stringstream ss;
    ss << command;
    m_parent->NotifyEvent("push.create.pushTransportReadyCallback", ss.str());
}

void PushNDK::MonitorMessages()
{
    fd_set fileDescriptorSet;
    //Initialize the list
    FD_ZERO(&fileDescriptorSet);
    int max_fd = 0;

    // The pipe is used to send a single byte dummy message to unlock the select request in the stop function
    char dummy_pipe_buf[1];
    pipe(m_pipeFileDescriptors);

    while (!m_shutdownThread)
    {
        // Add PPS file descriptor to the set to monitor in the select
        FD_SET(m_fileDescriptor, &fileDescriptorSet);
        max_fd = std::max(max_fd, m_fileDescriptor);

        // Add pipe file descriptor to the set to monitor in the select
        FD_SET(m_pipeFileDescriptors[PIPE_READ_FD], &fileDescriptorSet);
        if (m_pipeFileDescriptors[PIPE_READ_FD] > max_fd) {
            max_fd = m_pipeFileDescriptors[PIPE_READ_FD];
        }

        if ((select(max_fd + 1, &fileDescriptorSet, NULL, NULL, NULL)) > 0) {
            // Check which fileDescriptor that is being monitored by the select has been changed
            if (FD_ISSET(m_fileDescriptor, &fileDescriptorSet)) {
                m_pPushService->processMsg();
            }
            else if (FD_ISSET(m_pipeFileDescriptors[PIPE_READ_FD], &fileDescriptorSet )) {
                // Ignore dummy data
                read(m_pipeFileDescriptors[PIPE_READ_FD], dummy_pipe_buf, sizeof(dummy_pipe_buf));
            }
        }
    }
}

int PushNDK::startMonitorThread()
{
    return pthread_create(&m_monitorThread, NULL, &MonitorMessagesStartThread, static_cast<void *>(this));
}

void* PushNDK::MonitorMessagesStartThread(void* parent)
{
    PushNDK *pParent = static_cast<PushNDK *>(parent);
    pParent->MonitorMessages();

    return NULL;
}

void PushNDK::stopService()
{
    if (!m_monitorThread) {
        return;
    }

    // Write 1 byte to the pipe to wake up the select which will kick out of the loop by setting the boolean below to true
    m_shutdownThread = true;
    if (write(m_pipeFileDescriptors[PIPE_WRITE_FD], "a", 1) < 0) {
        fprintf(stderr, "stop: Failed to write to pipe\n");
    }

    // Wait for other thread to finish
    pthread_join(m_monitorThread, NULL);
    m_monitorThread = 0;
}

std::string PushNDK::decodeBase64(const std::string& encodedString)
{
    static const std::string base64_chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
                                            "abcdefghijklmnopqrstuvwxyz"
                                            "0123456789+/";

    size_t remaining = encodedString.size();
    size_t position;
    int i = 0, current = 0;
    unsigned char current_set[4];
    std::string decoded_string;

    while ((remaining--) && ((position = base64_chars.find(encodedString[current++])) != std::string::npos)) {
        current_set[i++] = static_cast<unsigned char>(position);

        if (i == 4) {
            i = 0;
            decoded_string += (current_set[0] << 2) | ((current_set[1] & 0x30) >> 4);
            decoded_string += ((current_set[1] & 0xf) << 4) | ((current_set[2] & 0x3c) >> 2);
            decoded_string += ((current_set[2] & 0x3) << 6) | current_set[3];
        }
    }

    if (i) {
        if (i >= 2) {
            decoded_string += (current_set[0] << 2) | ((current_set[1] & 0x30) >> 4);
        }

        if (i >= 3) {
            decoded_string += ((current_set[1] & 0xf) << 4) | ((current_set[2] & 0x3c) >> 2);
        }
    }

    return decoded_string;
}

} // namespace webworks

