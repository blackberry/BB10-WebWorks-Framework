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

#include "filetransfer_js.hpp"
#include "filetransfer_curl.hpp"
#include <pthread.h>
#include <json/reader.h>
#include <string>

FileTransfer::FileTransfer(const std::string& id) : m_id(id)
{
}

FileTransfer::~FileTransfer()
{
}

char* onGetObjList()
{
    // Return list of classes in the object
    static char name[] = "FileTransfer";
    return name;
}

JSExt* onCreateObject(const std::string& className, const std::string& id)
{
    // Make sure we are creating the right class
    if (className != "FileTransfer") {
        return 0;
    }

    return new FileTransfer(id);
}

std::string FileTransfer::InvokeMethod(const std::string& command)
{
    int index = command.find_first_of(" ");

    string strCommand = command.substr(0, index);
    string jsonObject = command.substr(index + 1, command.length());

    if (strCommand == "upload") {
        return StartUploadThread(jsonObject);
    } else if (strCommand == "download") {
        return StartDownloadThread(jsonObject);
    }

    return "";
}

bool FileTransfer::CanDelete()
{
    return true;
}

// Notifies JavaScript of an event
void FileTransfer::NotifyEvent(const std::string& eventId, const std::string& event)
{
    std::string eventString = m_id + " ";
    eventString.append(eventId);
    eventString.append(" ");
    eventString.append(event);
    SendPluginEvent(eventString.c_str(), m_pContext);
}

std::string FileTransfer::StartUploadThread(const std::string& jsonObject)
{
    // Parse the JSON
    Json::Reader reader;
    Json::Value obj;
    bool parse = reader.parse(jsonObject, obj);

    if (!parse) {
        fprintf(stderr, "%s", "error parsing\n");
        return "Cannot parse JSON object";
    }

    // Create a new struct with upload information from the JSON object
    webworks::FileUploadInfo *upload_info = new webworks::FileUploadInfo;
    upload_info->eventId = obj["_eventId"].asString();
    upload_info->sourceFile = obj["filePath"].asString();
    upload_info->targetURL = obj["server"].asString();

    const Json::Value optionsObject = obj["options"];
    upload_info->fileKey = optionsObject["fileKey"].asString();
    upload_info->fileName = optionsObject["fileName"].asString();
    upload_info->mimeType = optionsObject["mimeType"].asString();
    upload_info->chunkedMode = optionsObject["chunkedMode"].asBool();
    upload_info->chunkSize = optionsObject["chunkSize"].asInt()*1024;
    upload_info->windowGroup = optionsObject["windowGroup"].asString();

    const Json::Value paramsObject = optionsObject["params"];
    const Json::Value::Members paramsKeys = paramsObject.getMemberNames();

    for (unsigned int i = 0; i < paramsKeys.size(); ++i) {
        const std::string key = paramsKeys[i];
        upload_info->params.push_back(key);
        upload_info->params.push_back(paramsObject[key].asString());
    }

    upload_info->pParent = this;

    pthread_attr_t thread_attr;
    pthread_attr_init(&thread_attr);
    pthread_attr_setdetachstate(&thread_attr, PTHREAD_CREATE_DETACHED);

    pthread_t thread;
    pthread_create(&thread, &thread_attr, FileUploadThread, static_cast<void *>(upload_info));
    pthread_attr_destroy(&thread_attr);

    if (!thread) {
        return "Cannot create new file transfer thread";
    }

    return "";
}

void* FileTransfer::FileUploadThread(void *args)
{
    webworks::FileTransferCurl *file_transfer = new webworks::FileTransferCurl();
    webworks::FileUploadInfo *upload_info = static_cast<webworks::FileUploadInfo *>(args);

    const std::string result = file_transfer->Upload(upload_info);
    upload_info->pParent->NotifyEvent(upload_info->eventId, result);

    delete upload_info;
    delete file_transfer;
    return NULL;
}

std::string FileTransfer::StartDownloadThread(const std::string& jsonObject)
{
    // Parse the JSON
    Json::Reader reader;
    Json::Value obj;
    bool parse = reader.parse(jsonObject, obj);

    if (!parse) {
        fprintf(stderr, "%s", "error parsing\n");
        return "Cannot parse JSON object";
    }

    // Create a new struct with upload information from the JSON object
    webworks::FileDownloadInfo *download_info = new webworks::FileDownloadInfo;
    download_info->eventId = obj["_eventId"].asString();
    download_info->source = obj["source"].asString();
    download_info->target = obj["target"].asString();
    download_info->windowGroup = obj["windowGroup"].asString();

    download_info->pParent = this;

    pthread_attr_t thread_attr;
    pthread_attr_init(&thread_attr);
    pthread_attr_setdetachstate(&thread_attr, PTHREAD_CREATE_DETACHED);

    pthread_t thread;
    pthread_create(&thread, &thread_attr, FileDownloadThread, static_cast<void *>(download_info));
    pthread_attr_destroy(&thread_attr);

    if (!thread) {
        return "Cannot create new file transfer thread";
    }

    return "";
}

void* FileTransfer::FileDownloadThread(void *args)
{
    webworks::FileTransferCurl *file_transfer = new webworks::FileTransferCurl();
    webworks::FileDownloadInfo *download_info = static_cast<webworks::FileDownloadInfo *>(args);

    const std::string result = file_transfer->Download(download_info);
    download_info->pParent->NotifyEvent(download_info->eventId, result);

    delete download_info;
    delete file_transfer;
    return NULL;
}

