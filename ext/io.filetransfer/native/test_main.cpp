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

#include <gtest/gtest.h>
#include <curl/curl.h>
#include <stdio.h>
#include <string>
#include "../filetransfer_curl.hpp"

int createTestFile(const char *filePath)
{
    FILE *new_file = fopen(filePath, "w");

    if (!new_file) {
        return 1;
    }

    fprintf(new_file, "abcd");
    fclose(new_file);
    return 0;
}

TEST(FileTransfer, DetectsIncorrectUploadFilePath)
{
    CURL *curl = NULL;

    std::string source_file = "/accounts/1000/shared/camera/abcdefg.hij";
    std::string target_url = "http://bojap.com/omg/uploader.php";

    std::string source_escaped(curl_easy_escape(curl, curl_easy_escape(curl, source_file.c_str(), 0), 0));
    std::string target_escaped(curl_easy_escape(curl, curl_easy_escape(curl, target_url.c_str(), 0), 0));

    std::string expected = "upload error 1 " + source_escaped + " " + target_escaped + " 0";

    webworks::FileUploadInfo upload_info;
    upload_info.sourceFile = source_file;
    upload_info.targetURL = target_url;
    upload_info.mimeType = "image/jpeg";
    upload_info.fileKey = "image";
    upload_info.fileName = "new_image.jpg";
    upload_info.chunkedMode = 1;

    webworks::FileTransferCurl file_transfer;
    std::string result = file_transfer.Upload(&upload_info);

    EXPECT_EQ(expected, result);
}

TEST(FileTransfer, DetectsIncorrectUploadURL)
{
    CURL *curl = NULL;

    std::string source_file = "/accounts/1000/shared/documents/filetransfer_test.txt";
    std::string target_url = "http://www.google.com/uploader.php";

    std::string source_escaped(curl_easy_escape(curl, curl_easy_escape(curl, source_file.c_str(), 0), 0));
    std::string target_escaped(curl_easy_escape(curl, curl_easy_escape(curl, target_url.c_str(), 0), 0));

    std::string expected = "upload error 2 " + source_escaped + " " + target_escaped + " 404";

    int file_result = createTestFile(source_file.c_str());
    EXPECT_EQ(0, file_result);

    webworks::FileUploadInfo upload_info;
    upload_info.sourceFile = source_file;
    upload_info.targetURL = target_url;
    upload_info.mimeType = "text/plain";
    upload_info.fileKey = "file";
    upload_info.fileName = "test_file.txt";
    upload_info.chunkedMode = 0;

    webworks::FileTransferCurl file_transfer;
    std::string result = file_transfer.Upload(&upload_info);
    EXPECT_EQ(expected, result);

    remove(source_file.c_str());
}

TEST(FileTransfer, DetectsUploadConnectionError)
{
    CURL *curl = NULL;

    std::string source_file = "/accounts/1000/shared/documents/filetransfer_test.txt";
    std::string target_url = "http://127.0.0.1/uploader.php";

    std::string source_escaped(curl_easy_escape(curl, curl_easy_escape(curl, source_file.c_str(), 0), 0));
    std::string target_escaped(curl_easy_escape(curl, curl_easy_escape(curl, target_url.c_str(), 0), 0));

    std::string expected = "upload error 3 " + source_escaped + " " + target_escaped + " 0";

    int file_result = createTestFile(source_file.c_str());
    EXPECT_EQ(0, file_result);

    webworks::FileUploadInfo upload_info;
    upload_info.sourceFile = source_file;
    upload_info.targetURL = target_url;
    upload_info.mimeType = "text/plain";
    upload_info.fileKey = "file";
    upload_info.fileName = "test_file.txt";
    upload_info.chunkedMode = 0;

    webworks::FileTransferCurl file_transfer;
    std::string result = file_transfer.Upload(&upload_info);
    EXPECT_EQ(expected, result);

    remove(source_file.c_str());
}

