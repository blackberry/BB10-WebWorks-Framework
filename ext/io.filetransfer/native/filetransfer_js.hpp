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

#include <plugin.h>
#include <string>

#ifndef FILETRANSFER_JS_H_
#define FILETRANSFER_JS_H_


class FileTransfer : public JSExt
{
public:
    explicit FileTransfer(const std::string& id);
    virtual ~FileTransfer();
    virtual std::string InvokeMethod(const std::string& command);
    virtual bool CanDelete();
    void NotifyEvent(const std::string& eventId, const std::string& event);
    std::string StartUploadThread(const std::string& jsonObject);
    static void* FileUploadThread(void *args);
    std::string StartDownloadThread(const std::string& jsonObject);
    static void* FileDownloadThread(void *args);
private:
    std::string m_id;
};

#endif // FILETRANSFER_JS_H_


