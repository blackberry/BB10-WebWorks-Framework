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
#include <gmock/gmock.h>
#include <json/reader.h>
#include <semaphore.h>
#include <string>
#include <map>
#include "../push_ndk.hpp"

// Mock Object
class MockPushNDK : public webworks::PushNDK {
public:
    MockPushNDK() : webworks::PushNDK(NULL) {
        sem_init(&m_waitSemaphore, 0, 0);
    }

    virtual ~MockPushNDK() {
        sem_destroy(&m_waitSemaphore);
    }

    MOCK_METHOD1(onCreateSessionComplete, void(const webworks::PushStatus&));
    MOCK_METHOD2(onCreateChannelComplete, void(const webworks::PushStatus&, const std::string&));
    MOCK_METHOD1(onDestroyChannelComplete, void(const webworks::PushStatus&));
    MOCK_METHOD1(onRegisterToLaunchComplete, void(const webworks::PushStatus&));
    MOCK_METHOD1(onUnregisterFromLaunchComplete, void(const webworks::PushStatus&));

    void StartServiceConcrete() {
        std::string invokeTargetId = "net.rim.blackberry.pushtest.target1";
        std::string appId = "1-RDce63it6363";
        std::string ppgUrl = "http://pushapi.eval.blackberry.com";

        StartService(invokeTargetId, appId, ppgUrl);
    }

    void CreateChannelConcrete() {
        CreateChannel();
    }

    void DestroyChannelConcrete() {
        DestroyChannel();
    }

    std::string ExtractPushPayloadConcrete(const std::string& invokeData) {
        return ExtractPushPayload(invokeData);
    }

    void RegisterToLaunchConcrete() {
        RegisterToLaunch();
    }

    void UnregisterFromLaunchConcrete() {
        UnregisterFromLaunch();
    }

    void WaitForCallback() {
        sem_wait(&m_waitSemaphore);
    }

    void DoneCallback() {
        sem_post(&m_waitSemaphore);
    }

private:
    sem_t m_waitSemaphore;
};


// Unit tests

TEST(PushService, CanStartService) {
    MockPushNDK *mock_push = new MockPushNDK;

    EXPECT_CALL(*mock_push, onCreateSessionComplete(::testing::Property(&webworks::PushStatus::getCode, bb::communications::push::PUSH_NO_ERR)))
        .Times(1)
        .WillOnce(::testing::InvokeWithoutArgs(mock_push, &MockPushNDK::DoneCallback));

    mock_push->StartServiceConcrete();
    mock_push->WaitForCallback();

    delete mock_push;
}

TEST(PushService, CanCreateChannel) {
    MockPushNDK *mock_push = new MockPushNDK;

    EXPECT_CALL(*mock_push, onCreateSessionComplete(::testing::Property(&webworks::PushStatus::getCode, bb::communications::push::PUSH_NO_ERR)))
        .Times(1)
        .WillOnce(::testing::InvokeWithoutArgs(mock_push, &MockPushNDK::CreateChannelConcrete));

    EXPECT_CALL(*mock_push, onCreateChannelComplete(::testing::Property(&webworks::PushStatus::getCode, bb::communications::push::PUSH_NO_ERR), ::testing::_))
        .Times(1)
        .WillOnce(::testing::InvokeWithoutArgs(mock_push, &MockPushNDK::DoneCallback));

    mock_push->StartServiceConcrete();
    mock_push->WaitForCallback();

    delete mock_push;
}

TEST(PushService, CanRegisterToLaunch) {
    MockPushNDK *mock_push = new MockPushNDK;

    EXPECT_CALL(*mock_push, onCreateSessionComplete(::testing::Property(&webworks::PushStatus::getCode, bb::communications::push::PUSH_NO_ERR)))
        .Times(1)
        .WillOnce(::testing::InvokeWithoutArgs(mock_push, &MockPushNDK::RegisterToLaunchConcrete));

    EXPECT_CALL(*mock_push, onRegisterToLaunchComplete(::testing::Property(&webworks::PushStatus::getCode, bb::communications::push::PUSH_NO_ERR)))
        .Times(1)
        .WillOnce(::testing::InvokeWithoutArgs(mock_push, &MockPushNDK::DoneCallback));

    mock_push->StartServiceConcrete();
    mock_push->WaitForCallback();

    delete mock_push;
}

TEST(PushService, CanUnregisterFromLaunch) {
    MockPushNDK *mock_push = new MockPushNDK;

    EXPECT_CALL(*mock_push, onCreateSessionComplete(::testing::Property(&webworks::PushStatus::getCode, bb::communications::push::PUSH_NO_ERR)))
        .Times(1)
        .WillOnce(::testing::InvokeWithoutArgs(mock_push, &MockPushNDK::UnregisterFromLaunchConcrete));

    EXPECT_CALL(*mock_push, onUnregisterFromLaunchComplete(::testing::Property(&webworks::PushStatus::getCode, bb::communications::push::PUSH_NO_ERR)))
        .Times(1)
        .WillOnce(::testing::InvokeWithoutArgs(mock_push, &MockPushNDK::DoneCallback));

    mock_push->StartServiceConcrete();
    mock_push->WaitForCallback();

    delete mock_push;
}