TEST(FileTransfer, AllowsRedirectedUploadURL)
{
    CURL *curl = NULL;

    std::string source_file = "/accounts/1000/shared/documents/filetransfer_test.txt";
    std::string target_url = "http://google.com/uploader.php";

    std::string source_escaped(curl_easy_escape(curl, curl_easy_escape(curl, source_file.c_str(), 0), 0));
    std::string target_escaped(curl_easy_escape(curl, curl_easy_escape(curl, target_url.c_str(), 0), 0));

    std::string expected = "upload error 2 " + source_escaped + " " + target_escaped + " 404";

    int file_result = createTestFile(source_file.c_str());
    EXPECT_EQ(0, file_result);

    webworks::FileUploadInfo upload_info;
    upload_info.sourceFile = source_file;
    upload_info.targetURL = target_url;
    upload_info.mimeType = "text/plain";
    upload_info.fileKey = "file";
    upload_info.fileName = "test_file.txt";
    upload_info.chunkedMode = 1;

    webworks::FileTransferCurl file_transfer;
    std::string result = file_transfer.Upload(&upload_info);
    EXPECT_EQ(expected, result);

    remove(source_file.c_str());
}

// Tests for non-existent source
TEST(FileTransfer, Detects404DownloadSource)
{
    CURL *curl = NULL;

    std::string source = "http://www.google.com/hello.jpg";
    std::string target = "/accounts/1000/shared/camera/hello.jpg";

    std::string source_escaped(curl_easy_escape(curl, curl_easy_escape(curl, source.c_str(), 0), 0));
    std::string target_escaped(curl_easy_escape(curl, curl_easy_escape(curl, target.c_str(), 0), 0));

    std::string expected = "download error 1 " + source_escaped + " " + target_escaped + " 404";

    webworks::FileDownloadInfo download_info;
    download_info.source = source;
    download_info.target = target;

    webworks::FileTransferCurl file_transfer;
    std::string result = file_transfer.Download(&download_info);

    EXPECT_EQ(expected, result);
}

// Tests for invalid source
TEST(FileTransfer, DetectsInvalidDownloadSource)
{
    CURL *curl = NULL;

    std::string source = "/hello.jpg";
    std::string target = "/accounts/1000/shared/camera/hello.jpg";

    std::string source_escaped(curl_easy_escape(curl, curl_easy_escape(curl, source.c_str(), 0), 0));
    std::string target_escaped(curl_easy_escape(curl, curl_easy_escape(curl, target.c_str(), 0), 0));

    std::string expected = "download error 2 " + source_escaped + " " + target_escaped + " 0";

    webworks::FileDownloadInfo download_info;
    download_info.source = source;
    download_info.target = target;

    webworks::FileTransferCurl file_transfer;
    std::string result = file_transfer.Download(&download_info);

    EXPECT_EQ(expected, result);
}

// Tests for connetion error
TEST(FileTransfer, DetectsIncorrectDownloadSource)
{
    CURL *curl = NULL;

    std::string source = "http://domain.does.not.exist/hello.jpg";
    std::string target = "/accounts/1000/shared/camera/hello.jpg";

    std::string source_escaped(curl_easy_escape(curl, curl_easy_escape(curl, source.c_str(), 0), 0));
    std::string target_escaped(curl_easy_escape(curl, curl_easy_escape(curl, target.c_str(), 0), 0));

    std::string expected = "download error 3 " + source_escaped + " " + target_escaped + " 0";

    webworks::FileDownloadInfo download_info;
    download_info.source = source;
    download_info.target = target;

    webworks::FileTransferCurl file_transfer;
    std::string result = file_transfer.Download(&download_info);

    EXPECT_EQ(expected, result);
}

// Tests for invalid target (permissions error)
TEST(FileTransfer, DetectsInvalidDownloadTargetPermissions)
{
    CURL *curl = NULL;

    std::string source = "http://www.google.ca/ig/images/jfk/google_color.png";
    std::string target = "/accounts/hello.jpg";

    std::string source_escaped(curl_easy_escape(curl, curl_easy_escape(curl, source.c_str(), 0), 0));
    std::string target_escaped(curl_easy_escape(curl, curl_easy_escape(curl, target.c_str(), 0), 0));

    std::string expected = "download error 4 " + source_escaped + " " + target_escaped + " 0";

    webworks::FileDownloadInfo download_info;
    download_info.source = source;
    download_info.target = target;

    webworks::FileTransferCurl file_transfer;
    std::string result = file_transfer.Download(&download_info);

    EXPECT_EQ(expected, result);
}

int main(int argc, char **argv)
{
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}