TEST(PushService, CanDestroyChannel) {
    MockPushNDK *mock_push = new MockPushNDK;

    EXPECT_CALL(*mock_push, onCreateSessionComplete(::testing::Property(&webworks::PushStatus::getCode, bb::communications::push::PUSH_NO_ERR)))
        .Times(1)
        .WillOnce(::testing::InvokeWithoutArgs(mock_push, &MockPushNDK::CreateChannelConcrete));

    EXPECT_CALL(*mock_push, onCreateChannelComplete(::testing::Property(&webworks::PushStatus::getCode, bb::communications::push::PUSH_NO_ERR), ::testing::_))
        .Times(1)
        .WillOnce(::testing::InvokeWithoutArgs(mock_push, &MockPushNDK::DestroyChannelConcrete));

    EXPECT_CALL(*mock_push, onDestroyChannelComplete(::testing::Property(&webworks::PushStatus::getCode, bb::communications::push::PUSH_NO_ERR)))
        .Times(1)
        .WillOnce(::testing::InvokeWithoutArgs(mock_push, &MockPushNDK::DoneCallback));

    mock_push->StartServiceConcrete();
    mock_push->WaitForCallback();

    delete mock_push;
}

TEST(PushService, CanExtractPushPayload) {
    MockPushNDK *mock_push = new MockPushNDK;

    std::string invoke_data = "cHVzaERhdGE6anNvbjp7InB1c2hJZCI6IkNlM3JjMHlDTVRxLTYzNDc1ODg1NzQzMzA2LjQiLCJwdXNoRGF0YUxlbiI6MTEsImFwcExldmVsQWNrIjowLCJodHRwSGVhZGVycyI6eyJDb250ZW50LVR5cGUiOiJ0ZXh0L3BsYWluOyBjaGFyc2V0PVVURi04IiwiQ29ubmVjdGlvbiI6ImNsb3NlIiwiUHVzaC1NZXNzYWdlLUlEIjoiQ2UzcmMweUNNVHEtNjM0NzU4ODU3NDMzMDYuNCIsIlgtUklNLVBVU0gtU0VSVklDRS1JRCI6IjEtUkRjZTYzaXQ2MzYzIiwieC1yaW0tZGV2aWNlaWQiOiIyOWRkZTQ1NyIsIkNvbnRlbnQtTGVuZ3RoIjoiMTEifX0KAEhlbGxvIHdvcmxk";

    std::string payload_data = mock_push->ExtractPushPayloadConcrete(invoke_data);

    Json::Reader reader;
    Json::Value payload_obj;
    bool parse = reader.parse(payload_data, payload_obj);
    ASSERT_TRUE(parse);

    // Check valid
    EXPECT_TRUE(payload_obj["valid"].asBool());

    // Check payload id
    std::string expected_id = "Ce3rc0yCMTq-63475885743306.4";
    EXPECT_EQ(expected_id, payload_obj["id"].asString());

    // Check isAcknowledgeRequired
    bool expected_isAcknowledgeRequired = false;
    EXPECT_EQ(expected_isAcknowledgeRequired, payload_obj["isAcknowledgeRequired"].asBool());

    // Check payload data (byte array)
    int size = payload_obj["data"].size();
    ASSERT_EQ(11, size);
    Json::UInt expected_data[11] = {72, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100};

    for (int i = 0; i < 11; i++) {
        EXPECT_EQ(expected_data[i], payload_obj["data"][i].asUInt());
    }

    // Check headers
    size = payload_obj["headers"].size();
    EXPECT_EQ(6, size);

    std::map<std::string, std::string> expected_headers;
    expected_headers["Content-Type"] = "text/plain; charset=UTF-8";
    expected_headers["Connection"] = "close";
    expected_headers["Push-Message-ID"] = "Ce3rc0yCMTq-63475885743306.4";
    expected_headers["X-RIM-PUSH-SERVICE-ID"] = "1-RDce63it6363";
    expected_headers["x-rim-deviceid"] = "29dde457";
    expected_headers["Content-Length"] = "11";

    std::map<std::string, std::string>::const_iterator headers_iter;

    for (headers_iter = expected_headers.begin(); headers_iter != expected_headers.end(); headers_iter++) {
        EXPECT_EQ(headers_iter->second, payload_obj["headers"][headers_iter->first].asString());
    }

    delete mock_push;
}

TEST(PushService, ChecksForInvalidPushPayload) {
    MockPushNDK *mock_push = new MockPushNDK;

    std::string invoke_data = "ABC";
    std::string payload_data = mock_push->ExtractPushPayloadConcrete(invoke_data);

    Json::Reader reader;
    Json::Value payload_obj;
    bool parse = reader.parse(payload_data, payload_obj);
    ASSERT_TRUE(parse);

    EXPECT_FALSE(payload_obj["valid"].asBool());
}

int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}

